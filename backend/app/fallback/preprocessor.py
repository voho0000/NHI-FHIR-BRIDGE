"""HTML preprocessor — strip vendor cruft before sending to the LLM.

NHI 健康存摺 (https://myhealthbank.nhi.gov.tw/) renders the whole page in
`.main_ctn`. The rest is jQuery/CSS/nav menus/hidden inputs that make up
~95% of the captured HTML. Sending the full page to the LLM is

  - expensive  (50 KB → ~12 KB tokens × $3/Mtok = ~$0.04 per call)
  - risky      (truncation eats the data table before the model sees it)
  - low-quality (model gets distracted by all the chrome and scripts)

This module extracts `.main_ctn` and strips global noise so the LLM only
sees the actual data table. It's only used by the LLM fallback path
(/sync/upload-html); the primary path (/sync/upload-structured) skips
preprocessing entirely because the extension already has structured JSON
from the NHI API.

Unknown hosts pass through untouched.
"""

from __future__ import annotations

import logging

from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

NHI_HOST = "myhealthbank.nhi.gov.tw"

# Selectors that get stripped on every NHI page regardless of page_type.
_NHI_STRIP_GLOBAL = (
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
    # Browser extension DOM injections that pollute captured HTML
    "#immersive-translate-popup",
    "[id^='merlin-']",
    "[id^='give-freely-root']",
)

# Every NHI page renders its content in `.main_ctn` regardless of page_type,
# so the keep-selector is uniform. Kept as a set in case we ever need
# per-page-type carve-outs.
_NHI_KEEP_PER_PAGE: dict[str, tuple[str, ...]] = {
    "patient_info": (".main_ctn",),
    "allergies": (".main_ctn",),
    "observations": (".main_ctn",),
    "medications": (".main_ctn",),
    "conditions": (".main_ctn",),
    "diagnostic_reports": (".main_ctn",),
    "procedures": (".main_ctn",),
    "encounters": (".main_ctn",),
}


def preprocess(html: str, host: str | None, page_type: str) -> str:
    """Reduce HTML to just the relevant subtree(s) for `page_type` on `host`.

    Returns the original HTML unchanged when:
      - host is not the NHI host
      - the page_type isn't recognised
      - the keep selectors don't match anything (likely UI change) —
        falling back is safer than returning empty HTML
    """
    if host != NHI_HOST:
        return html

    keep_selectors = _NHI_KEEP_PER_PAGE.get(page_type)
    if not keep_selectors:
        logger.info("preprocess: unknown page_type=%s, passing full HTML through", page_type)
        return html

    soup = BeautifulSoup(html, "lxml")

    extracted = [el for sel in keep_selectors for el in soup.select(sel)]
    if not extracted:
        logger.warning(
            "preprocess: keep selectors %s matched nothing for page_type=%s; "
            "passing through full HTML",
            keep_selectors,
            page_type,
        )
        return html

    # Build a fresh minimal document containing only the kept fragments.
    # `<title>` is also useful for context (often has patient name/histno).
    new_soup = BeautifulSoup(
        '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>',
        "lxml",
    )
    title_el = soup.find("title")
    if title_el:
        new_soup.head.append(title_el)
    body = new_soup.body
    for el in extracted:
        body.append(el)

    # Strip noise from the assembled subtree.
    for selector in _NHI_STRIP_GLOBAL:
        for el in new_soup.select(selector):
            el.decompose()

    # Collapse runs of whitespace and blank lines to keep tokens down further.
    cleaned = str(new_soup)
    cleaned = "\n".join(line for line in cleaned.splitlines() if line.strip())

    logger.info(
        "preprocess: page_type=%s reduced %d → %d chars (%.1f%%)",
        page_type,
        len(html),
        len(cleaned),
        100.0 * len(cleaned) / max(len(html), 1),
    )
    return cleaned
