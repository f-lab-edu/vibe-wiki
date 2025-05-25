# Contributing to Vibe Wiki

First off, thank you for considering contributing to Vibe Wiki! We welcome any help to make this project better.

## How to Contribute

* **Reporting Bugs**: If you find a bug, please open an issue on GitHub. Include a clear title, a detailed description of the issue, steps to reproduce it, and the expected behavior.
* **Suggesting Enhancements**: If you have an idea for a new feature or an improvement to an existing one, please open an issue to discuss it. This allows us to coordinate efforts and ensure the suggestion aligns with the project's goals.
* **Pull Requests**: If you want to contribute code, please fork the repository and submit a pull request.

## Development Setup

1.  **Fork & Clone**: Fork the repository on GitHub and clone your fork locally:
    ```bash
    git clone [https://github.com/YOUR_USERNAME/vibe-wiki.git](https://github.com/YOUR_USERNAME/vibe-wiki.git)
    cd vibe-wiki
    ```

2.  **Install `uv`**: Ensure you have `uv` installed. Instructions are in the `README.md`.

3.  **Set Up Environment & Dependencies**:
    ```bash
    # Create a virtual environment (recommended)
    python -m venv .venv
    source .venv/bin/activate  # On Windows: .venv\Scripts\activate

    # Install dependencies using uv
    uv pip install -r requirements.txt
    ```

4.  **Install Pre-commit Hooks**:
    This project uses pre-commit hooks to ensure code quality before commits.
    ```bash
    pip install pre-commit # If not already installed, or uv pip install pre-commit
    pre-commit install
    ```
    Now, the hooks will run automatically before each commit.

## Coding Standards

To maintain code quality and consistency, please adhere to the following:

* **Formatting**: We use `Ruff Formatter` and `isort` for code formatting. The pre-commit hooks will automatically format your code. You can also run them manually:
    ```bash
    ruff format .
    isort .
    ```
* **Linting**: We use `Ruff` for linting. Ensure your code has no linting errors:
    ```bash
    ruff check .
    ```
* **Type Checking**: We use `Mypy` for static type checking. All code should pass Mypy checks:
    ```bash
    mypy src/ tests/
    ```
* **Python Style**: Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) for Python code. Write clear, readable, and well-documented code.

## Testing

* All new features should include corresponding tests.
* All bug fixes should include a test that reproduces the bug and verifies the fix.
* Run tests using `pytest`:
    ```bash
    pytest tests/
    ```
* Ensure your changes meet the test coverage requirement (currently ≥85%):
    ```bash
    pytest tests/ --cov=src --cov-fail-under=85
    ```

## Pull Request Process

1.  Ensure your development environment is set up and all dependencies are installed.
2.  Make your changes in a new branch based on the `develop` (or `main`) branch.
3.  Ensure all pre-commit checks pass.
4.  Write clear, concise commit messages.
5.  Ensure all tests pass and meet the coverage requirements.
6.  Push your changes to your fork and open a pull request to the `develop` (or `main`) branch of the upstream repository.
7.  Provide a clear description of your changes in the pull request. Link to any relevant issues.
8.  Be prepared to address any feedback or requested changes during the review process.

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms. (You might want to add a `CODE_OF_CONDUCT.md` file, e.g., based on the [Contributor Covenant](https://www.contributor-covenant.org/)).

Thank you for your contribution!
