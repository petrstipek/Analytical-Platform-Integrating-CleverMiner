---
sidebar_position: 4
---

# Developer Local Setup

This setup is intended for developers who want to actively work on or extend the platform. Each service is run separately, allowing you to make changes and iterate quickly without rebuilding Docker images.

The platform is distributed under the **MIT licence**, so you are free to build upon and extend it.

## Frontend

The frontend is a React + TypeScript application. Start it in development mode with:

```bash
npm run dev
```

Make sure the `VITE_BACKEND_URL` environment variable is set to point at your running backend instance, for example:

```
VITE_BACKEND_URL=http://localhost:8000
```

## Backend

The backend is a Django application managed with [uv](https://github.com/astral-sh/uv). Start the development server with:

```bash
uv run python manage.py runserver
```

This command installs dependencies from `pyproject.toml` and `uv.lock` before launching the server. Key configuration notes:

- **`ALLOWED_HOSTS`** in `settings.py` should include your frontend URL
- By default, **SQLite** is used as the local database. If a `DATABASE_URL` environment variable is provided, the application connects to that instead
- **S3 storage** support can be enabled by uncommenting the relevant section in `settings.py` and filling in the variables from `.env.example`

## Redis

On macOS, Redis can be managed via Homebrew:

```bash
brew services start redis
brew services stop redis
```

On other platforms, refer to the [official Redis documentation](https://redis.io/docs/getting-started/).

## Celery Worker

Celery handles background task processing. Start a worker with:

```bash
celery -A config worker -l INFO
```

Celery automatically discovers tasks from the apps listed in `INSTALLED_APPS` in `settings.py`. The Redis broker URL defaults to `redis://localhost:6379/0` if no `REDIS_URL` environment variable is set.

### Flower Monitoring (Optional)

You can start the Flower monitoring interface to inspect task queues and worker status:

```bash
celery -A config flower --port=5555
```

Flower will be accessible at [http://localhost:5555](http://localhost:5555).

## Services Summary

| Service | Command | Default URL |
|---|---|---|
| Frontend | `npm run dev` | http://localhost:5173 |
| Backend | `uv run python manage.py runserver` | http://localhost:8000 |
| Redis | `brew services start redis` | localhost:6379 |
| Celery | `celery -A config worker -l INFO` | — |
| Flower | `celery -A config flower --port=5555` | http://localhost:5555 |