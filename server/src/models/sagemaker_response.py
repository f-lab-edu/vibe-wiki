from typing import Optional

from pydantic import BaseModel


class SageMakerMessage(BaseModel):
    role: str
    content: Optional[str]


class SageMakerChoice(BaseModel):
    message: Optional[SageMakerMessage]


class SageMakerResponse(BaseModel):
    choices: list[SageMakerChoice]
