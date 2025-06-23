from typing import Callable, Optional

from inference.openai import call_openai_model
from inference.sagemaker_llama_vision import call_sagemaker_model

ModelHandler = Callable[[str, str], Optional[str]]

MODEL_REGISTRY: dict[str, ModelHandler] = {
    "openai": call_openai_model,
    "llama": call_sagemaker_model,
}
