from typing import Optional, Protocol


class InferenceFunction(Protocol):
    def __call__(self, prompt: str, base64_image: str) -> Optional[str]: ...
