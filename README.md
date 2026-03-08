# Analytical Platform Integrating CleverMiner

## Quick Start (End Users)

No source code needed — just Docker.

**1. Download the compose file:**
```bash
curl -O https://raw.githubusercontent.com/petrstipek/cleverminer-application/main/docker-compose.hub.yml
```

**2. Start the application:**
```bash
docker compose -f docker-compose.hub.yml up -d
```

**4. Open http://localhost:3000**

### Prerequisites
- [Docker Desktop](https://docs.docker.com/get-docker/) installed and running (Windows, Mac, or Linux)

### Common commands
```bash
# Start all services
docker compose -f docker-compose.hub.yml up -d

# Stop all services
docker compose -f docker-compose.hub.yml down

# View logs
docker compose -f docker-compose.hub.yml logs -f

# Stop and remove all data (fresh start)
docker compose -f docker-compose.hub.yml down -v
```
---

## Docker Setup (Developers)

Run the full application locally from source using Docker Compose.

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed
- Repository cloned

### First-time setup

```bash
docker compose up -d
```

This will start:
- **PostgreSQL** database on port `5432`
- **Redis** on port `6379`
- **Django backend** on port `8000`
- **Celery worker** (no port, connects to Redis + PostgreSQL)
- **React frontend** on port `3000`

### Create your first user

```bash
docker compose exec backend uv run python manage.py createsuperuser
```

### Accessing the application

| Service     | URL                                          |
|-------------|----------------------------------------------|
| Frontend    | http://localhost:3000                        |
| Backend API | http://localhost:8000/api                    |
| API Docs    | http://localhost:8000/api/docs |

### Common commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# Rebuild after code changes
docker compose up -d --build

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
