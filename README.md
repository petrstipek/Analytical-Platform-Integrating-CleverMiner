# Analytical Platform Integrating CleverMiner

A full-stack web application for exploratory data mining and rule discovery, built on top of the [CleverMiner](https://cleverminer.org) library. The platform lets analysts upload datasets, configure and run association rule mining tasks using multiple procedures, and explore the discovered rules interactively, without writing any code.
 
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
| **4ft-Miner** | Classic association rule mining (Antecedent → Succedent) |
| **SD4ft-Miner** | Subgroup discovery — compares rule behaviour across two groups |
| **CF-Miner** | Conditional frequency — finds rules with interesting histogram patterns over an ordinal target |
| **UIC-Miner** | User-defined interestingness — rules scored against category weights |
 
## Technology stack
 
- **Backend** — Django, Django REST Framework, Celery, Redis, PyArrow, pandas
- **Frontend** — React, TypeScript, TanStack Query, TanStack Table, Recharts, Shadcn/Tailwind, Axios
- **Storage** — local filesystem (development) or S3-compatible storage (production)
- **Infrastructure** — Docker, PostgreSQL, Gunicorn

## Documentation 

There is a publicly available documentation at [Analytical Platform Documentation](https://cleverminer-docs.stipekdevs.cz/docs/platform-introduction).

---

## Quick Start (End Users)

No source code needed — just Docker.
This setup will create both backend and frontend on your local machine.
Backend is available on localhost:8000 and frontend on localhost:3000.

### Prerequisites
- [Docker Desktop](https://docs.docker.com/get-docker/) installed and running (Windows, Mac, or Linux)
- It is recommended to set up Docker with at least 8GB of available RAM memory, 12GB should be the most optimal.
- The reason is that during heavy computations, workers can load the entire dataset into memory, which can cause memory exhaustion and a subsequent SIGKILL from the OS, resulting in task failure. For more information, see the Resource Configuration and Troubleshooting sections.

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
- It is recommended to set up Docker with at least 8GB of available RAM memory, 12GB should be the most optimal.
- The reason is that during heavy computations, workers can load the entire dataset into memory, which can cause memory exhaustion and a subsequent SIGKILL from the OS, resulting in task failure. For more information, see the Resource Configuration and Troubleshooting sections.
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

More information can be found in the Platform Documentation at [Platform Setup](https://cleverminer-docs.stipekdevs.cz/docs/category/installation-and-deployment)

---

## Resource Configuration

The default Docker deployment (`docker-compose.hub.yml` and `docker-compose.yml`) is configured for machines with at least 8GB of RAM:

| Setting | Value | Description |
|---------|-------|-------------|
| Celery concurrency | `2` | Max simultaneous mining/transformation tasks |
| Max tasks per child | `5` | Worker process is recycled after this many tasks |

To adjust, update the `command` field of the `worker` service in `docker-compose.hub.yml`:

```yaml
worker:
  command: uv run python -m celery -A config worker --loglevel=info --concurrency=2 --max-tasks-per-child=5
```

For machines with more resources, `--concurrency=4 --max-tasks-per-child=10` is a reasonable starting point.

## Troubleshooting

### Celery worker crashes with `signal 9 (SIGKILL)`

**Symptom:** Tasks fail with `WorkerLostError: Worker exited prematurely: signal 9 (SIGKILL)` in worker logs.

**Cause:** The Linux OOM (out-of-memory) killer is terminating the worker process. Mining and transformation tasks can load entire datasets into memory via pandas/PyArrow, which can spike to several gigabytes. With the default Celery concurrency (equal to CPU count), multiple workers can spike simultaneously and exhaust available RAM.

**Fix:** Limit worker concurrency in `docker-compose.hub.yml`:
```yaml
worker:
  command: uv run python -m celery -A config worker --loglevel=info --concurrency=2 --max-tasks-per-child=5
```

- `--concurrency=2` — caps simultaneous tasks to 2, preventing multiple memory spikes at once
- `--max-tasks-per-child=5` — recycles each worker process after 5 tasks, releasing retained memory back to the OS

### Backend memory grows over time and never releases

**Symptom:** `docker stats` shows backend memory climbing after processing datasets and never dropping, even when idle.

**Cause:** Python's memory allocator retains freed memory arenas rather than returning them to the OS. This is expected behavior, not a leak — but it means each gunicorn worker permanently holds the peak memory it ever used.

**Fix:** Add `--max-requests` to your gunicorn startup so workers recycle periodically:
```bash
gunicorn --workers 3 --max-requests 50 --max-requests-jitter 10 ...
```

Workers restart after 50 requests, releasing all retained memory.

### Checking memory usage

To monitor container memory in real time:
```bash
docker stats
```
