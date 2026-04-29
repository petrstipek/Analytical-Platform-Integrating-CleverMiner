# Analytical Platform Integrating CleverMiner

A full-stack web application for exploratory data mining and rule discovery, built on top of the [CleverMiner](https://cleverminer.org) library. The platform lets analysts upload datasets, configure and run association rule mining tasks using multiple procedures, and explore the discovered rules interactively — without writing any code.
 
## What it does
 
CleverMiner Analytical Platform provides an end-to-end workflow for data mining:
 
- **Dataset management** — upload CSV datasets, explore column statistics, receive CleverMiner guidance on which columns are usable as-is, and apply preprocessing transformations (binning, filling missing values, dropping columns) to create derived datasets.
- **Task configuration** — define mining tasks through a guided wizard. Select a procedure, configure antecedent/succedent/condition cedents using available dataset columns, and set quantifier thresholds that control which rules are interesting enough to surface.
- **Mining execution** — tasks are executed asynchronously via Celery workers. Results are stored and can be re-explored at any time.
- **Results exploration** — discovered rules are displayed in an interactive panel per procedure. Each rule shows its logical structure, quantifier metrics, fourfold tables, confidence comparisons, and optionally a CleverMiner-generated chart.
- **Project collaboration** — datasets and tasks can be organized into projects and shared with other users.
## Supported mining procedures
 
| Procedure | Description |
|-----------|-------------|
| **4ft Miner** | Classic association rule mining (Antecedent → Succedent) |
| **SD4ft Miner** | Subgroup discovery — compares rule behaviour across two groups |
| **CF Miner** | Conditional frequency — finds rules with interesting histogram patterns over an ordinal target |
| **UIC Miner** | User-defined interestingness — rules scored against category weights |
 
## Technology stack
 
- **Backend** — Django, Django REST Framework, Celery, Redis, PyArrow, pandas
- **Frontend** — React, TypeScript, TanStack Query, TanStack Table, Recharts, Shadcn/Tailwind, Axios
- **Storage** — local filesystem (development) or S3-compatible storage (production)
- **Infrastructure** — Docker, PostgreSQL, Gunicorn
---

## Quick Start (End Users)

No source code needed — just Docker.
This setup will create both backend and frontend on your local machine.
Backend is available on localhost:8000 and frontend on localhost:3000.

**1. Download the compose file:**
```bash
curl -O https://raw.githubusercontent.com/petrstipek/cleverminer-application/main/docker-compose.hub.yml
```

Or directly download the docker-compose.hub.yml file.

**2. Start the application:**
```bash
docker compose -f docker-compose.hub.yml up -d
```

**3. Open http://localhost:3000 register and login.**

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
