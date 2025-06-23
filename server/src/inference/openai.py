from typing import Optional

from openai import OpenAI

from models.openai_response import OpenAIResponse
from settings import get_settings

settings = get_settings()
openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)


def call_openai_model(prompt: str, base64_image: str) -> Optional[str]:
    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": prompt},
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/png;base64,{base64_image}"},
                    }
                ],
            },
        ],
        max_tokens=1000,
    )

    response_dict = response.model_dump()
    parsed = OpenAIResponse.model_validate(response_dict)

    if not parsed.choices or not parsed.choices[0].message:
        return None
    return parsed.choices[0].message.content
