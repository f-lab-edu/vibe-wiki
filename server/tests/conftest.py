from fastapi.testclient import TestClient
from pytest import fixture

from src.main import app


@fixture(scope="session")
def mock_client() -> TestClient:
    return TestClient(app)
