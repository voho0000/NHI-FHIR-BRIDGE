import { describe, expect, test } from "vitest";

import {
  LIST_HANDLERS,
  LOINC_DISPLAY,
  mapDischargeSummaryDocRef,
  stableId,
} from "@nhi-fhir-bridge/mapper";

const PID = "patient-test-id-32chars";

// Representative NHI-shaped HTML payload. Fields mirror the live
// 健康存摺 modal we surveyed at IHKE3309S02/getxml — single <head>
// with a CDA-residual namespace, then table rows for demographics,
// admin, and a 住院摘要 narrative. PII values are synthetic.
const SAMPLE_HTML = `<head xmlns:IHK="urn:hl7-org:v3"><style>body{font-family:serif}</style></head>
<body>
<table><tr><td><b>病患姓名：</b></td><td>王O明</td><td><b>身分證字號：</b></td><td>A12345****</td></tr></table>
<table>
<tr><td><b>記錄日期時間：</b></td><td>2025-05-23</td></tr>
<tr><td><b>住院日期：</b></td><td>2025-05-18</td><td><b>出院日期：</b></td><td>2025-05-22</td></tr>
</table>
<table><tr><td><b>住院摘要</b></td><td>Acute exacerbation of COPD. Discharged on bronchodilator therapy.</td></tr></table>
</body>`;

const BASE_RAW = {
  html: SAMPLE_HTML,
  row_id: "AAOZsAAIBAALXDJAAH",
  hospital: "長庚嘉義",
  admission_date: "2025-05-18",
  discharge_date: "2025-05-22",
};

