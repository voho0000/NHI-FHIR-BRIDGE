/**
 * HTML preprocessor — strip vendor cruft before sending to the LLM.
 *
 * Port of `backend/app/fallback/preprocessor.py`. NHI 健康存摺 wraps the
 * real data in `.main_ctn`; the surrounding ~95% is jQuery/CSS/nav/scripts
 * we don't want the LLM to see. Unknown hosts pass through untouched.
 */

import * as cheerio from "cheerio";

export const NHI_HOST = "myhealthbank.nhi.gov.tw";

const NHI_STRIP_GLOBAL = [
  "script",
  "style",
  "noscript",
  "img",
  "link",
  "meta",
  ".main_menu",
  ".mobile_menu",
  ".mobile_menu_box",
  "#footer_ctn",
  ".btn-logout",
  "#header-menu",
  "#immersive-translate-popup",
  "[id^='merlin-']",
  "[id^='give-freely-root']",
];

const NHI_KEEP_PER_PAGE: Record<string, string[]> = {
  patient_info: [".main_ctn"],
  allergies: [".main_ctn"],
  observations: [".main_ctn"],
  medications: [".main_ctn"],
  conditions: [".main_ctn"],
  diagnostic_reports: [".main_ctn"],
  procedures: [".main_ctn"],
  encounters: [".main_ctn"],
};

export function preprocess(
  html: string,
  host: string | null | undefined,
  pageType: string,
): string {
  if (host !== NHI_HOST) return html;
  const keepSelectors = NHI_KEEP_PER_PAGE[pageType];
  if (!keepSelectors) return html;

  const $ = cheerio.load(html);
  const kept = keepSelectors.flatMap((sel) => $(sel).toArray());
  if (kept.length === 0) return html;

  const out = cheerio.load(
    '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>',
  );
  const title = $("title").first();
  if (title.length > 0) {
    out("head").append(out.html(title));
  }
  const body = out("body");
  for (const el of kept) {
    body.append($.html(el));
  }
  for (const selector of NHI_STRIP_GLOBAL) {
    out(selector).remove();
  }
  const cleaned = out.html() ?? "";
  return cleaned
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .join("\n");
}
