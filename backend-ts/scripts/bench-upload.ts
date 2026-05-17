/**
 * Throughput benchmark for /sync/upload-structured.
 *
 * Simulates a real NHI sync: 1 Patient + 200 Encounters + 1000 Observations
 * + 500 MedicationRequests against a freshly-started server. Reports
 * per-phase elapsed and total fsync count proxy (rows × estimated writes).
 */

import { performance } from "node:perf_hooks";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:18099";
const PATIENT_ID = "BENCH000001";

async function post(path: string, body: unknown): Promise<{ status: number; json: any; ms: number }> {
  const t0 = performance.now();
  const resp = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await resp.text();
  const ms = performance.now() - t0;
  return { status: resp.status, json: text ? JSON.parse(text) : null, ms };
}

function makeEncounters(n: number) {
  const items = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(2024, 0, 1 + i);
    const date = d.toISOString().slice(0, 10);
    items.push({
      date,
      class: i % 5 === 0 ? "IMP" : "AMB",
      type_display: "門診",
      department: "內科",
      provider: "Dr. Bench",
      hospital: "Bench Hospital",
    });
  }
  return items;
}

function makeObservations(n: number) {
  const items = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(2024, 0, 1 + (i % 200));
    items.push({
      date: d.toISOString().slice(0, 10),
      order_code: "08013C",
      order_name: "CBC w/ Diff",
      code: "WBC",
      display: i % 2 === 0 ? "WBC" : "Hemoglobin",
      value: 6.5 + (i % 10) * 0.1,
      unit: "10^3/uL",
      hospital: "Bench Hospital",
    });
  }
  return items;
}

function makeMedications(n: number) {
  const items = [];
  for (let i = 0; i < n; i++) {
    const d = new Date(2024, 0, 1 + (i % 200));
    items.push({
      date: d.toISOString().slice(0, 10),
      drug_name: `Drug${i % 50} 5mg`,
      duration_days: 7,
      hospital: "Bench Hospital",
    });
  }
  return items;
}

async function runOnce(label: string) {
  console.log(`\n[bench] === ${label} ===`);

  // Warm up + create Patient.
  const patientStart = performance.now();
  const pRes = await post("/sync/upload-structured", {
    page_type: "patient_info",
    items: [],
    patient_override: {
      id_no: PATIENT_ID,
      name: "Bench Patient",
      gender: "male",
      birth_date: "1980-01-01",
    },
  });
  console.log(`[bench] patient_info status=${pRes.status} elapsed=${pRes.ms.toFixed(0)}ms`);

  const encItems = makeEncounters(400);
  const eRes = await post("/sync/upload-structured", {
    page_type: "encounters",
    items: encItems,
    patient_id: PATIENT_ID,
  });
  console.log(`[bench] encounters n=${encItems.length} status=${eRes.status} elapsed=${eRes.ms.toFixed(0)}ms`);

  const obsItems = makeObservations(3000);
  const oRes = await post("/sync/upload-structured", {
    page_type: "observations",
    items: obsItems,
    patient_id: PATIENT_ID,
  });
  console.log(`[bench] observations n=${obsItems.length} status=${oRes.status} elapsed=${oRes.ms.toFixed(0)}ms`);

  const medItems = makeMedications(1500);
  const mRes = await post("/sync/upload-structured", {
    page_type: "medications",
    items: medItems,
    patient_id: PATIENT_ID,
  });
  console.log(`[bench] medications n=${medItems.length} status=${mRes.status} elapsed=${mRes.ms.toFixed(0)}ms`);

  const total = pRes.ms + eRes.ms + oRes.ms + mRes.ms;
  console.log(`[bench] total ${total.toFixed(0)}ms (${(total / 1000).toFixed(1)}s) wall=${(performance.now() - patientStart).toFixed(0)}ms`);
}

async function main() {
  console.log(`[bench] target=${BASE}`);
  // 1st: insert path (all rows new).
  await runOnce("FRESH (insert)");
  // 2nd: same payload — every upsert hits the existing-row branch.
  await runOnce("RESYNC (update)");
  // 3rd: same payload again to confirm steady-state.
  await runOnce("RESYNC #2");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
