// Pure wizard step-routing decisions, kept DOM-free so they can be
// unit-tested without a browser environment.

interface SyncStatusish {
  running?: boolean;
  phase?: string;
}

// Decide whether a sync-status update should force-jump the wizard to
// step 3 (the step hosting the progress / result banner).
//
// Two cases withhold the jump — everything else (start, completion,
// reopening the popup mid-sync) still jumps so the banner is visible:
//   • running → running: the SW emits a progress line every ~1-2s while
//     syncing. Jumping on each one made step 2 unviewable mid-sync — the
//     user tapped over to review their data and got yanked back within a
//     second or two (bug reported 2026-06-13).
//   • done → done: the v0.15 background imaging-poll trickle increments
//     the progress text after completion; don't pull the user off step 4
//     (SMART app launcher) just because a few more frames landed.
export function _shouldJumpToResultStep(
  prev: SyncStatusish | null | undefined,
  status: SyncStatusish,
): boolean {
  if (status.running && prev?.running) return false;
  if (prev?.phase === "done" && status.phase === "done" && !status.running && !prev.running) {
    return false;
  }
  return true;
}
