import { describe, expect, test } from "vitest";

import {
  linkEncountersInResources,
  repairDocumentReferenceEncounters,
  resolveSexStratifiedRanges,
} from "@nhi-fhir-bridge/mapper";

function docRef(id: string, hospital: string, admit: string, encId: string): Record<string, any> {
  return {
    resourceType: "DocumentReference",
    id,
    custodian: { display: hospital },
    context: {
      encounter: [{ reference: `Encounter/${encId}` }],
      period: { start: `${admit}T00:00:00+08:00` },
    },
  };
}

function amb(id: string, hospital: string, start: string): Record<string, any> {
  return {
    resourceType: "Encounter",
    id,
    class: { code: "AMB" },
    serviceProvider: { display: hospital },
    period: { start: `${start}T00:00:00+08:00` },
  };
}

function imp(id: string, hospital: string, start: string, end: string): Record<string, any> {
  return {
    resourceType: "Encounter",
    id,
    class: { code: "IMP" },
    serviceProvider: { display: hospital },
    period: {
      start: `${start}T00:00:00+08:00`,
      end: `${end}T00:00:00+08:00`,
    },
  };
}

function obs(id: string, hospital: string, date: string): Record<string, any> {
  return {
    resourceType: "Observation",
    id,
    performer: [{ display: hospital }],
    effectiveDateTime: `${date}T00:00:00+08:00`,
  };
}

// NOTE: dedupAdmissionDayAmb removed v0.20.0 — see link.ts comment. A 門診/急診
// on an admission day is the REAL gateway visit (患者就醫 → 被收住院), not an
// IMP billing duplicate, so it is no longer deleted. Same-day 門診/急診 + 住院
// now coexist; precise resource→encounter attribution moves to Stage B linking.

describe("linkEncountersInResources", () => {
  test("exact (hospital, date) match links observation to encounter", () => {
    const enc = amb("enc-1", "VGH", "2024-05-01");
    const o = obs("obs-1", "VGH", "2024-05-01");
    linkEncountersInResources([enc], [o]);
    expect(o.encounter).toEqual({ reference: "Encounter/enc-1" });
  });

  test("ambiguous match (>1 candidate same hosp+date) is left unlinked", () => {
    const e1 = amb("enc-1", "VGH", "2024-05-01");
    const e2 = amb("enc-2", "VGH", "2024-05-01");
    const o = obs("obs-1", "VGH", "2024-05-01");
    linkEncountersInResources([e1, e2], [o]);
    expect(o.encounter).toBeUndefined();
  });

  test("IMP span match: observation date inside admission window links", () => {
    const i = imp("imp-1", "VGH", "2024-05-01", "2024-05-05");
    const o = obs("obs-1", "VGH", "2024-05-03"); // mid-admission lab
    linkEncountersInResources([i], [o]);
    expect(o.encounter).toEqual({ reference: "Encounter/imp-1" });
  });

  test("IMP span does NOT match outside the period", () => {
    const i = imp("imp-1", "VGH", "2024-05-01", "2024-05-05");
    const o = obs("obs-1", "VGH", "2024-05-10");
    linkEncountersInResources([i], [o]);
    expect(o.encounter).toBeUndefined();
  });

  test("resource already linked is not overwritten", () => {
    const enc = amb("enc-1", "VGH", "2024-05-01");
    const o = obs("obs-1", "VGH", "2024-05-01");
    o.encounter = { reference: "Encounter/already-set" };
    linkEncountersInResources([enc], [o]);
    expect(o.encounter.reference).toBe("Encounter/already-set");
  });

  test("non-linkable resource types are skipped", () => {
    const enc = amb("enc-1", "VGH", "2024-05-01");
    const other = {
      resourceType: "Patient",
      id: "P001",
      performer: [{ display: "VGH" }],
      effectiveDateTime: "2024-05-01T00:00:00+08:00",
    };
    linkEncountersInResources([enc], [other]);
    expect((other as any).encounter).toBeUndefined();
  });

  test("empty candidates is a no-op", () => {
    const o = obs("obs-1", "VGH", "2024-05-01");
    linkEncountersInResources([], [o]);
    expect(o.encounter).toBeUndefined();
  });

  test("Procedure with performer[].actor.display links via BackboneElement shape", () => {
    // Procedure.performer is a BackboneElement {function?, actor: Reference}
    // — the hospital display nests under .actor.display, not on the
    // performer entry directly the way Observation / DiagnosticReport do.
    // Regression guard for the v0.6.10 / v0.7.0 oversight that left
    // procedures un-linked from their encounters.
    const enc = amb("enc-1", "VGH", "2024-05-01");
    const proc: Record<string, any> = {
      resourceType: "Procedure",
      id: "proc-1",
      performer: [{ actor: { display: "VGH" } }],
      performedDateTime: "2024-05-01T00:00:00+08:00",
    };
    linkEncountersInResources([enc], [proc]);
    expect(proc.encounter).toEqual({ reference: "Encounter/enc-1" });
  });
});

