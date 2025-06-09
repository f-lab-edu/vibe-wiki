import os
from typing import Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

app = FastAPI(
    title="Vibe Wiki API",
    description="API for transforming handwritten notes and diagrams.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class DiagramRequest(BaseModel):
    image: str
    prompt: str


@app.post("/api/generate-diagram")
async def generate_diagram(req: DiagramRequest):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": req.prompt},
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/png;base64,{req.image}",
                        },
                    }
                ],
            },
        ],
        max_tokens=1000,
    )

    mermaid_code = response.choices[0].message.content
    return {"mermaid": mermaid_code}


@app.get("/", tags=["General"])
async def read_root() -> Dict[str, str]:
    """Root endpoint providing a welcome message."""
    return {"message": "Welcome to Vibe Wiki!"}


@app.get("/ping", tags=["General"])
async def ping() -> Dict[str, str]:
    """A simple ping endpoint to check if the server is responsive."""
    return {"status": "ok", "message": "pong"}
