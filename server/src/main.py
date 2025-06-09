from typing import Dict

from fastapi import FastAPI

app = FastAPI(
    title="Vibe Wiki API",
    description="API for transforming handwritten notes and diagrams.",
    version="0.1.0",
)


@app.get("/", tags=["General"])
async def read_root() -> Dict[str, str]:
    """Root endpoint providing a welcome message."""
    return {"message": "Welcome to Vibe Wiki!"}


@app.get("/ping", tags=["General"])
async def ping() -> Dict[str, str]:
    """A simple ping endpoint to check if the server is responsive."""
    return {"status": "ok", "message": "pong"}