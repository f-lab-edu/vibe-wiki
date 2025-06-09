import os
from typing import Dict

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
WEB_BUILD_DIR = os.path.abspath(os.path.join(BASE_DIR, "../../web/dist"))
EXPO_STATIC_DIR = os.path.join(WEB_BUILD_DIR, "_expo/static")

app = FastAPI(
    title="Vibe Wiki API",
    description="API for transforming handwritten notes and diagrams.",
    version="0.1.0",
)

app.mount("/_expo/static", StaticFiles(directory=EXPO_STATIC_DIR), name="expo-static")


@app.get("/favicon.ico")
async def favicon():
    return FileResponse(os.path.join(WEB_BUILD_DIR, "favicon.ico"))


@app.get("/")
async def serve_app():
    return FileResponse(os.path.join(WEB_BUILD_DIR, "index.html"))


@app.get("/ping", tags=["General"])
async def ping() -> Dict[str, str]:
    """A simple ping endpoint to check if the server is responsive."""
    return {"status": "ok", "message": "pong"}
