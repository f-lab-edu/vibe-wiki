<h1 align="center">Vibe Wiki</h1>

<p align="center">Make your thoughts take shape. Vibe Wiki auto-generates the documents and diagrams you need from your handwritten notes and sketches.</p>

## Overview

Vibe Wiki is a smart note-taking application designed to transform your raw handwritten ideas into polished, structured documents and editable diagrams. Capture your thoughts naturally, and let Vibe Wiki handle the organization and conversion.

### Project Structure

```plaintext
vibe-wiki/
├── .github/
│   └── workflows/
│       └── ci.yml
├── .pre-commit-config.yaml
├── src/
│   └── vibe_wiki/
│       ├── __init__.py
│       └── main.py
├── tests/
│   ├── __init__.py
│   └── test_main.py
├── CONTRIBUTING.md
├── README.md
└── requirements.txt
```

## Getting Started

### Prerequisites

* Python 3.9+
* [uv](https://github.com/astral-sh/uv) (Python package installer and resolver)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/vibe-wiki.git](https://github.com/your-username/vibe-wiki.git)
    cd vibe-wiki/server
    ```

2.  **Install `uv` (if you haven't already):**
    ```bash
    # On macOS and Linux
    curl -LsSf [https://astral.sh/uv/install.sh](https://astral.sh/uv/install.sh) | sh
    # On Windows
    powershell -c "irm [https://astral.sh/uv/install.ps1](https://astral.sh/uv/install.ps1) | iex"
    ```
    Follow the instructions to add `uv` to your PATH.

3.  **Create a virtual environment (recommended) and install dependencies:**
    ```bash
    # Create a virtual environment (optional but recommended)
    python -m venv .venv
    source .venv/bin/activate # On Windows: .venv\Scripts\activate

    # Install dependencies using uv
    uv pip install -r requirements.txt
    ```
    If a `requirements-dev.txt` is available for development tools, you might use that:
    ```bash
    uv pip install -r requirements-dev.txt
    ```

## 🛠️ Core Stack & Dependencies

Vibe Wiki is built with Python and FastAPI. Here are some of the key dependencies:

| Category          | Dependency         | Purpose                                      |
|-------------------|--------------------|----------------------------------------------|
| Web Framework     | `fastapi`          | Building the API                             |
| ASGI Server       | `uvicorn[standard]`| Running the FastAPI application              |
| Package Management| `uv`               | Python packaging and resolution              |

**For Development Tools**

| Category          | Dependency         | Purpose                                      |
|-------------------|--------------------|----------------------------------------------|
| Testing           | `pytest`           | Running automated tests                      |
|                   | `pytest-cov`       | Test coverage reporting                      |
| Linting           | `ruff`             | Fast Python linter and formatter             |
| Type Checking     | `mypy`             | Static type checking                         |
| Import Sorting    | `isort`            | Sorting import statements                    |

*Note: The actual ML/Image processing dependencies will be detailed in `requirements.txt` based on the chosen models and techniques.*

## Code Quality & Standards

To maintain code quality, we use the following tools. Ensure these checks pass before committing code.

* **Formatting (Ruff & isort):**
    ```bash
    ruff format .
    isort .
    ```

* **Linting (Ruff):**
    ```bash
    ruff check .
    ```

* **Type Checking (Mypy):**
    ```bash
    mypy .
    ```

* **Running Tests (Pytest):**
    Ensure all tests pass and meet the coverage threshold.
    ```bash
    pytest tests/ --cov=. --cov-fail-under=85
    ```

These checks are also enforced by our CI pipeline.

## CI (Continuous Integration)

Our CI pipeline, powered by GitHub Actions, automatically runs these checks on every push and pull request to the main branches. This ensures:
* Code is correctly formatted and linted.
* Static type checks pass.
* All tests pass with a minimum coverage of 85%.

## Development Plan (High-Level)

* **Week 1**: Implement core note-taking functionality (input, storage).
* **Week 2-3**: Develop graph inference from hand-drawn sketches and export capabilities. This involves evaluating different model approaches (e.g., fine-tuning existing models, vision models + GNNs, or LLM-based solutions).
* **Week 4**: Implement conversion of handwritten notes into structured Wiki-style documents.

*Further details on model considerations and specific feature specifications will be maintained within the project's internal documentation.*

## 🤝 Contributing

Details on contributing, coding standards, and the development process will be provided in `CONTRIBUTING.md`. (This file would need to be created).

---

*This README is a starting point and will evolve as the project progresses.*
