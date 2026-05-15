import json
import logging
import httpx

from .base import LLMProvider, PageState, AgentAction
from .json_utils import safe_json_loads as _safe_json_loads

logger = logging.getLogger(__name__)

_SYSTEM_PROMPT = (
    "You are a browser automation agent. "
    "Analyze the page and respond with a JSON object only: "
    '{"action_type":"click"|"fill"|"navigate"|"wait"|"done"|"error",'
    '"selector":"...","value":"...","url":"...","reasoning":"..."}'
)


class OllamaProvider(LLMProvider):
    """
    Local on-prem LLM provider via Ollama REST API.

    Recommended models for our use case (Taiwan HIS scraping → FHIR):
      - qwen2.5vl:7b           ← default; vision + Chinese + JSON output, ~5GB
      - qwen3:8b               ← text-only, strongest reasoning (no vision fallback)
      - qwen2.5vl:32b          ← higher quality but ~20GB, tight on 32GB RAM
      - llama3.2-vision:11b    ← alternative

    Set OLLAMA_MODEL in .env to switch models.
    """

    def __init__(self, base_url: str = "http://host.docker.internal:11434", model: str = "qwen2.5vl:7b"):
        self.base_url = base_url.rstrip("/")
        self.model = model

    @property
    def provider_name(self) -> str:
        return "ollama"

    async def decide_action(self, page_state: PageState) -> AgentAction:
        images = [page_state.screenshot_b64] if page_state.screenshot_b64 else []

        history_lines = ""
        if page_state.history:
            history_lines = "\nRecent: " + "; ".join(
                f"{a.action_type}({a.selector or a.url or ''})"
                for a in page_state.history[-3:]
            )

        prompt = (
            f"{_SYSTEM_PROMPT}\n\n"
            f"Task: {page_state.task_description}\n"
            f"URL: {page_state.url}"
            f"{history_lines}\n"
            f"HTML: {page_state.html_snippet[:2000]}\n\n"
            "JSON response:"
        )

        data = await self._generate(prompt, images)
        return self._parse_action(data.get("response", "{}"))

    async def extract_structured_data(self, html_content: str, extraction_schema: dict) -> dict:
        # Browser-captured HTML is typically 3–5× larger than the raw HTTP
        # response. 8 KB cut off the body of real HIS pages and the LLM
        # silently returned nulls. Local models are slower with bigger
        # context, so 24 KB is a compromise — bump higher if your HIS pages
        # are still being truncated.
        truncated = html_content[:24000]
        prompt = (
            f"Extract medical data from the HTML below. Match this schema exactly:\n"
            f"{json.dumps(extraction_schema, ensure_ascii=False, indent=2)}\n\n"
            f"HTML:\n{truncated}\n\n"
            "Respond with ONLY a single JSON object that conforms to the schema. "
            "No prose, no markdown fences."
        )
        data = await self._generate(prompt, [])
        raw = data.get("response", "{}")
        try:
            return _safe_json_loads(raw)
        except ValueError as exc:
            logger.error(f"Ollama returned unparseable JSON: {raw[:500]}")
            raise RuntimeError(f"Ollama returned unparseable JSON: {exc}")

    async def _generate(self, prompt: str, images: list[str]) -> dict:
        # `format=json` asks Ollama to constrain output to valid JSON — honored
        # by Qwen, Llama 3.x, and most modern local models.
        payload: dict = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "format": "json",
            "options": {"temperature": 0.1},
        }
        if images:
            payload["images"] = images

        async with httpx.AsyncClient(timeout=180) as client:
            resp = await client.post(f"{self.base_url}/api/generate", json=payload)
            resp.raise_for_status()
            return resp.json()

    def _parse_action(self, text: str) -> AgentAction:
        try:
            data = _safe_json_loads(text)
        except ValueError:
            return AgentAction(action_type="error", reasoning=f"Failed to parse LLM response: {text[:200]}")

        return AgentAction(
            action_type=data.get("action_type", "error"),
            selector=data.get("selector"),
            value=data.get("value"),
            url=data.get("url"),
            extracted_data=data.get("extracted_data"),
            reasoning=data.get("reasoning"),
        )
