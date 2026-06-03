// Pure extractors over NHI's S02 detail bodies (IHKE3303S02 encounter,
// IHKE3309S02 inpatient, …). No chrome.* / network — unit-testable in
// isolation.

// NHI's S02 detail endpoints wrap the main row under a key named after the
// endpoint — ihke3303S02_main_data / ihke3309S02_main_data / etc. This
// helper picks out main_data[0] regardless of which S02 we hit, so the three
// downstream extractors (classFromS02Detail, primaryIcdFromS02Detail,
// secondaryIcdsFromS02Detail) work uniformly.
export function pickS02MainRow(body) {
  if (!body || typeof body !== "object") return null;
  for (const k of Object.keys(body)) {
    if (/^ihke\d+S02_main_data$/i.test(k) && Array.isArray(body[k]) && body[k].length > 0) {
      return body[k][0];
    }
  }
  return null;
}

export function classFromS02Detail(body) {
  const main = pickS02MainRow(body);
  if (!main) return null;
  const tn = String(main.hosp_DATA_TYPE_NAME || "");
  if (tn.includes("急")) return "EMER"; // 急診
  if (tn.includes("住院")) return "IMP";
  // 西醫 / 中醫 / 牙醫 / 藥局 all default to AMB
  return "AMB";
}

// Pull the primary ICD's bilingual name from IHKE3303S02 detail. The list
// endpoint IHKE3303S01 sometimes ships icD9CM_CODE_CNAME as Chinese-only
// "<code>/<中文>"; detail consistently ships full bilingual
// "<code>/<中文>||<code>/<English>". Caller passes the result via
// options.primary_diagnosis to the encounter adapter, which prefers it over
// the (potentially Chinese-only) list-level field. Result:
// Encounter.reasonCode[0].coding[0].display is reliably English.
export function primaryIcdFromS02Detail(body) {
  const main = pickS02MainRow(body);
  if (!main) return null;
  const codeName = main.icd9cm_CODE_CNAME || main.icd9cm_code_cname || "";
  if (!codeName) return null;
  const code = main.icd9cm_CODE || main.icd9cm_code || "";
  const stripIcdPrefix = (s) => String(s || "").replace(/^[A-Z0-9.]+\/\s*/, "");
  const pickHalf = (s, half) => {
    const str = String(s || "");
    const idx = str.indexOf("||");
    if (idx === -1) return str.trim();
    if (half === "zh") return str.slice(0, idx).trim() || str.slice(idx + 2).trim();
    return str.slice(idx + 2).trim() || str.slice(0, idx).trim();
  };
  const name_en = stripIcdPrefix(pickHalf(codeName, "en"));
  const name_zh = stripIcdPrefix(pickHalf(codeName, "zh"));
  if (!code && !name_en && !name_zh) return null;
  return { code, name_en, name_zh };
}

// Pull secondary diagnoses (次診斷) from IHKE3303S02 detail. Live data shows
// 0-4 entries per encounter; the eye-clinic case in the test sample maxes out
// at 4. Each entry is shaped:
//   { icd_tit: "次診斷N||Secondary Diagnosis N",
//     icd_code_name: "<code>/<中文>||<code>/<English>" }
// Returns a normalized array passed via the encounter adapter's
// options.secondary_diagnoses → mapper emits one reasonCode[] entry per item.
export function secondaryIcdsFromS02Detail(body) {
  const main = pickS02MainRow(body);
  if (!main) return [];
  const list = Array.isArray(main.icdcode_data) ? main.icdcode_data : [];
  const out = [];
  // strip the "<CODE>/" prefix from each half (same pattern as
  // medication / encounter primary ICD bilingual)
  const stripIcdPrefix = (s) => String(s || "").replace(/^[A-Z0-9.]+\/\s*/, "");
  const pickHalf = (s, half) => {
    const str = String(s || "");
    const idx = str.indexOf("||");
    if (idx === -1) return str.trim();
    if (half === "zh") return str.slice(0, idx).trim() || str.slice(idx + 2).trim();
    return str.slice(idx + 2).trim() || str.slice(0, idx).trim();
  };
  for (const item of list) {
    const codeName = item?.icd_code_name || item?.icd_CODE_NAME || "";
    // Extract code from either half (both sides prefix with same code).
    const codeMatch = String(codeName).match(/^([A-Z0-9.]+)\//);
    const code = codeMatch ? codeMatch[1] : "";
    const name_en = stripIcdPrefix(pickHalf(codeName, "en"));
    const name_zh = stripIcdPrefix(pickHalf(codeName, "zh"));
    if (!code && !name_en && !name_zh) continue;
    out.push({ code, name_en, name_zh });
  }
  return out;
}