describe("mapDischargeSummaryDocRef", () => {
  test("returns a DocumentReference resource with status=current", () => {
    const r = mapDischargeSummaryDocRef(BASE_RAW, PID);
    expect(r).not.toBeNull();
    expect(r!.resourceType).toBe("DocumentReference");
    expect(r!.status).toBe("current");
  });

  test("type uses LOINC 18842-5 with canonical Long Common Name", () => {
    const r = mapDischargeSummaryDocRef(BASE_RAW, PID);
    const coding = r!.type.coding[0];
    expect(coding.system).toBe("http://loinc.org");
    expect(coding.code).toBe("18842-5");
    expect(coding.display).toBe("Discharge summary");
    // LOINC_DISPLAY agrees — single source of truth for downstream
    // consumers that walk the bridge's LOINC table.
    expect(LOINC_DISPLAY["18842-5"]).toBe("Discharge summary");
    expect(r!.type.text).toBe("出院病摘");
  });

  test("category uses US Core clinical-note", () => {
    const r = mapDischargeSummaryDocRef(BASE_RAW, PID);
    const cat = r!.category[0].coding[0];
    expect(cat.system).toBe(
      "http://hl7.org/fhir/us/core/CodeSystem/us-core-documentreference-category",
    );
    expect(cat.code).toBe("clinical-note");
  });

  test("subject references the Patient", () => {
    const r = mapDischargeSummaryDocRef(BASE_RAW, PID);
    expect(r!.subject.reference).toBe(`Patient/${PID}`);
  });

  test("context.encounter is the same stableId mapEncounter would compute", () => {
    const r = mapDischargeSummaryDocRef(BASE_RAW, PID);
    // Mirror mapEncounter's stableId algorithm so DocumentReference
    // links land on the right Encounter without depending on the
    // post-mapping date+hospital linker.
    const expected = stableId(PID, "2025-05-18", "IMP", "長庚嘉義");
    expect(r!.context.encounter[0].reference).toBe(`Encounter/${expected}`);
  });

  test("context.period spans admission to discharge", () => {
    const r = mapDischargeSummaryDocRef(BASE_RAW, PID);
    expect(r!.context.period.start).toBe("2025-05-18T00:00:00+08:00");
    expect(r!.context.period.end).toBe("2025-05-22T23:59:59+08:00");
  });

  test("date is extracted from 記錄日期時間 in the HTML when not provided", () => {
    const r = mapDischargeSummaryDocRef(BASE_RAW, PID);
    expect(r!.date).toBe("2025-05-23T00:00:00+08:00");
  });

  test("date falls back to discharge date when HTML has no 記錄日期時間", () => {
    const htmlNoRecordDate = SAMPLE_HTML.replace(/記錄日期時間[：:][^<]*/, "");
    const r = mapDischargeSummaryDocRef({ ...BASE_RAW, html: htmlNoRecordDate }, PID);
    expect(r!.date).toBe("2025-05-22T00:00:00+08:00");
  });

  test("explicit record_date overrides any extraction", () => {
    const r = mapDischargeSummaryDocRef({ ...BASE_RAW, record_date: "2025-06-01" }, PID);
    expect(r!.date).toBe("2025-06-01T00:00:00+08:00");
  });

  test("content[0].attachment carries text/html with zh-TW + base64 HTML", () => {
    const r = mapDischargeSummaryDocRef(BASE_RAW, PID);
    const att = r!.content[0].attachment;
    expect(att.contentType).toBe("text/html");
    expect(att.language).toBe("zh-TW");
    expect(typeof att.data).toBe("string");
    expect(att.data.length).toBeGreaterThan(0);
    // Round-trip: base64 decode must equal the original HTML bytes
    // (preserves Chinese narrative — the whole point of using UTF-8
    // base64 instead of raw ASCII btoa).
    const decoded = Buffer.from(att.data, "base64").toString("utf8");
    expect(decoded).toBe(SAMPLE_HTML);
    expect(att.size).toBe(Buffer.byteLength(SAMPLE_HTML, "utf8"));
    // Attachment.hash is the sha1 of the raw HTML, not the base64. We
    // don't recompute here (tested implicitly via constancy below); we
    // just assert presence + shape (40-char hex).
    expect(att.hash).toMatch(/^[0-9a-f]{40}$/);
  });

  test("attachment.title includes 出院病摘 + hospital + period", () => {
    const r = mapDischargeSummaryDocRef(BASE_RAW, PID);
    expect(r!.content[0].attachment.title).toBe("出院病摘 — 長庚嘉義 2025-05-18~2025-05-22");
  });

  test("custodian is the hospital display name", () => {
    const r = mapDischargeSummaryDocRef(BASE_RAW, PID);
    expect(r!.custodian.display).toBe("長庚嘉義");
  });

  test("meta.tag carries the bridge-namespaced source identifier", () => {
    const r = mapDischargeSummaryDocRef(BASE_RAW, PID);
    expect(r!.meta.tag).toContainEqual({
      system: "http://nhi-fhir-bridge/nhi-source",
      code: "ihke3309-getxml",
    });
  });

  test("row_ID surfaces as bridge-namespaced identifier", () => {
    const r = mapDischargeSummaryDocRef(BASE_RAW, PID);
    expect(r!.identifier[0]).toEqual({
      system: "http://nhi-fhir-bridge/nhi-inpatient-row",
      value: "AAOZsAAIBAALXDJAAH",
    });
  });

  test("returns null when html is missing", () => {
    expect(mapDischargeSummaryDocRef({ ...BASE_RAW, html: "" }, PID)).toBeNull();
    expect(mapDischargeSummaryDocRef({ ...BASE_RAW, html: undefined }, PID)).toBeNull();
  });

  test("returns null when admission_date is missing (no Encounter anchor possible)", () => {
    expect(mapDischargeSummaryDocRef({ ...BASE_RAW, admission_date: "" }, PID)).toBeNull();
  });

  test("stable ID is deterministic across runs for the same row_id", () => {
    const a = mapDischargeSummaryDocRef(BASE_RAW, PID);
    const b = mapDischargeSummaryDocRef(BASE_RAW, PID);
    expect(a!.id).toBe(b!.id);
    expect(a!.id).toMatch(/^[0-9a-f]{32}$/);
  });

  test("two rows with different row_IDs but identical dates+hospital get distinct IDs", () => {
    // Defends the multi-reading principle: bridge MUST NOT collapse two
    // distinct NHI rows just because the surface (date, hospital) match.
    const r1 = mapDischargeSummaryDocRef(BASE_RAW, PID);
    const r2 = mapDischargeSummaryDocRef({ ...BASE_RAW, row_id: "AAOTHEROW2" }, PID);
    expect(r1!.id).not.toBe(r2!.id);
  });

  test("dispatch table routes document_references to this mapper", () => {
    expect(LIST_HANDLERS.document_references).toBeDefined();
    const [fn] = LIST_HANDLERS.document_references!;
    expect(fn).toBe(mapDischargeSummaryDocRef);
  });
});
