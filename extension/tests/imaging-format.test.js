// Image-format sniffing + de-identification metadata stripping.
//
// NHI's IHKE3408S03 "JPG" frames are actually GIF89a (live-verified
// 2026-06-29: 284/284 captured frames). These tests pin two fixes:
//   1. contentType is sniffed per frame (GIF → image/gif), not hardcoded.
//   2. metadata stripping is format-aware — the JPEG-only gate used to let
//      every GIF frame through UNCHANGED, making de-id a silent no-op.
//
// Synthetic byte arrays only — no PHI. GIF/JPEG are hand-built minimal files.

import { describe, expect, test } from "vitest";

import {
  detectImageFormat,
  imageMimeFromBase64,
  mapDiagnosticReport,
  stripImageMetadataBase64,
  stripJpegMetadataBase64,
} from "@nhi-fhir-bridge/mapper";

const toB64 = (arr) => Buffer.from(Uint8Array.from(arr)).toString("base64");
const fromB64 = (s) => Uint8Array.from(Buffer.from(s, "base64"));
const includesSeq = (hay, needle) => {
  outer: for (let i = 0; i + needle.length <= hay.length; i++) {
    for (let j = 0; j < needle.length; j++) if (hay[i + j] !== needle[j]) continue outer;
    return true;
  }
  return false;
};
const HELLO = [0x48, 0x45, 0x4c, 0x4c, 0x4f]; // "HELLO"

// Minimal GIF89a built from labeled segments so the structure stays readable.
const GIF_HEADER = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]; // "GIF89a"
const GIF_LSD = [0x01, 0x00, 0x01, 0x00, 0x00, 0x00, 0x00]; // 1×1, no global color table
const GIF_COMMENT_HELLO = [0x21, 0xfe, 0x05, ...HELLO, 0x00]; // Comment ext (9 bytes)
// Image descriptor (no LCT) + LZW min-code-size + 1 sub-block + terminator.
const GIF_IMAGE_1X1 = [0x2c, 0, 0, 0, 0, 0x01, 0, 0x01, 0, 0, 0x02, 0x02, 0x44, 0x01, 0x00];
const GIF_TRAILER = [0x3b];

const GIF_WITH_COMMENT = [
  ...GIF_HEADER,
  ...GIF_LSD,
  ...GIF_COMMENT_HELLO,
  ...GIF_IMAGE_1X1,
  ...GIF_TRAILER,
];
const GIF_NO_META = [...GIF_HEADER, ...GIF_LSD, ...GIF_IMAGE_1X1, ...GIF_TRAILER];
const GIF87A_HEADER = [0x47, 0x49, 0x46, 0x38, 0x37, 0x61, ...GIF_LSD]; // "GIF87a" + LSD
// Minimal JPEG: SOI + COM "AB" (6 bytes) + SOS remainder + EOI.
const JPEG_WITH_COM = [
  0xff, 0xd8, 0xff, 0xfe, 0x00, 0x04, 0x41, 0x42, 0xff, 0xda, 0x00, 0x00, 0xff, 0xd9,
];

describe("detectImageFormat", () => {
  test("sniffs GIF89a / GIF87a / JPEG / unknown", () => {
    expect(detectImageFormat(Uint8Array.from(GIF_WITH_COMMENT))).toBe("gif");
    expect(detectImageFormat(Uint8Array.from(GIF87A_HEADER))).toBe("gif");
    expect(detectImageFormat(Uint8Array.from(JPEG_WITH_COM))).toBe("jpeg");
    expect(detectImageFormat(Uint8Array.from([0x00, 0x01, 0x02, 0x03]))).toBe("unknown");
  });
});

describe("imageMimeFromBase64", () => {
  test("GIF → image/gif, JPEG → image/jpeg, unknown → image/jpeg fallback", () => {
    expect(imageMimeFromBase64(toB64(GIF_WITH_COMMENT))).toBe("image/gif");
    expect(imageMimeFromBase64(toB64(JPEG_WITH_COM))).toBe("image/jpeg");
    expect(imageMimeFromBase64(toB64(new Array(12).fill(0)))).toBe("image/jpeg");
  });
});

describe("stripImageMetadataBase64 (GIF)", () => {
  test("removes the GIF Comment extension, keeps a valid GIF", () => {
    const out = stripImageMetadataBase64(toB64(GIF_WITH_COMMENT));
    expect(out).not.toBe(toB64(GIF_WITH_COMMENT)); // changed
    const bytes = fromB64(out);
    expect(detectImageFormat(bytes)).toBe("gif"); // still a GIF
    expect(includesSeq([...bytes], HELLO)).toBe(false); // comment text gone
    expect(bytes.length).toBe(GIF_WITH_COMMENT.length - 9); // exactly the comment block
    expect(bytes[bytes.length - 1]).toBe(0x3b); // trailer intact
  });

  test("no-op when there is no metadata block (returns the same string)", () => {
    const input = toB64(GIF_NO_META);
    expect(stripImageMetadataBase64(input)).toBe(input);
  });
});

describe("stripJpegMetadataBase64 (back-compat alias is now format-aware)", () => {
  test("the legacy JPEG-named entry point ALSO strips GIF metadata (the bug fix)", () => {
    const out = stripJpegMetadataBase64(toB64(GIF_WITH_COMMENT));
    const bytes = fromB64(out);
    expect(includesSeq([...bytes], HELLO)).toBe(false);
    expect(detectImageFormat(bytes)).toBe("gif");
  });

  test("still strips JPEG COM segments (no regression)", () => {
    const out = stripJpegMetadataBase64(toB64(JPEG_WITH_COM));
    const bytes = fromB64(out);
    expect(detectImageFormat(bytes)).toBe("jpeg");
    expect(includesSeq([...bytes], [0x41, 0x42])).toBe(false); // "AB" COM data gone
    expect(bytes.length).toBe(JPEG_WITH_COM.length - 6); // the COM segment
  });
});

describe("mapDiagnosticReport presentedForm contentType", () => {
  test("GIF frame → image/gif", () => {
    const dr = mapDiagnosticReport(
      { jpgBase64s: [toB64(GIF_WITH_COMMENT)], display: "Chest X-ray" },
      "patX",
    );
    expect(dr).not.toBeNull();
    expect(dr.presentedForm).toHaveLength(1);
    expect(dr.presentedForm[0].contentType).toBe("image/gif");
  });

  test("JPEG frame → image/jpeg", () => {
    const dr = mapDiagnosticReport(
      { jpgBase64s: [toB64(JPEG_WITH_COM)], display: "Chest X-ray" },
      "patX",
    );
    expect(dr.presentedForm[0].contentType).toBe("image/jpeg");
  });
});
