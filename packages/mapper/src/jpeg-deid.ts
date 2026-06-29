/**
 * Image metadata stripping for de-identified exports (audit P2-7,
 * 2026-06-12; GIF support added 2026-06-29).
 *
 * NHI's IHKE3408S03 ships imaging frames as base64 image bytes. Despite the
 * "JPG" naming all over 健康存摺 (jpG_STATUS, the IHKE3408 "JPG" trigger), the
 * bytes are in practice **GIF89a**, not JPEG (live-verified 2026-06-29: 284/284
 * captured frames were GIF89a, 0 JPEG). A future JPEG channel is still possible,
 * so this module sniffs the magic number and handles BOTH:
 *
 *   - JPEG: drops APP1 (EXIF / XMP) and COM segments. APP0 (JFIF), APP2 (ICC),
 *     APP14 (Adobe) and all structural segments are kept.
 *   - GIF87a/89a: drops Comment (0x21 0xFE), Application (0x21 0xFF) and Plain
 *     Text (0x21 0x01) extension blocks — the blocks that can carry free text /
 *     embedded demographics (e.g. an XMP Data application extension). Graphic
 *     Control extensions, image data, palettes and the trailer are kept.
 *
 * Why it matters: PACS exports commonly carry patient demographics in image
 * metadata that the de-identify toggle's field masking never touches. Before
 * this module learned GIF, stripJpegMetadata's JPEG-only SOI gate let every NHI
 * frame through UNCHANGED — the de-identification was a silent no-op for the
 * exact format NHI actually ships.
 *
 * Scope and guarantees (both formats):
 *   - Pixel data is copied verbatim — no transcode, consistent with the
 *     faithful-transport principle (CLAUDE.md #6; this runs only under the
 *     user's explicit de-identify opt-in).
 *   - Burned-in pixel text (patient banners rendered INTO the image) cannot be
 *     removed without altering clinical pixels — the popup's de-identify
 *     disclaimer says so.
 *   - Defensive: anything that doesn't parse cleanly returns the input
 *     UNCHANGED. Corrupting a clinical image is strictly worse than leaving
 *     metadata in it.
 *
 * Pure JS (no node:crypto / Buffer) so the same code runs in the Manifest V3
 * service worker and in Node — same constraint as helpers.ts.
 */

export type ImageFormat = "jpeg" | "gif" | "unknown";

/** Sniff the image container from its leading magic bytes. */
export function detectImageFormat(bytes: Uint8Array): ImageFormat {
  // JPEG: SOI marker FF D8.
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xd8) return "jpeg";
  // GIF: "GIF" + "87a" | "89a".
  if (
    bytes.length >= 6 &&
    bytes[0] === 0x47 && // G
    bytes[1] === 0x49 && // I
    bytes[2] === 0x46 && // F
    bytes[3] === 0x38 && // 8
    (bytes[4] === 0x37 || bytes[4] === 0x39) && // 7 | 9
    bytes[5] === 0x61 // a
  ) {
    return "gif";
  }
  return "unknown";
}

// Reassemble the kept byte ranges into a fresh buffer.
function concatRanges(bytes: Uint8Array, keep: Array<[number, number]>): Uint8Array {
  const total = keep.reduce((n, [s, e]) => n + (e - s), 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const [s, e] of keep) {
    out.set(bytes.subarray(s, e), o);
    o += e - s;
  }
  return out;
}

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
  return concatRanges(bytes, keep);
}

// Bytes consumed by a GIF color table given the packed flags byte:
// bit7 = table-present flag, bits0-2 = size field N → 2^(N+1) entries × 3 bytes.
function gifColorTableBytes(packed: number): number {
  if (!(packed & 0x80)) return 0;
  const n = packed & 0x07;
  return 3 * (1 << (n + 1));
}

// Advance past a GIF sub-block chain starting at `start`; returns the index
// just after the 0x00 block terminator, or -1 if it runs off the end.
function skipGifSubBlocks(bytes: Uint8Array, start: number): number {
  let p = start;
  while (p < bytes.length) {
    const len = bytes[p] ?? 0;
    p += 1;
    if (len === 0) return p; // terminator consumed
    p += len;
  }
  return -1;
}

/**
 * Strip Comment (0xFE), Application (0xFF) and Plain Text (0x01) extension
 * blocks from GIF87a/89a bytes — the blocks that can carry free text / embedded
 * metadata. The header, logical-screen descriptor, color tables, Graphic
 * Control extensions, image descriptors and image data are all kept, so the
 * image renders identically; pixels are never transcoded.
 */
