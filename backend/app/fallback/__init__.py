"""Fallback path: HTML capture + LLM extraction → FHIR mappers.

This module is **only invoked by /sync/upload-html** when the extension
falls back from the JSON-API direct path. The primary flow
(/sync/upload-structured) bypasses this module entirely.

When does the fallback fire?
- NHI changes the /api/ihke3000/... endpoints in a breaking way
- A new page type is added that NHI hasn't exposed via JSON yet
- The extension is forced into HTML-capture mode for debugging

Components:
- `extractor.extract_and_map()` — orchestrates preprocess → LLM → mapper
- `preprocessor.preprocess()` — strips vendor cruft from NHI HTML
- `llm/` — Claude + Ollama providers with a shared base interface

To enable the fallback, set LLM_PROVIDER + ANTHROPIC_API_KEY (or Ollama
config) in .env and call POST /sync/upload-html from a custom client.
"""
