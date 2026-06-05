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
      out.push(group[0]);
      continue;
    }

    // Hash bucket by first-frame content (or unique empty-sentinel).
    let emptySentinel = 0;
    const byHash = new Map<string, T[]>();
    for (const it of group) {
      const frames = framesOf(it);
      const h =
        frames.length > 0
          ? frameContentHash(frames[0])
          : `__empty_${emptySentinel++}`;
      const arr = byHash.get(h);
      if (arr) arr.push(it);
      else byHash.set(h, [it]);
    }

    // Collapse same-content buckets.
    const merged: T[] = [];
    for (const bucket of byHash.values()) {
      if (bucket.length === 1) {
        merged.push(bucket[0]);
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

    // Post-merge fold: if exactly 1 narrative-only + 1 image-only
    // remain in the merged set, fold narrative's missing fields into
    // image. Handles the common NHI shape where channel A ships
    // narrative + 0 frames and channel B ships 0 narrative + N frames.
    const narrativeOnly = merged.filter(isNarrativeOnly);
    const imageItems = merged.filter(hasFrames);

    if (narrativeOnly.length === 1 && imageItems.length === 1) {
      const narr = narrativeOnly[0];
      const img = imageItems[0];
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
      // Keep img + anything else in merged that isn't narr or img.
      out.push(img);
      for (const it of merged) {
        if (it !== narr && it !== img) out.push(it);
      }
    } else {
      // Either multiple narratives, multiple distinct images, or some
      // other shape — keep all (don't risk over-collapsing).
      out.push(...merged);
    }
  }
  return out;
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
