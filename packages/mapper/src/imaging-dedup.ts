// Imaging-item dedup — collapses NHI's multi-channel upload duplicates
// of the same logical study before they reach the FHIR mapper.
//
// Background: NHI's IHKE3408S01 list endpoint can return multiple rows
// per imaging order — one per upload channel (ori_TYPE A/B/C/D/E).
// Each row is assigned its own ipL_CASE_SEQ_NO; when bridge triggers
// each row separately, NHI returns the SAME JPG bytes for each ctype.
// Without dedup, a CT scan that NHI presents as one study in the UI
// gets emitted as N separate DiagnosticReport resources, each with
// the same 10 frames inside. Downstream SMART apps then show 10×N
// frames as if there were many studies.
//
// Mirrors the lab Observation A+B dedup pattern (see CLAUDE.md
// "NHI multi-channel upload — A vs B").
//
// Strategy:
//   1. Group items by (code, date, hospital) — same NHI study = same
//      triplet across channels
//   2. Within each group, hash items by their first frame's content
//      (with a length-suffixed prefix hash — cheap and discriminating)
//      Items without frames get unique sentinel hashes
//   3. Collapse same-hash buckets to one item, with frames merged
//      (union of unique frames across the bucket)
//   4. After bucket merge: if a group contains EXACTLY 1 narrative-
//      only item AND 1 image-only item, fold the narrative's
//      conclusion into the image item — common NHI pattern where
//      one ctype ships narrative + 0 frames and another ships
//      0 narrative + N frames
//
// Edge cases preserved (intentionally NOT collapsed):
//   - Two image items with different content under same (code, date,
//     hospital) — e.g. AP + lateral X-ray. Different first-frame hash
//     → different buckets → both kept.
//   - Items missing code/date/hospital — each gets a unique group key
//     so they never accidentally merge.

import { normalizeNarrativeForDedup } from "./helpers";

/**
 * Cheap content fingerprint for an imaging JPEG base64 string. djb2
 * hash over the first 16 KB of base64 + the total length. Same JPG
 * re-fetched produces identical hash; different scans differ within
 * the first KB due to differing metadata + image data. False positive
 * collisions are statistically negligible for typical NHI payloads.
 */
function frameContentHash(b64: string): string {
  let h = 5381;
  const cap = Math.min(b64.length, 16384);
  for (let i = 0; i < cap; i++) {
    h = ((h << 5) + h + b64.charCodeAt(i)) | 0;
  }
  return `${h >>> 0}:${b64.length}`;
}

interface ImagingItem {
  code?: string;
  date?: string;
  hospital?: string;
  conclusion?: string;
  jpgBase64s?: string[];
  jpgBase64?: string;
  iplCaseSeqNo?: string | null;
  [key: string]: any;
}

/**
 * Dedup imaging items shipped by NHI under multiple ori_TYPE channels
 * for the same logical study.
 *
 * Returns a new array. Original items are NOT mutated; merged "winner"
 * items are shallow-cloned + augmented.
 */
