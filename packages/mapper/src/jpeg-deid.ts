/**
 * JPEG metadata stripping for de-identified exports (audit P2-7,
 * 2026-06-12).
 *
 * NHI's IHKE3408S03 ships imaging frames as plain JPEGs. PACS exports
 * commonly carry patient demographics in EXIF (APP1) or comment (COM)
 * segments — metadata the de-identify toggle's field masking never
 * touches. With the toggle on, the sync orchestrator runs every frame
 * through stripJpegMetadataBase64 BEFORE the bytes reach either the
 * local bundle mapper or the backend upload.
 *
 * Scope and guarantees:
 *   - Drops APP1 (EXIF / XMP) and COM segments only. APP0 (JFIF),
 *     APP2 (ICC color profile), APP14 (Adobe) and all structural
 *     segments are kept, so decoders render the image identically.
 *   - Pixel data is copied verbatim from SOS onward — no transcode,
 *     consistent with the faithful-transport principle (CLAUDE.md #6;
 *     this runs only under the user's explicit de-identify opt-in).
 *   - Burned-in pixel text (patient banners rendered INTO the image)
 *     cannot be removed without altering clinical pixels — the popup's
 *     de-identify disclaimer says so.
 *   - Defensive: anything that doesn't parse cleanly as a JPEG returns
 *     the input UNCHANGED. Corrupting a clinical image is strictly
 *     worse than leaving metadata in it.
 *
 * Pure JS (no node:crypto / Buffer) so the same code runs in the Manifest V3
 * service worker and in Node — same constraint as helpers.ts.
 */

/** Strip APP1 (EXIF/XMP) + COM segments from JPEG bytes. */
export function stripJpegMetadata(bytes: Uint8Array): Uint8Array {
  // SOI marker required — anything else is not a JPEG; pass through.
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return bytes;

  const keep: Array<[number, number]> = [[0, 2]]; // SOI
  let dropped = false;
  let i = 2;
  while (i + 1 < bytes.length) {
    if (bytes[i] !== 0xff) return bytes; // malformed segment stream — bail untouched
    // Bounds guaranteed by the loop condition; `?? 0` quiets
    // noUncheckedIndexedAccess without a non-null assertion.
    const marker = bytes[i + 1] ?? 0;
    // SOS (start of scan) or EOI: entropy-coded data follows / file ends.
    // Copy the remainder verbatim — metadata segments only appear before SOS.
    if (marker === 0xda || marker === 0xd9) {
      keep.push([i, bytes.length]);
      i = bytes.length;
      break;
    }
    // Standalone markers (no length field): TEM, RST0-7.
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      keep.push([i, i + 2]);
      i += 2;
      continue;
    }
    if (i + 3 >= bytes.length) return bytes; // truncated length field
    const len = ((bytes[i + 2] ?? 0) << 8) | (bytes[i + 3] ?? 0); // includes the 2 length bytes
    const segEnd = i + 2 + len;
    if (len < 2 || segEnd > bytes.length) return bytes; // malformed
    if (marker === 0xe1 || marker === 0xfe) {
      dropped = true; // APP1 (EXIF/XMP) or COM — omit from output
    } else {
      keep.push([i, segEnd]);
    }
    i = segEnd;
  }
  if (!dropped) return bytes; // nothing to strip — return the same reference

  const total = keep.reduce((n, [s, e]) => n + (e - s), 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const [s, e] of keep) {
    out.set(bytes.subarray(s, e), o);
    o += e - s;
  }
  return out;
}

/**
 * Base64 wrapper around stripJpegMetadata — the shape the NHI payload
 * and FHIR Attachment.data both use. Returns the input string unchanged
 * when there is nothing to strip or anything fails to parse.
 */
export function stripJpegMetadataBase64(b64: string): string {
  try {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const stripped = stripJpegMetadata(bytes);
    if (stripped === bytes) return b64;
    // btoa takes a binary string; chunk to avoid call-stack limits on
    // multi-MB frames.
    let s = "";
    const CHUNK = 0x8000;
    for (let i = 0; i < stripped.length; i += CHUNK) {
      s += String.fromCharCode(...stripped.subarray(i, i + CHUNK));
    }
    return btoa(s);
  } catch {
    return b64;
  }
}
