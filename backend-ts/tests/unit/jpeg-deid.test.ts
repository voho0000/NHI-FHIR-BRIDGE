/**
 * JPEG metadata stripping (audit P2-7, 2026-06-12).
 *
 * De-identified exports must not carry EXIF/COM metadata in imaging
 * frames; pixels and structural segments must survive byte-identical.
 */

import { describe, expect, test } from "vitest";

import { stripJpegMetadata, stripJpegMetadataBase64 } from "@nhi-fhir-bridge/mapper";

// Build a tiny synthetic JPEG: SOI + APP0(JFIF) + APP1(EXIF) + COM +
// DQT stub + SOS header + fake entropy bytes + EOI. Segment lengths
// include the 2 length bytes per the JPEG spec.
function seg(marker: number, payload: number[]): number[] {
  const len = payload.length + 2;
  return [0xff, marker, (len >> 8) & 0xff, len & 0xff, ...payload];
}
const APP0 = seg(0xe0, [0x4a, 0x46, 0x49, 0x46, 0x00, 1, 2, 0, 0, 1, 0, 1, 0, 0]); // "JFIF\0"…
const APP1 = seg(0xe1, [0x45, 0x78, 0x69, 0x66, 0x00, 0x00, 0xde, 0xad]); // "Exif\0\0"…
const COM = seg(0xfe, [0x70, 0x61, 0x74, 0x69, 0x65, 0x6e, 0x74]); // "patient"
const DQT = seg(0xdb, [0x00, 0x10, 0x10, 0x10]);
const SOS_AND_DATA = [0xff, 0xda, 0x00, 0x04, 0x01, 0x00, /* entropy: */ 0x12, 0x34, 0x56];
const EOI = [0xff, 0xd9];

const FULL = new Uint8Array([
  0xff,
  0xd8,
  ...APP0,
  ...APP1,
  ...COM,
  ...DQT,
  ...SOS_AND_DATA,
  ...EOI,
]);
const CLEAN = new Uint8Array([0xff, 0xd8, ...APP0, ...DQT, ...SOS_AND_DATA, ...EOI]);

function toB64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

describe("stripJpegMetadata", () => {
  test("drops APP1 (EXIF) and COM, keeps SOI/APP0/DQT/SOS/entropy/EOI", () => {
    const out = stripJpegMetadata(FULL);
    expect(Array.from(out)).toEqual(Array.from(CLEAN));
  });

  test("returns the SAME reference when there is nothing to strip", () => {
    const out = stripJpegMetadata(CLEAN);
    expect(out).toBe(CLEAN);
  });

  test("idempotent", () => {
    const once = stripJpegMetadata(FULL);
    expect(stripJpegMetadata(once)).toBe(once);
  });

  test("non-JPEG bytes pass through unchanged (same reference)", () => {
    const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]);
    expect(stripJpegMetadata(png)).toBe(png);
  });

  test("malformed/truncated JPEG passes through unchanged — never corrupt", () => {
    // APP1 declares a length that overruns the buffer.
    const truncated = new Uint8Array([0xff, 0xd8, 0xff, 0xe1, 0xff, 0xff, 0x00]);
    expect(stripJpegMetadata(truncated)).toBe(truncated);
    // Garbage after SOI where a marker should be.
    const garbage = new Uint8Array([0xff, 0xd8, 0x00, 0x01, 0x02]);
    expect(stripJpegMetadata(garbage)).toBe(garbage);
  });

  test("entropy-coded data after SOS is copied verbatim even if it contains 0xFFE1", () => {
    // A fake APP1 byte sequence INSIDE the scan data must not be parsed.
    const scan = [0xff, 0xda, 0x00, 0x04, 0x01, 0x00, 0xff, 0xe1, 0x00, 0x04, 0xaa];
    const jpeg = new Uint8Array([0xff, 0xd8, ...APP0, ...scan, ...EOI]);
    expect(stripJpegMetadata(jpeg)).toBe(jpeg); // nothing dropped pre-SOS
  });
});

describe("stripJpegMetadataBase64", () => {
  test("strips through the base64 round-trip", () => {
    expect(stripJpegMetadataBase64(toB64(FULL))).toBe(toB64(CLEAN));
  });

  test("clean input returns the original string", () => {
    const b64 = toB64(CLEAN);
    expect(stripJpegMetadataBase64(b64)).toBe(b64);
  });

  test("invalid base64 returns the input unchanged", () => {
    expect(stripJpegMetadataBase64("not base64 !!!")).toBe("not base64 !!!");
  });
});