describe("linkEncountersInResources — admission-day gateway disambiguation (v0.20.0)", () => {
  // After dedupAdmissionDayAmb removal, an admission day has BOTH the gateway
  // 門診/急診 and the 住院 it led to. These guard the disambiguation.
  function enc(
    id: string,
    cls: string,
    hosp: string,
    start: string,
    end: string | null,
    dx?: string[],
  ): Record<string, any> {
    const e: Record<string, any> = {
      resourceType: "Encounter",
      id,
      class: { code: cls },
      serviceProvider: { display: hosp },
      period: { start: `${start}T00:00:00+08:00` },
    };
    if (end) e.period.end = `${end}T00:00:00+08:00`;
    if (dx) e.reasonCode = dx.map((c) => ({ coding: [{ code: c }] }));
    return e;
  }
  function med(id: string, hosp: string, date: string, dx?: string): Record<string, any> {
    const m: Record<string, any> = {
      resourceType: "MedicationRequest",
      id,
      requester: { display: hosp },
      authoredOn: `${date}T00:00:00+08:00`,
    };
    if (dx) m.reasonCode = [{ coding: [{ code: dx }] }];
    return m;
  }

  const ER = () => enc("er", "EMER", "VGH", "2025-05-18", null, ["K92.0"]);
  const IMP = () => enc("imp", "IMP", "VGH", "2025-05-18", "2025-05-22", ["R04.2"]);

  test("admission-day ER med (dx K92.0) links to the ER, not the IMP", () => {
    const m = med("m1", "VGH", "2025-05-18", "K92.0");
    linkEncountersInResources([ER(), IMP()], [m]);
    expect(m.encounter).toEqual({ reference: "Encounter/er" });
  });

  test("admission-day inpatient med (dx R04.2) links to the IMP", () => {
    const m = med("m2", "VGH", "2025-05-18", "R04.2");
    linkEncountersInResources([ER(), IMP()], [m]);
    expect(m.encounter).toEqual({ reference: "Encounter/imp" });
  });

  test("dotted vs undotted ICD still matches (med K92.0 ↔ encounter K920)", () => {
    const erUndotted = enc("er", "EMER", "VGH", "2025-05-18", null, ["K920"]);
    const m = med("m1", "VGH", "2025-05-18", "K92.0");
    linkEncountersInResources([erUndotted, IMP()], [m]);
    expect(m.encounter).toEqual({ reference: "Encounter/er" });
  });

  test("admission-day lab (no dx) prefers the single-day gateway over the IMP", () => {
    const lab = obs("o1", "VGH", "2025-05-18");
    linkEncountersInResources([enc("er", "EMER", "VGH", "2025-05-18", null), IMP()], [lab]);
    expect(lab.encounter).toEqual({ reference: "Encounter/er" });
  });

  test("lab on a later admission day links to the IMP via span", () => {
    const lab = obs("o2", "VGH", "2025-05-20");
    linkEncountersInResources([enc("er", "EMER", "VGH", "2025-05-18", null), IMP()], [lab]);
    expect(lab.encounter).toEqual({ reference: "Encounter/imp" });
  });

  test("med whose diagnosis matches neither candidate stays unlinked", () => {
    const m = med("m3", "VGH", "2025-05-18", "Z99.9");
    linkEncountersInResources([ER(), IMP()], [m]);
    expect(m.encounter).toBeUndefined();
  });

  test("two same-day gateways → ambiguous lab stays unlinked", () => {
    const lab = obs("o4", "VGH", "2025-05-18");
    linkEncountersInResources(
      [
        enc("a", "AMB", "VGH", "2025-05-18", null),
        enc("b", "AMB", "VGH", "2025-05-18", null),
        IMP(),
      ],
      [lab],
    );
    expect(lab.encounter).toBeUndefined();
  });

  test("inpatient-course med links to the IMP by validityPeriod even when the gateway shares the dx", () => {
    // 長庚嘉義 2/11 J18.9 repro: BOTH the gateway 門診 and the 住院 carry J18.9,
    // so the diagnosis tie-break is ambiguous (dxHits=2). The med's course
    // window (validityPeriod = the whole stay) pins it to the IMP.
    const amb = enc("amb", "AMB", "VGH", "2025-02-11", null, ["J18.9"]);
    const impStay = enc("imp", "IMP", "VGH", "2025-02-11", "2025-02-25", ["J18.9", "K57.10"]);
    const m: Record<string, any> = {
      resourceType: "MedicationRequest",
      id: "m-course",
      requester: { display: "VGH" },
      authoredOn: "2025-02-11T00:00:00+08:00",
      reasonCode: [{ coding: [{ code: "J18.9" }] }],
      dispenseRequest: {
        validityPeriod: { start: "2025-02-11T00:00:00+08:00", end: "2025-02-25T23:59:59+08:00" },
      },
    };
    linkEncountersInResources([amb, impStay], [m]);
    expect(m.encounter).toEqual({ reference: "Encounter/imp" });
  });

  test("inpatient drug links to 住院 by NHI 申報 visit class even when the gateway shares the dx", () => {
    // The deterministic signal: NHI's 申報 type (住院). Both encounters carry
    // J18.9 — only the visit class separates them. No validityPeriod needed,
    // so this also covers single-day inpatient meds the course-window can't.
    const amb = enc("amb", "AMB", "VGH", "2025-02-11", null, ["J18.9"]);
    const impStay = enc("imp", "IMP", "VGH", "2025-02-11", "2025-02-25", ["J18.9"]);
    const m: Record<string, any> = {
      resourceType: "MedicationRequest",
      id: "m-imp",
      requester: { display: "VGH" },
      authoredOn: "2025-02-11T00:00:00+08:00",
      reasonCode: [{ coding: [{ code: "J18.9" }] }],
      __nhiVisitClass: "IMP",
    };
    linkEncountersInResources([amb, impStay], [m]);
    expect(m.encounter).toEqual({ reference: "Encounter/imp" });
    // transient hint must be stripped — never reaches the bundle
    expect(m.__nhiVisitClass).toBeUndefined();
  });

  test("門診 drug on an admission day links to the gateway, not the 住院", () => {
    const amb = enc("amb", "AMB", "VGH", "2025-02-11", null, ["J18.9"]);
    const impStay = enc("imp", "IMP", "VGH", "2025-02-11", "2025-02-25", ["J18.9"]);
    const m: Record<string, any> = {
      resourceType: "MedicationRequest",
      id: "m-amb",
      requester: { display: "VGH" },
      authoredOn: "2025-02-11T00:00:00+08:00",
      reasonCode: [{ coding: [{ code: "J18.9" }] }],
      __nhiVisitClass: "AMB",
    };
    linkEncountersInResources([amb, impStay], [m]);
    expect(m.encounter).toEqual({ reference: "Encounter/amb" });
  });

  test("門診-labelled ER drug links to the 急診(EMER) gateway (用藥 has no 急診 type)", () => {
    // 長庚嘉義 1/28 U07.1 repro: 用藥 labels the ER prescription 門診 (AMB) while
    // 就醫 classified the same-day gateway 急診 (EMER). The AMB-class med must
    // still attach to the EMER gateway — e.g. the Molnupiravir 5-day course.
    const emer = enc("emer", "EMER", "VGH", "2025-01-28", null, ["U07.1"]);
    const impStay = enc("imp", "IMP", "VGH", "2025-01-28", "2025-01-30", ["U07.1"]);
    const m: Record<string, any> = {
      resourceType: "MedicationRequest",
      id: "m-molnu",
      requester: { display: "VGH" },
      authoredOn: "2025-01-28T00:00:00+08:00",
      reasonCode: [{ coding: [{ code: "U07.1" }] }],
      __nhiVisitClass: "AMB",
    };
    linkEncountersInResources([emer, impStay], [m]);
    expect(m.encounter).toEqual({ reference: "Encounter/emer" });
  });
});

