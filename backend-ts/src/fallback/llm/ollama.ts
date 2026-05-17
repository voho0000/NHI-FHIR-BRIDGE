/**
 * Local Ollama LLM provider.
 *
 * Port of `backend/app/fallback/llm/ollama.py`. Uses Ollama's /api/generate
 * REST endpoint with `format=json` for JSON-constrained output. Recommended
 * models: qwen2.5vl:7b (default, vision+Chinese), qwen3:8b (text-only),
 * llama3.2-vision:11b.
 */

import type { AgentAction, LLMProvider, PageState } from "@/fallback/llm/base";
import { safeJsonLoads } from "@/fallback/llm/json-utils";

const SYSTEM_PROMPT =
  "You are a browser automation agent. " +
  "Analyze the page and respond with a JSON object only: " +
  '{"action_type":"click"|"fill"|"navigate"|"wait"|"done"|"error",' +
  '"selector":"...","value":"...","url":"...","reasoning":"..."}';

export class OllamaProvider implements LLMProvider {
  readonly providerName = "ollama";
  private baseUrl: string;
  private model: string;

  constructor(baseUrl = "http://host.docker.internal:11434", model = "qwen2.5vl:7b") {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.model = model;
  }

  async decideAction(pageState: PageState): Promise<AgentAction> {
    const images = pageState.screenshot_b64 ? [pageState.screenshot_b64] : [];

    let historyLines = "";
    if (pageState.history && pageState.history.length > 0) {
      historyLines = `\nRecent: ${pageState.history
        .slice(-3)
        .map((a) => `${a.action_type}(${a.selector ?? a.url ?? ""})`)
        .join("; ")}`;
    }

    const prompt = `${SYSTEM_PROMPT}\n\nTask: ${pageState.task_description}\nURL: ${pageState.url}${historyLines}\nHTML: ${pageState.html_snippet.slice(0, 2000)}\n\nJSON response:`;

    const data = await this.generate(prompt, images);
    const text = typeof data.response === "string" ? data.response : "{}";
    let parsed: any;
    try {
      parsed = safeJsonLoads(text);
    } catch {
      return {
        action_type: "error",
        reasoning: `Failed to parse LLM response: ${text.slice(0, 200)}`,
      };
    }
    return {
      action_type: parsed.action_type ?? "error",
      selector: parsed.selector ?? null,
      value: parsed.value ?? null,
      url: parsed.url ?? null,
      extracted_data: parsed.extracted_data ?? null,
      reasoning: parsed.reasoning ?? null,
    };
  }

  async extractStructuredData(
    htmlContent: string,
    extractionSchema: Record<string, any>,
  ): Promise<any> {
    const truncated = htmlContent.slice(0, 24000);
    const prompt = `Extract medical data from the HTML below. Match this schema exactly:\n${JSON.stringify(extractionSchema, null, 2)}\n\nHTML:\n${truncated}\n\nRespond with ONLY a single JSON object that conforms to the schema. No prose, no markdown fences.`;
    const data = await this.generate(prompt, []);
    const raw = typeof data.response === "string" ? data.response : "{}";
    try {
      return safeJsonLoads(raw);
    } catch (e: any) {
      throw new Error(`Ollama returned unparseable JSON: ${e?.message ?? e}`);
    }
  }

  private async generate(prompt: string, images: string[]): Promise<any> {
    const payload: Record<string, any> = {
      model: this.model,
      prompt,
      stream: false,
      format: "json",
      options: { temperature: 0.1 },
    };
    if (images.length > 0) payload.images = images;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 180_000);
    try {
      const resp = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Ollama HTTP ${resp.status}: ${errText.slice(0, 200)}`);
      }
      return await resp.json();
    } finally {
      clearTimeout(timer);
    }
  }
}