export function stripGifMetadata(bytes: Uint8Array): Uint8Array {
  // Need at least header (6) + logical screen descriptor (7).
  if (bytes.length < 13) return bytes;
  if (bytes[0] !== 0x47 || bytes[1] !== 0x49 || bytes[2] !== 0x46) return bytes; // "GIF"

  // Header + LSD + optional Global Color Table = the start of the block stream.
  const dataStart = 13 + gifColorTableBytes(bytes[10] ?? 0);
  if (dataStart > bytes.length) return bytes;

  const keep: Array<[number, number]> = [[0, dataStart]];
  let dropped = false;
  let i = dataStart;
  while (i < bytes.length) {
    const b = bytes[i] ?? 0;
    if (b === 0x3b) {
      // Trailer — copy it and stop.
      keep.push([i, i + 1]);
      i += 1;
      break;
    }
    if (b === 0x21) {
      // Extension: 0x21 <label> <sub-block chain>.
      const label = bytes[i + 1] ?? 0;
      const end = skipGifSubBlocks(bytes, i + 2);
      if (end < 0) return bytes; // malformed — bail untouched
      if (label === 0xfe || label === 0xff || label === 0x01) {
        dropped = true; // comment / application / plain-text — omit from output
      } else {
        keep.push([i, end]); // graphic control (0xF9) etc. — keep
      }
      i = end;
      continue;
    }
    if (b === 0x2c) {
      // Image Descriptor (10 bytes) + optional Local Color Table + image data.
      if (i + 10 > bytes.length) return bytes;
      let p = i + 10 + gifColorTableBytes(bytes[i + 9] ?? 0);
      if (p + 1 > bytes.length) return bytes;
      p += 1; // LZW minimum-code-size byte
      const end = skipGifSubBlocks(bytes, p);
      if (end < 0) return bytes;
      keep.push([i, end]);
      i = end;
      continue;
    }
    // Unknown block type — don't risk corrupting the image; return unchanged.
    return bytes;
  }
  if (!dropped) return bytes; // nothing to strip — return the same reference
  return concatRanges(bytes, keep);
}

/** Format-aware metadata strip: routes to the JPEG or GIF stripper by magic
 *  number. Unsniffable input is returned unchanged. */
export function stripImageMetadata(bytes: Uint8Array): Uint8Array {
  switch (detectImageFormat(bytes)) {
    case "jpeg":
      return stripJpegMetadata(bytes);
    case "gif":
      return stripGifMetadata(bytes);
    default:
      return bytes;
  }
}

// Base64 → bytes (binary-string path; no Buffer so it runs in the SW too).
function base64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// Bytes → base64, chunked to avoid call-stack limits on multi-MB frames.
function bytesToBase64(bytes: Uint8Array): string {
  let s = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    s += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(s);
}

/**
 * Base64 wrapper around stripImageMetadata — the shape the NHI payload and FHIR
 * Attachment.data both use. Returns the input string unchanged when there is
 * nothing to strip or anything fails to parse.
 */
export function stripImageMetadataBase64(b64: string): string {
  try {
    const bytes = base64ToBytes(b64);
    const stripped = stripImageMetadata(bytes);
    if (stripped === bytes) return b64;
    return bytesToBase64(stripped);
  } catch {
    return b64;
  }
}

/**
 * @deprecated NHI ships GIF, not JPEG — prefer stripImageMetadataBase64. Kept
 * as a format-aware alias (NOT JPEG-only) so existing call sites de-identify
 * GIF frames correctly too; renaming the call sites can happen separately.
 */
export function stripJpegMetadataBase64(b64: string): string {
  return stripImageMetadataBase64(b64);
}

/**
 * MIME type for a base64 image frame, by magic-number sniff. Falls back to
 * image/jpeg for unsniffable input — the legacy NHI label; not expected in
 * practice now that frames are known to be GIF.
 */
export function imageMimeFromBase64(b64: string): string {
  try {
    // 16 base64 chars → 12 bytes, plenty for the GIF "GIF89a" / JPEG SOI sniff.
    const head = base64ToBytes(b64.slice(0, 16));
    const fmt = detectImageFormat(head);
    if (fmt === "gif") return "image/gif";
    if (fmt === "jpeg") return "image/jpeg";
  } catch {
    // fall through to the legacy default
  }
  return "image/jpeg";
}
