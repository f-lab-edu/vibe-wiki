import json
import os

import boto3
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

# OpenAI client
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))

# SageMaker client
sagemaker_region = os.getenv("SAGEMAKER_REGION", "ap-northeast-2")
sagemaker_endpoint = os.getenv("SAGEMAKER_ENDPOINT", "")
sagemaker_client = boto3.client("sagemaker-runtime", region_name=sagemaker_region)


def call_openai_model(prompt: str, base64_image: str) -> str | None:
    response = openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": prompt},
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{base64_image}",
                        },
                    }
                ],
            },
        ],
        max_tokens=1000,
    )

    if not response.choices or not response.choices[0].message:
        return None

    return response.choices[0].message.content


def call_sagemaker_model(prompt: str, base64_image: str) -> str | None:
    messages = [
        {"role": "user", "content": prompt},
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{base64_image}",
                    },
                },
            ],
        },
    ]

    payload = {
        "messages": messages,
    }

    runtime = boto3.client("sagemaker-runtime", region_name=sagemaker_region)
    response = runtime.invoke_endpoint(
        EndpointName=sagemaker_endpoint, ContentType="application/json", Body=json.dumps(payload)
    )

    result = response["Body"].read().decode("utf-8")
    result_json = json.loads(result)
    if not result_json.get("choices") or not result_json["choices"][0].get("message"):
        return None

    return result_json["choices"][0]["message"]["content"]