describe("resolveSexStratifiedRanges", () => {
  function obsWithRanges(): Record<string, any> {
    return {
      resourceType: "Observation",
      id: "obs-1",
      valueQuantity: { value: 14.5, unit: "g/dL", system: "http://unitsofmeasure.org" },
      referenceRange: [
        {
          low: { value: 13.5, unit: "g/dL" },
          high: { value: 17.5, unit: "g/dL" },
          appliesTo: [{ coding: [{ code: "male" }] }],
        },
        {
          low: { value: 12.0, unit: "g/dL" },
          high: { value: 15.5, unit: "g/dL" },
          appliesTo: [{ coding: [{ code: "female" }] }],
        },
      ],
    };
  }

  test("picks male range for male patient", () => {
    const o = obsWithRanges();
    resolveSexStratifiedRanges({ gender: "male" }, [o]);
    expect(o.referenceRange).toHaveLength(1);
    expect(o.referenceRange[0].appliesTo[0].coding[0].code).toBe("male");
  });

  test("picks female range for female patient", () => {
    const o = obsWithRanges();
    resolveSexStratifiedRanges({ gender: "female" }, [o]);
    expect(o.referenceRange).toHaveLength(1);
    expect(o.referenceRange[0].appliesTo[0].coding[0].code).toBe("female");
  });

  test("no-op when patient gender is 'other' / 'unknown'", () => {
    const o = obsWithRanges();
    resolveSexStratifiedRanges({ gender: "unknown" }, [o]);
    expect(o.referenceRange).toHaveLength(2);
  });

  test("no-op when only one range entry present", () => {
    const o = obsWithRanges();
    o.referenceRange = [o.referenceRange[0]];
    resolveSexStratifiedRanges({ gender: "male" }, [o]);
    expect(o.referenceRange).toHaveLength(1);
  });

  test("no-op when patient is null", () => {
    const o = obsWithRanges();
    resolveSexStratifiedRanges(null, [o]);
    expect(o.referenceRange).toHaveLength(2);
  });

  test("recomputes interpretation against the chosen range (high)", () => {
    const o = obsWithRanges();
    // 18.0 g/dL > 17.5 male high → expected "H" interpretation.
    o.valueQuantity.value = 18.0;
    resolveSexStratifiedRanges({ gender: "male" }, [o]);
    expect(o.interpretation?.[0]?.coding?.[0]?.code).toBe("H");
  });
});

