/**
 * Robust JSON extraction shared by both Claude and Ollama providers.
 *
 * Port of `backend/app/fallback/llm/json_utils.py`. LLM JSON output is
 * rarely pristine: models wrap in markdown fences, prepend prose,
 * append chatter, or get truncated mid-string. Naive JSON.parse fails
 * for any of those.
 */

const JSON_FENCE = /```(?:json)?\s*([\s\S]*?)```/;

export function safeJsonLoads(text: string): any {
  if (!text) throw new Error("empty response");
  let working = text.trim();

  try {
    return JSON.parse(working);
  } catch {
    /* fall through */
  }

  const fence = JSON_FENCE.exec(working);
  if (fence) {
    const candidate = fence[1]!.trim();
    try {
      return JSON.parse(candidate);
    } catch {
      working = candidate;
    }
  }

  for (const [openCh, closeCh] of [
    ["{", "}"],
    ["[", "]"],
  ] as const) {
    const start = working.indexOf(openCh);
    if (start < 0) continue;
    const block = balancedBlock(working, start, openCh, closeCh);
    if (block === null) continue;
    try {
      return JSON.parse(block);
    } catch {}
  }

  throw new Error(`no parseable JSON found in: ${text.slice(0, 200)}`);
}

function balancedBlock(
  text: string,
  start: number,
  openCh: string,
  closeCh: string,
): string | null {
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i]!;
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === "\\" && inString) {
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === openCh) depth++;
    else if (ch === closeCh) {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}
