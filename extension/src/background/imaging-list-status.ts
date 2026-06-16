// Single source of truth for "is the NHI imaging list still preparing?".
//
// Code-agnostic by design. NHI lazily confirms a patient's imaging list
// server-side; on first access the list can come back in a transient
// state its SPA labels "資料確認中" OR "資料準備中" — and these surface
// under *different* jpG_STATUS codes (observed: "-" on a brand-new
// patient; a 1-row "資料準備中" snapshot with no "-" on another). We can
// NOT reliably enumerate every preparing-state code NHI uses, so we do
// not try. Instead we invert the question:
//
//   The list is READY the moment ANY row exposes a usable image —
//   jpG_STATUS "1" (bytes cached) or "A" (image exists, needs trigger).
//   Until then, treat it as still-preparing and refetch after a wait.
//
// Consequence (intended): a patient who genuinely has no image (every
// row "2" 無影像檔) keeps the caller polling until its attempt budget is
// exhausted before concluding "no image" — i.e. we re-check rather than
// trust the first snapshot. That's the deliberate cost of not guessing
// transient codes.
//
// Used by:
//   • sync-orchestrator.ts  — outer gate: should we refetch the list?
//   • nhi-list-fetch.ts     — resolver poll predicate (INLINED there,
//     because the loop body is serialized into chrome.scripting
//     .executeScript and cannot import this module; keep the two in
//     sync — see imagingRowHasUsableImage there).

export function imagingRowHasUsableImage(row: any): boolean {
  const s = String((row && (row.jpG_STATUS ?? row.jpg_STATUS ?? row.JPG_STATUS)) ?? "");
  return s === "A" || s === "1";
}

// True for a row NHI is still CONFIRMING server-side — its jpG_STATUS is
// neither a final image verdict ("1" ready / "A" triggerable / "2" no-image)
// nor an in-flight trigger ("0"). The observed code is "-" (資料確認中), but
// per the module's "don't enumerate transient codes" rule we define it by
// EXCLUSION: any non-empty status outside the known-final set still counts as
// confirming. Live-verified 2026-06-17: a patient whose whole list was "-" at
// sync time had every row resolve to "A"/"2" minutes later — i.e. "-" is a
// transient state that settles into a real verdict, NOT "no image". Treating
// it as no-image (the pre-fix behaviour) silently dropped real X-ray/CT images.
export function imagingRowIsConfirming(row: any): boolean {
  const s = String((row && (row.jpG_STATUS ?? row.jpg_STATUS ?? row.JPG_STATUS)) ?? "");
  return s !== "" && s !== "1" && s !== "A" && s !== "2" && s !== "0";
}

// Count of still-confirming rows in a list (0 when fully settled).
export function countImagingConfirming(rows: any[]): number {
  return rows.reduce((n, r) => n + (imagingRowIsConfirming(r) ? 1 : 0), 0);
}

// True when the list shows no ready/triggerable image yet (so the caller
// should wait and refetch). Empty list → true (nothing usable yet); the
// caller bounds this with its own attempt budget / length guard.
export function imagingListNeedsResolve(rows: any[]): boolean {
  return !rows.some(imagingRowHasUsableImage);
}
