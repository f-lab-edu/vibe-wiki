# settings.py

from functools import lru_cache

from pydantic_settings import BaseSettings


class AppSettings(BaseSettings):
    OPENAI_API_KEY: str
    SAGEMAKER_REGION: str
    SAGEMAKER_ENDPOINT: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> AppSettings:
    try:
        return AppSettings()
    except Exception as e:
        raise RuntimeError(f"Failed to load settings: {e}")
