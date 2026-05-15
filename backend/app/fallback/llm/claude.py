import json
import logging
from anthropic import AsyncAnthropic

from .base import LLMProvider, PageState, AgentAction

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = """You are an AI agent controlling a web browser to extract medical data from a Hospital Information System (HIS).

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
- Respond with JSON ONLY, no markdown, no explanation outside the JSON"""


class ClaudeProvider(LLMProvider):
    def __init__(self, api_key: str, model: str = "claude-sonnet-4-6"):
        self.client = AsyncAnthropic(api_key=api_key)
        self.model = model

    @property
    def provider_name(self) -> str:
        return "claude"

    async def decide_action(self, page_state: PageState) -> AgentAction:
        content = []

        if page_state.screenshot_b64:
            content.append({
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/png",
                    "data": page_state.screenshot_b64,
                },
            })

        history_lines = ""
        if page_state.history:
            history_lines = "\nRecent actions:\n" + "\n".join(
                f"  {a.action_type}: {a.selector or a.url or ''} | {a.reasoning or ''}"
                for a in page_state.history[-5:]
            )

        content.append({
            "type": "text",
            "text": (
                f"Task: {page_state.task_description}\n"
                f"URL: {page_state.url}"
                f"{history_lines}\n\n"
                f"HTML (simplified):\n```html\n{page_state.html_snippet[:3000]}\n```\n\n"
                "Respond with JSON only:"
            ),
        })

        response = await self.client.messages.create(
            model=self.model,
            max_tokens=512,
            system=_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": content}],
        )

        return self._parse_action(response.content[0].text)

    async def extract_structured_data(self, html_content: str, extraction_schema: dict) -> dict:
        # Browser-captured HTML (document.documentElement.outerHTML) is
        # frequently 3–5× larger than the raw HTTP response because the DOM
        # gets normalized/expanded. 8 KB cuts off the body of any non-trivial
        # HIS page. Claude Sonnet has 200 KB context; 50 KB covers anything
        # realistic without meaningful cost.
        truncated = html_content[:50000]
        prompt = (
            f"Extract medical data from the HTML below.\n"
            f"Return a JSON object matching this schema:\n{json.dumps(extraction_schema, ensure_ascii=False, indent=2)}\n\n"
            f"HTML:\n```html\n{truncated}\n```\n\n"
            "Return valid JSON only, no markdown."
        )

        # 4096 was getting truncated for big lab panels (one CBC report =
        # 60+ Observation rows, easily 8K+ tokens of JSON output). 16384 is
        # well within Sonnet's per-turn limit and costs roughly $0.25/Mtok
        # output → ~$0.001 per worst-case call.
        response = await self.client.messages.create(
            model=self.model,
            max_tokens=16384,
            messages=[{"role": "user", "content": prompt}],
        )

        return self._parse_json(response.content[0].text)

    def _parse_action(self, text: str) -> AgentAction:
        data = self._parse_json(text)
        return AgentAction(
            action_type=data.get("action_type", "error"),
            selector=data.get("selector"),
            value=data.get("value"),
            url=data.get("url"),
            extracted_data=data.get("extracted_data"),
            reasoning=data.get("reasoning"),
        )

    @staticmethod
    def _parse_json(text: str) -> dict:
        from .json_utils import safe_json_loads
        return safe_json_loads(text)
