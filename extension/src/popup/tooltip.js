// ── ⓘ Help-icon tooltip ─────────────────────────────────────────────
//
// One shared <div> appended to the popup body at module load (the popup
// bundle runs after the DOM is parsed). On hover of any .help-icon, the
// entry's delegated mouseover/mouseout handlers call show/hide below,
// which copy the icon's data-tip text and position the tooltip inside
// the popup, clamping to its viewport so it can't clip off either edge
// regardless of where the icon sits. (CSS pseudo-elements can't be
// measured, so a pure-CSS approach inevitably picks one anchor side and
// breaks for icons on the other side of the popup.)

import { VIEWPORT_MARGIN } from "./constants.js";

const _helpTip = document.createElement("div");
_helpTip.className = "help-tooltip";
document.body.appendChild(_helpTip);

export function _showHelpTooltip(icon) {
  _helpTip.textContent = icon.dataset.tip || icon.getAttribute("data-tip") || "";
  _helpTip.classList.add("visible");

  // Measure now that content is set.
  const iconRect = icon.getBoundingClientRect();
  const tipRect = _helpTip.getBoundingClientRect();
  const viewportW = document.documentElement.clientWidth;
  const viewportH = document.documentElement.clientHeight;

  // Horizontal: prefer centered on the icon; clamp into [margin, vw-tip-margin].
  let left = iconRect.left + iconRect.width / 2 - tipRect.width / 2;
  if (left < VIEWPORT_MARGIN) left = VIEWPORT_MARGIN;
  if (left + tipRect.width > viewportW - VIEWPORT_MARGIN) {
    left = viewportW - VIEWPORT_MARGIN - tipRect.width;
  }
  // Vertical: prefer above the icon; flip below if there's no room up top.
  let top = iconRect.top - tipRect.height - 6;
  if (top < VIEWPORT_MARGIN) top = iconRect.bottom + 6;
  // Final safety: clamp into viewport so very long tooltips can't bleed
  // off the bottom either.
  if (top + tipRect.height > viewportH - VIEWPORT_MARGIN) {
    top = Math.max(VIEWPORT_MARGIN, viewportH - VIEWPORT_MARGIN - tipRect.height);
  }

  _helpTip.style.left = `${left}px`;
  _helpTip.style.top = `${top}px`;
}

export function _hideHelpTooltip() {
  _helpTip.classList.remove("visible");
}
