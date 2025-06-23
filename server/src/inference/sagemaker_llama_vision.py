import json
from typing import Optional, cast

import boto3

from models.sagemaker_response import SageMakerResponse
from settings import get_settings

settings = get_settings()


def call_sagemaker_model(prompt: str, base64_image: str) -> Optional[str]:
    messages = [
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
    ]

    runtime = boto3.client("sagemaker-runtime", region_name=settings.SAGEMAKER_REGION)
    response = runtime.invoke_endpoint(
        EndpointName=settings.SAGEMAKER_ENDPOINT,
        ContentType="application/json",
        Body=json.dumps({"messages": messages}),
    )

    result = response["Body"].read().decode("utf-8")
    parsed = cast(SageMakerResponse, SageMakerResponse.model_validate(json.loads(result)))

    if not parsed.choices or not parsed.choices[0].message:
        return None
    return parsed.choices[0].message.content
