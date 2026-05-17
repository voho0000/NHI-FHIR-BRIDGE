/**
 * Claude LLM provider.
 *
 * Port of `backend/app/fallback/llm/claude.py`. Uses Anthropic's official
 * Node SDK; the extraction-only entry point (`extractStructuredData`) is
 * what /sync/upload-html actually calls.
 */

import Anthropic from "@anthropic-ai/sdk";

import type { AgentAction, LLMProvider, PageState } from "@/fallback/llm/base";
import { safeJsonLoads } from "@/fallback/llm/json-utils";

const SYSTEM_PROMPT = `You are an AI agent controlling a web browser to extract medical data from a Hospital Information System (HIS).

Analyze the page screenshot and/or HTML, then respond with a single JSON object:
{
  "action_type": "click" | "fill" | "navigate" | "wait" | "done" | "error",
  "selector": "CSS selector or element description",
  "value": "text to type (for fill action)",
  "url": "full URL (for navigate action)",
  "reasoning": "brief explanation"
}

Rules:
- For login forms: use exact CSS selectors from the HTML (input[name=...], button[type=submit])
- "done" means the current task is complete
- "error" means you cannot proceed; set reasoning to explain why
- Respond with JSON ONLY, no markdown, no explanation outside the JSON`;

export class ClaudeProvider implements LLMProvider {
  readonly providerName = "claude";
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model = "claude-sonnet-4-6") {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async decideAction(pageState: PageState): Promise<AgentAction> {
    const content: any[] = [];
    if (pageState.screenshot_b64) {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: "image/png",
          data: pageState.screenshot_b64,
        },
      });
    }

    let historyLines = "";
    if (pageState.history && pageState.history.length > 0) {
      historyLines = `\nRecent actions:\n${pageState.history
        .slice(-5)
        .map((a) => `  ${a.action_type}: ${a.selector ?? a.url ?? ""} | ${a.reasoning ?? ""}`)
        .join("\n")}`;
    }

    content.push({
      type: "text",
      text: `Task: ${pageState.task_description}\nURL: ${pageState.url}${historyLines}\n\nHTML (simplified):\n\`\`\`html\n${pageState.html_snippet.slice(0, 3000)}\n\`\`\`\n\nRespond with JSON only:`,
    });

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content }],
    });
    const firstBlock = response.content[0];
    const text = firstBlock && firstBlock.type === "text" ? firstBlock.text : "{}";
    const data = safeJsonLoads(text);
    return {
      action_type: data.action_type ?? "error",
      selector: data.selector ?? null,
      value: data.value ?? null,
      url: data.url ?? null,
      extracted_data: data.extracted_data ?? null,
      reasoning: data.reasoning ?? null,
    };
  }

  async extractStructuredData(
    htmlContent: string,
    extractionSchema: Record<string, any>,
  ): Promise<any> {
    const truncated = htmlContent.slice(0, 50000);
    const prompt = `Extract medical data from the HTML below.\nReturn a JSON object matching this schema:\n${JSON.stringify(extractionSchema, null, 2)}\n\nHTML:\n\`\`\`html\n${truncated}\n\`\`\`\n\nReturn valid JSON only, no markdown.`;

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 16384,
      messages: [{ role: "user", content: prompt }],
    });
    const firstBlock = response.content[0];
    const text = firstBlock && firstBlock.type === "text" ? firstBlock.text : "{}";
    return safeJsonLoads(text);
  }
}
