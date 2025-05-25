from fastapi.testclient import TestClient


def test_read_root(mock_client: TestClient) -> None:
    response = mock_client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Vibe Wiki!"}


def test_ping(mock_client: TestClient) -> None:
    response = mock_client.get("/ping")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "pong"}
