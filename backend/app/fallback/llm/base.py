from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Literal, Optional


@dataclass
class PageState:
    url: str
    html_snippet: str
    task_description: str
    screenshot_b64: Optional[str] = None
    history: list["AgentAction"] = field(default_factory=list)


@dataclass
class AgentAction:
    action_type: Literal["click", "fill", "navigate", "extract", "wait", "done", "error"]
    selector: Optional[str] = None
    value: Optional[str] = None
    url: Optional[str] = None
    extracted_data: Optional[dict] = None
    reasoning: Optional[str] = None


class LLMProvider(ABC):
    """
    Abstract interface for the LLM that drives the browser agent.

    Swap implementations via LLM_PROVIDER env var:
      - "claude"  → ClaudeProvider  (uses Anthropic API)
      - "ollama"  → OllamaProvider  (uses local on-prem model, security compliant)
    """

    @abstractmethod
    async def decide_action(self, page_state: PageState) -> AgentAction:
        """Analyze current page and decide the next browser action."""
        ...

    @abstractmethod
    async def extract_structured_data(self, html_content: str, extraction_schema: dict) -> dict:
        """Extract structured data from HTML according to the given schema."""
        ...

    @property
    @abstractmethod
    def provider_name(self) -> str:
        ...
