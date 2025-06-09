# Vibe Wiki Server

FastAPI backend server for the Vibe Wiki application.

## Features

- RESTful API endpoints for note management
- Handwriting recognition processing
- Diagram conversion services
- Static file serving for web application

## Tech Stack

- Python 3.8+
- FastAPI
- Uvicorn ASGI server
- Ruff for linting

## Development Setup

1. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start development server:
```bash
uvicorn src.main:app --reload
```

## Project Structure

```
server/
├── src/
│   ├── main.py           # FastAPI application and routes
│   └── __init__.py       # Package initialization
├── tests/                # Test files
├── requirements.txt      # Python dependencies
└── pyproject.toml       # Project configuration
```

## API Documentation

When the server is running, visit:
- Swagger UI: http://{HOST}:{PORT}/docs
- ReDoc: http://{HOST}:{PORT}/redoc

## Available Endpoints

- `GET /`: Welcome message
- `GET /ping`: Health check endpoint

More endpoints will be added as development progresses.

## Testing

Run tests with:
```bash
pytest
```
