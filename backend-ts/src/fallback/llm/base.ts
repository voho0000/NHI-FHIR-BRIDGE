/**
 * Abstract LLM provider interface.
 *
 * Port of `backend/app/fallback/llm/base.py`. Swap implementations via
 * LLM_PROVIDER env var:
 *   - "claude" → ClaudeProvider (uses Anthropic API)
 *   - "ollama" → OllamaProvider (local on-prem model)
 */

export type ActionType = "click" | "fill" | "navigate" | "extract" | "wait" | "done" | "error";

export interface AgentAction {
  action_type: ActionType;
  selector?: string | null;
  value?: string | null;
  url?: string | null;
  extracted_data?: Record<string, any> | null;
  reasoning?: string | null;
}

export interface PageState {
  url: string;
  html_snippet: string;
  task_description: string;
  screenshot_b64?: string | null;
  history?: AgentAction[];
}

export interface LLMProvider {
  readonly providerName: string;
  decideAction(pageState: PageState): Promise<AgentAction>;
  extractStructuredData(htmlContent: string, extractionSchema: Record<string, any>): Promise<any>;
}
