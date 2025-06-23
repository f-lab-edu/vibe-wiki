from typing import Literal

from pydantic import BaseModel, Field


class DiagramRequest(BaseModel):
    image: str  # base64 string
    prompt: str
    model: Literal["openai", "llama"] = Field(..., description="Model to use: 'openai' or 'llama'")
