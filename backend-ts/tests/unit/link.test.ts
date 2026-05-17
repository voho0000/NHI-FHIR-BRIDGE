import { describe, expect, test } from "vitest";

import {
  dedupAdmissionDayAmb,
  linkEncountersInResources,
  resolveSexStratifiedRanges,
} from "@nhi-fhir-bridge/mapper";

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

describe("dedupAdmissionDayAmb", () => {
  test("removes AMB when same (hospital, start_date) IMP exists", () => {
    const out = dedupAdmissionDayAmb([
      amb("amb-1", "VGH", "2024-05-01"),
      imp("imp-1", "VGH", "2024-05-01", "2024-05-05"),
    ]);
    expect(out.map((r) => r.id)).toEqual(["imp-1"]);
  });

  test("keeps AMB when no overlapping IMP", () => {
    const out = dedupAdmissionDayAmb([amb("amb-1", "VGH", "2024-05-01")]);
    expect(out.map((r) => r.id)).toEqual(["amb-1"]);
  });

  test("keeps AMB at different hospital than IMP same day", () => {
    const out = dedupAdmissionDayAmb([
      amb("amb-1", "NTUH", "2024-05-01"),
      imp("imp-1", "VGH", "2024-05-01", "2024-05-05"),
    ]);
    expect(out).toHaveLength(2);
  });

  test("keeps AMB at same hospital on a different day", () => {
    const out = dedupAdmissionDayAmb([
      amb("amb-1", "VGH", "2024-05-03"),
      imp("imp-1", "VGH", "2024-05-01", "2024-05-05"),
    ]);
    expect(out).toHaveLength(2);
  });

  test("does not touch non-Encounter resources", () => {
    const o = obs("obs-1", "VGH", "2024-05-01");
    const out = dedupAdmissionDayAmb([
      o,
      amb("amb-1", "VGH", "2024-05-01"),
      imp("imp-1", "VGH", "2024-05-01", "2024-05-05"),
    ]);
    expect(out.find((r) => r.id === "obs-1")).toBe(o);
  });
});

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
