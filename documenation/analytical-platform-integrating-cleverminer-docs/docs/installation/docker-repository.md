---
sidebar_position: 2
---

# Docker Setup with Repository Code

This option lets you run the full platform locally by cloning the repository and using Docker Compose to build and start all services.

## Prerequisites

- [Docker Desktop](https://docs.docker.com/get-docker/) installed and running
- Repository cloned to your machine

## Starting the Platform

From the root of the repository, run:

```bash
docker compose up -d
```

Docker will pull the required base images (PostgreSQL, Redis), build the application images, and start all five services. Once running, you can verify the containers are active either through the **Docker Desktop** UI under the Containers tab, or via the terminal:

```bash
docker ps
```

## Accessing the Application

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api |
| API Docs | http://localhost:8000/api/docs |

## Stopping the Platform

```bash
# Stop containers but keep persisted data
docker compose down

# Stop containers and remove all data (fresh start)
docker compose down -v
```

## Creating a Superuser

To access the Django admin panel, create a superuser with:

```bash
docker compose exec backend uv run python manage.py createsuperuser
```

:::info No configuration needed
All environment variables are pre-configured inside `docker-compose.yml` for local use. You do not need to set up any `.env` files or secrets to get started.
:::