export function dedupImagingItems<T extends ImagingItem>(items: T[]): T[] {
  if (!Array.isArray(items) || items.length === 0) return items;

  // Group by (code, date, hospital). Items missing any of the three
  // get a unique fallback key so they never accidentally merge.
  let unkCounter = 0;
  const groups = new Map<string, T[]>();
  for (const it of items) {
    if (!it) continue;
    const code = String(it.code ?? "");
    const date = String(it.date ?? "");
    const hospital = String(it.hospital ?? "");
    const key =
      code || date || hospital
        ? `${code}|${date}|${hospital}`
        : `__unknown_${unkCounter++}`;
    const arr = groups.get(key);
    if (arr) arr.push(it);
    else groups.set(key, [it]);
  }

  const out: T[] = [];
  for (const group of groups.values()) {
    if (group.length === 1) {
      // Non-null: length-1 guarantee. Backend tsconfig has
      // noUncheckedIndexedAccess so `group[0]` widens to `T | undefined`
      // until we tell TS the length check rules out undefined.
      out.push(group[0]!);
      continue;
    }

    // Hash bucket by first-frame content (or unique empty-sentinel).
    let emptySentinel = 0;
    const byHash = new Map<string, T[]>();
    for (const it of group) {
      const frames = framesOf(it);
      const h =
        frames.length > 0
          ? frameContentHash(frames[0]!)
          : `__empty_${emptySentinel++}`;
      const arr = byHash.get(h);
      if (arr) arr.push(it);
      else byHash.set(h, [it]);
    }

    // Collapse same-content buckets.
    const merged: T[] = [];
    for (const bucket of byHash.values()) {
      if (bucket.length === 1) {
        merged.push(bucket[0]!);
        continue;
      }
      // Multiple items with same content → merge.
      // Pick a base: the one with the longest conclusion (most narrative).
      const winnerBase = bucket.reduce((a, b) =>
        (b.conclusion?.length ?? 0) > (a.conclusion?.length ?? 0) ? b : a,
      );
      const winner: T = { ...winnerBase };
      // Union of frames across bucket, deduped by content hash.
      const seenHashes = new Set<string>();
      const unionFrames: string[] = [];
      for (const it of bucket) {
        for (const f of framesOf(it)) {
          const h = frameContentHash(f);
          if (seenHashes.has(h)) continue;
          seenHashes.add(h);
          unionFrames.push(f);
        }
      }
      if (unionFrames.length > 0) {
        (winner as any).jpgBase64s = unionFrames;
      }
      merged.push(winner);
    }

    // Channel-variant narrative collapse (v0.17.2): NHI ships the SAME
    // radiology narrative through multiple upload channels (ori_TYPE
    // A/B) with cosmetic differences — byte-different, one exam. The
    // frame-content bucketing above can't catch these (they have 0
    // frames → unique empty sentinels), so they'd survive as 2
    // narrative-only items and the fold below (which needs EXACTLY 1
    // narrative) would never fire → study stays split as 2 narratives
    // + 1 image. Collapse them here by normalized conclusion, keeping
    // the most-complete copy.
    //
    // Two collapse relations (both via normalizeNarrativeForDedup, which
    // NFKC-folds + strips whitespace + lowercases — see helpers.ts):
    //
    //   (a) EXACT-equality — pure formatting variants (whitespace, case,
    //       fullwidth/halfwidth slash). Real bug: brain CT 33070B A/B
    //       differing only in "ICH2." vs "ICH 2.".
    //
    //   (b) STRICT-PREFIX — one channel's upload is TRUNCATED mid-report
    //       (dictation cut off), so its normalized text is an exact
    //       prefix of the complete channel's. Real bug: abdomen CT
    //       33072B 2025-02-08 — channel A ends "…ground glass patc"
    //       (missing finding #15) while channel B carries the full
    //       report. Dropping the shorter copy loses ZERO clinical
    //       content because the longer is a strict superset. Two
    //       GENUINELY different exams can't be prefixes of each other —
    //       any differing finding breaks the prefix relation — so this
    //       can't over-merge distinct studies.
    //
    // Winner = the item whose NORMALIZED text is longer (the superset);
    // ties (equal normalized length, i.e. relation (a)) break toward the
    // longer RAW conclusion so we keep the richer original formatting.
    // Genuinely distinct exams under the same (code, date, hospital) —
    // head/neck CT vs chest CT 33070B — are neither equal nor prefix-
    // related → NOT collapsed. Shares normalizeNarrativeForDedup with
    // the mapper's stableId fingerprint so the two routing decisions
    // never drift (CLAUDE.md #7).
    const collapsedMerged: T[] = [];
    const keptNarr: { idx: number; norm: string }[] = [];
    for (const it of merged) {
      if (!isNarrativeOnly(it)) {
        collapsedMerged.push(it);
        continue;
      }
      const norm = normalizeNarrativeForDedup(it.conclusion ?? "");
      let foldedIn = false;
      for (const kept of keptNarr) {
        const prevNorm = kept.norm;
        // Both non-empty guard: an all-whitespace conclusion normalizes
        // to "" and "".startsWith(x) / x.startsWith("") would prefix-
        // match EVERYTHING — never let empty-normalized text merge.
        const prefixRelated =
          norm.length > 0 &&
          prevNorm.length > 0 &&
          (norm === prevNorm || norm.startsWith(prevNorm) || prevNorm.startsWith(norm));
        if (!prefixRelated) continue;
        const prev = collapsedMerged[kept.idx]!;
        const takeNew =
          norm.length > prevNorm.length ||
          (norm.length === prevNorm.length &&
            (it.conclusion?.length ?? 0) > (prev.conclusion?.length ?? 0));
        if (takeNew) {
          collapsedMerged[kept.idx] = it;
          kept.norm = norm;
        }
        foldedIn = true;
        break;
      }
      if (!foldedIn) {
        keptNarr.push({ idx: collapsedMerged.length, norm });
        collapsedMerged.push(it);
      }
    }

    // Post-merge fold: if exactly 1 narrative-only + 1 image-only
    // remain in the merged set, fold narrative's missing fields into
    // image. Handles the common NHI shape where channel A ships
    // narrative + 0 frames and channel B ships 0 narrative + N frames.
    const narrativeOnly = collapsedMerged.filter(isNarrativeOnly);
    const imageItems = collapsedMerged.filter(hasFrames);

    if (narrativeOnly.length === 1 && imageItems.length === 1) {
      // Non-null on both: length-1 guarantee from the surrounding
      // condition; backend's noUncheckedIndexedAccess setting would
      // otherwise widen each to `T | undefined`.
      const narr = narrativeOnly[0]!;
      const img = imageItems[0]!;
      // Fill in fields img is missing FROM narr. Don't overwrite
      // anything img already has — img is authoritative because it
      // ships the actual JPGs + the iplCaseSeqNo we used to fetch them.
      for (const k of Object.keys(narr)) {
        const imgVal = (img as any)[k];
        const narrVal = (narr as any)[k];
        const isMissing =
          imgVal == null ||
          imgVal === "" ||
          (Array.isArray(imgVal) && imgVal.length === 0);
        if (isMissing && narrVal != null && narrVal !== "") {
          (img as any)[k] = narrVal;
        }
      }
      // Keep img + anything else that isn't narr or img.
      out.push(img);
      for (const it of collapsedMerged) {
        if (it !== narr && it !== img) out.push(it);
      }
    } else {
      // Either multiple narratives, multiple distinct images, or some
      // other shape — keep all (don't risk over-collapsing).
      out.push(...collapsedMerged);
    }
  }

  // ── Cross-code content dedup pass ──────────────────────────────────
  // Within (date, hospital), if multiple items have byte-identical
  // frame content but were emitted under DIFFERENT codes, collapse to
  // one. Real-world case (F10375XXXX 2026-06-05): NHI billing data
  // contained codes 32022C + 32023C for the same physical pelvis X-ray
  // study; same hospital uploaded identical JPG bytes under both codes
  // ("骨盆及髖關節檢查" order_NAME on both). The per-group dedup above
  // collapses within-code duplicates but keeps these as 2 separate
  // DiagnosticReports — downstream apps then show the same image
  // twice, confusing users.
  //
  // Safety: this pass collapses ONLY when frame content is byte-equal
  // (sorted hash signature match). Multi-view exams (AP+lateral of
  // same study) have distinct frame content → distinct signatures →
  // NOT collapsed. Same-day repeat scans (氣胸 follow-up X-ray)
  // captured at different times → distinct content → NOT collapsed.
  // Only true byte-identical re-uploads under multiple codes collapse.
  //
  // Resolution: keep the item whose code sorts smallest (deterministic,
  // typically the "primary" billing code in NHI's catalogue ordering).
  // Other codes are dropped from output. Narrative-only items are
  // never collapsed by this pass — they have no frame content to
  // compare against.
  function contentSignatureOf(item: ImagingItem): string | null {
    const frames = framesOf(item);
    if (frames.length === 0) return null;
    const hashes = frames.map(frameContentHash).sort();
    return hashes.join("|");
  }

  const finalOut: T[] = [];
  const byContentKey = new Map<string, { item: T; index: number }>();
  for (const it of out) {
    const sig = contentSignatureOf(it);
    if (!sig) {
      finalOut.push(it);
      continue;
    }
    const date = String(it.date ?? "");
    const hospital = String(it.hospital ?? "");
    if (!date || !hospital) {
      finalOut.push(it);
      continue;
    }
    const key = `${date}|${hospital}|${sig}`;
    const existing = byContentKey.get(key);
    if (!existing) {
      byContentKey.set(key, { item: it, index: finalOut.length });
      finalOut.push(it);
      continue;
    }
    // Cross-code content duplicate. Keep the one with the
    // lexicographically smaller code (deterministic + typically
    // matches NHI's primary-code convention).
    const existingCode = String(existing.item.code ?? "");
    const itCode = String(it.code ?? "");
    if (itCode < existingCode) {
      finalOut[existing.index] = it;
      byContentKey.set(key, { item: it, index: existing.index });
    }
    // else: existing wins; drop this duplicate.
  }
  return finalOut;
}

function framesOf(item: ImagingItem): string[] {
  if (Array.isArray(item.jpgBase64s)) {
    return item.jpgBase64s.filter(
      (s) => typeof s === "string" && s.length > 0,
    );
  }
  if (typeof item.jpgBase64 === "string" && item.jpgBase64.length > 0) {
    return [item.jpgBase64];
  }
  return [];
}

function isNarrativeOnly(item: ImagingItem): boolean {
  return (
    framesOf(item).length === 0 &&
    typeof item.conclusion === "string" &&
    item.conclusion.length > 0
  );
}

function hasFrames(item: ImagingItem): boolean {
  return framesOf(item).length > 0;
}
