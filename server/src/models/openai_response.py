from typing import Optional

from pydantic import BaseModel


class OpenAIMessage(BaseModel):
    role: str
    content: Optional[str]


class OpenAIChoice(BaseModel):
    message: Optional[OpenAIMessage]


class OpenAIResponse(BaseModel):
    choices: list[OpenAIChoice]