describe("repairDocumentReferenceEncounters", () => {
  test("keeps a valid encounter reference untouched", () => {
    const d = docRef("doc-1", "VGH", "2024-05-01", "enc-1");
    repairDocumentReferenceEncounters([imp("enc-1", "VGH", "2024-05-01", "2024-05-05")], [d]);
    expect(d.context.encounter[0].reference).toBe("Encounter/enc-1");
  });

  test("re-links a dangling reference by (hospital, admission date)", () => {
    // the recomputed id (enc-stale) isn't in the bundle, but a real Encounter
    // at the same hospital + admission day is → repoint to it
    const d = docRef("doc-1", "VGH", "2024-05-01", "enc-stale");
    repairDocumentReferenceEncounters([imp("enc-real", "VGH", "2024-05-01", "2024-05-05")], [d]);
    expect(d.context.encounter[0].reference).toBe("Encounter/enc-real");
  });

  test("drops a dangling reference when no Encounter matches", () => {
    const d = docRef("doc-1", "VGH", "2024-05-01", "enc-missing");
    repairDocumentReferenceEncounters([imp("enc-1", "OtherHosp", "2024-05-01", "2024-05-05")], [d]);
    expect(d.context.encounter).toBeUndefined();
  });
});

// #26 — a MedicationRequest links to the visit that PRESCRIBED it (the Encounter
// whose __rxOrderCodes contains the med's NHI 醫令碼), not by date heuristic.
describe("med ↔ Encounter linking by prescribed-drug list (#26)", () => {
  const encRx = (
    id: string,
    hosp: string,
    date: string,
    cls: string,
    rx: string[],
  ): Record<string, any> => ({
    resourceType: "Encounter",
    id,
    class: { code: cls },
    serviceProvider: { display: hosp },
    period: { start: `${date}T00:00:00+08:00` },
    __rxOrderCodes: rx,
  });
  const med = (id: string, hosp: string, date: string, orderCode: string): Record<string, any> => ({
    resourceType: "MedicationRequest",
    id,
    requester: { display: hosp },
    authoredOn: `${date}T00:00:00+08:00`,
    medicationCodeableConcept: { coding: [{ system: "nhi-drug", code: orderCode }] },
  });

  test("two same-day visits: each drug links to the visit that ordered it", () => {
    const cough = encRx("cough", "長庚嘉義", "2026-06-02", "EMER", ["AB45993100"]);
    const ckd = encRx("ckd", "長庚嘉義", "2026-06-02", "AMB", ["BC26476100"]);
    const mCough = med("m1", "長庚嘉義", "2026-06-02", "AB45993100");
    const mCkd = med("m2", "長庚嘉義", "2026-06-02", "BC26476100");
    linkEncountersInResources([cough, ckd], [mCough, mCkd]);
    expect(mCough.encounter).toEqual({ reference: "Encounter/cough" });
    expect(mCkd.encounter).toEqual({ reference: "Encounter/ckd" });
  });

  test("a 藥局/IC卡 dispense NOT in any visit's list stays UNLINKED (no date guess)", () => {
    const cough = encRx("cough", "長庚嘉義", "2026-06-02", "AMB", ["AB45993100"]);
    const pharmacy = med("mp", "長庚嘉義", "2026-06-02", "ZZ99999999");
    linkEncountersInResources([cough], [pharmacy]);
    expect(pharmacy.encounter).toBeUndefined();
  });

  test("the transient __rxOrderCodes is stripped from the Encounter", () => {
    const cough = encRx("cough", "長庚嘉義", "2026-06-02", "AMB", ["AB45993100"]);
    linkEncountersInResources([cough], []);
    expect(cough.__rxOrderCodes).toBeUndefined();
  });

  test("no drug-list data at (hospital,date) → falls through to the heuristic", () => {
    const visit = amb("v", "長庚嘉義", "2026-06-02"); // no __rxOrderCodes
    const m = med("m", "長庚嘉義", "2026-06-02", "AB45993100");
    linkEncountersInResources([visit], [m]);
    expect(m.encounter).toEqual({ reference: "Encounter/v" });
  });

  test("inpatient-course med (validityPeriod) links to the 住院 even when the gateway has a drug list", () => {
    // Regression guard (2026-06-23): the admission-day gateway 急診 has a 申報 drug
    // list, but the inpatient continuation drug isn't in it — the drug-list rule
    // must NOT strand it; it links to the 住院 by its validityPeriod span.
    const gateway = encRx("gw", "VGH", "2025-01-28", "EMER", ["GATEWAYDRUG"]);
    const impStay = imp("imp", "VGH", "2025-01-28", "2025-01-30");
    const inpMed: Record<string, any> = {
      resourceType: "MedicationRequest",
      id: "inp-med",
      requester: { display: "VGH" },
      authoredOn: "2025-01-28T00:00:00+08:00",
      medicationCodeableConcept: { coding: [{ code: "INPATIENTDRUG" }] }, // not in the gateway list
      dispenseRequest: {
        validityPeriod: { start: "2025-01-28T00:00:00+08:00", end: "2025-01-30T23:59:59+08:00" },
      },
    };
    linkEncountersInResources([gateway, impStay], [inpMed]);
    expect(inpMed.encounter).toEqual({ reference: "Encounter/imp" });
  });

  // v1.0.5 — the 住院 detail (IHKE3309S02) DOES carry a per-drug list
  // (sp_IHKE3302S11_data). With it captured on the IMP Encounter's __rxOrderCodes,
  // inpatient meds link by drug code (same rule as 門診); validityPeriod span-match
  // is demoted to the no-list fallback.
  test("inpatient-course med links to the 住院 by its drug list — robust to a non-spanning validityPeriod", () => {
    // 更耐 over period-match: the med's window doesn't equal the stay (date quirk)
    // and a same-day gateway 門診 exists — without the drug-list rule the fallback
    // would mislink it to the single-day gateway. Its code IS in the 住院 list → 住院.
    const gateway = encRx("gw", "長庚嘉義", "2025-05-18", "AMB", ["GATEWAYDRUG"]);
    const impStay = {
      ...imp("imp", "長庚嘉義", "2025-05-18", "2025-05-22"),
      __rxOrderCodes: ["A037697100"],
    };
    const inpMed: Record<string, any> = {
      resourceType: "MedicationRequest",
      id: "inp-med",
      requester: { display: "長庚嘉義" },
      authoredOn: "2025-05-18T00:00:00+08:00",
      medicationCodeableConcept: { coding: [{ code: "A037697100" }] },
      dispenseRequest: {
        validityPeriod: { start: "2025-05-18T00:00:00+08:00", end: "2025-05-19T23:59:59+08:00" },
      },
    };
    linkEncountersInResources([gateway, impStay], [inpMed]);
    expect(inpMed.encounter).toEqual({ reference: "Encounter/imp" });
  });

  test("inpatient drug NOT in the 住院 list stays UNLINKED — even though validityPeriod spans the stay (自備藥)", () => {
    // User rule 2026-06-23: once the 住院 list IS captured it is authoritative — a
    // drug absent from it (patient's 自備藥, never billed) is NOT period-matched into
    // the stay. Absence from the list ≠ "not taken". 寧願獨立也不要亂塞.
    const impStay = {
      ...imp("imp", "長庚嘉義", "2025-05-18", "2025-05-22"),
      __rxOrderCodes: ["A037697100"],
    };
    const selfSupplied: Record<string, any> = {
      resourceType: "MedicationRequest",
      id: "self-med",
      requester: { display: "長庚嘉義" },
      authoredOn: "2025-05-18T00:00:00+08:00",
      medicationCodeableConcept: { coding: [{ code: "SELFSUPPLIED" }] },
      dispenseRequest: {
        validityPeriod: { start: "2025-05-18T00:00:00+08:00", end: "2025-05-22T23:59:59+08:00" },
      },
    };
    linkEncountersInResources([impStay], [selfSupplied]);
    expect(selfSupplied.encounter).toBeUndefined();
  });

  test("outpatient med on an admission day links to its 門診 list, ignoring the same-day 住院 list", () => {
    // isInpatient-scoping for the OPD side: an outpatient med (no validityPeriod)
    // consults only the 門診/急診 lists; the same-day 住院 list is not relevant to it.
    const gateway = encRx("gw", "長庚嘉義", "2025-05-18", "AMB", ["GATEWAYDRUG"]);
    const impStay = {
      ...imp("imp", "長庚嘉義", "2025-05-18", "2025-05-22"),
      __rxOrderCodes: ["INPATIENTDRUG"],
    };
    const opdMed = med("opd", "長庚嘉義", "2025-05-18", "GATEWAYDRUG");
    linkEncountersInResources([gateway, impStay], [opdMed]);
    expect(opdMed.encounter).toEqual({ reference: "Encounter/gw" });
  });
});
