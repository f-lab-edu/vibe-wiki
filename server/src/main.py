from typing import Dict

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.diagram_request import DiagramRequest
from models.inference import call_openai_model, call_sagemaker_model

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


@app.post("/api/generate-diagram")
async def generate_diagram(req: DiagramRequest):
    try:
        if req.model == "openai":
            mermaid_code = call_openai_model(req.prompt, req.image)
        elif req.model == "llama":
            mermaid_code = call_sagemaker_model(req.prompt, req.image)
        else:
            # Call OpenAI model by default
            mermaid_code = call_openai_model(req.prompt, req.image)
        return {"mermaid": mermaid_code}
    except Exception as e:
        return {"error": str(e)}


@app.get("/", tags=["General"])
async def read_root() -> Dict[str, str]:
    """Root endpoint providing a welcome message."""
    return {"message": "Welcome to Vibe Wiki!"}


@app.get("/ping", tags=["General"])
async def ping() -> Dict[str, str]:
    """A simple ping endpoint to check if the server is responsive."""
    return {"status": "ok", "message": "pong"}
