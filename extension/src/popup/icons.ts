// Shared inline-SVG icon strings for popup notices / banners. Stroke uses
// currentColor so each icon inherits its container's text color (e.g. the
// .cta-reason chip's --notice-info-fg, or a prep-banner state color).
// Single source of truth — both wizard.ts (blocked-CTA chip) and
// imaging-prep-banner.ts pull from here so the icon language stays
// consistent. These replaced the old emoji (🔒/🖼️/✅/⏱/ℹ️) for a cleaner,
// cross-platform-stable look.

const SVG =
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';

export const ICON_LOCK = `${SVG}<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`;
export const ICON_INFO = `${SVG}<circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
export const ICON_CLOCK = `${SVG}<circle cx="12" cy="12" r="9"/><polyline points="12 7.5 12 12 15 13.5"/></svg>`;
export const ICON_CHECK = `${SVG}<circle cx="12" cy="12" r="9"/><polyline points="8.5 12.5 11 15 16 9"/></svg>`;
export const ICON_ALERT = `${SVG}<path d="M12 3.5 21 19H3z"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
export const ICON_CHEVRON =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 6 15 12 9 18"/></svg>';
