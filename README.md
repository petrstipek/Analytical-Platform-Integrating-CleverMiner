# Analytical Platform Integrating CleverMiner

## Docker Setup

The entire application can be run locally using Docker Compose with a single command.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed

### First-time setup

1. Start everything:
   ```bash
   docker compose up -d
   ```

This will start:
- **PostgreSQL** database on port `5432`
- **Redis** on port `6379`
- **Django backend** on port `8000`
- **Celery worker** (no port, connects to Redis + PostgreSQL)
- **React frontend** on port `3000`

### Accessing the application

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000        |
| Backend API | http://localhost:8000/api |
| API Docs | http://localhost:8000/api/docs/ |

### Common commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View logs (all services)
docker compose logs -f

# View logs for a specific service
docker compose logs -f backend
docker compose logs -f worker

# Run Django management commands
docker compose exec backend uv run python manage.py createsuperuser
```

### Stopping and cleaning up

```bash
# Stop containers (keeps data)
docker compose down

# Stop and remove all data (fresh start)
docker compose down -v
```
