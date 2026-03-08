FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

WORKDIR /app

# Copy dependency files first (for layer caching)
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --locked --no-dev --no-install-project

# Copy project
COPY . .

EXPOSE 8000

CMD uv run python manage.py migrate && \
    uv run python -m gunicorn --bind 0.0.0.0:8000 --timeout 120 --workers 3 config.wsgi:application
