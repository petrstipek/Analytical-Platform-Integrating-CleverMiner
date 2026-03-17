---
sidebar_position: 1
---

# Deployment Overview

The platform supports multiple deployment options to accommodate different types of users — from non-technical end users to developers building on top of the platform.

All deployment approaches are based on **Docker**, which bundles everything the application needs into isolated containers that run independently of the host machine. The platform consists of five services orchestrated together via Docker Compose:

- **PostgreSQL** — relational database
- **Redis** — message broker for background tasks
- **Django backend** — REST API server
- **Celery worker** — background task processing
- **React frontend** — browser-based UI

## Deployment Options

| Option | Best for | Requires source code? |
|---|---|---|
| [Docker Setup with Repository Code](./docker-repository) | Developers & advanced users | ✅ Yes |
| [Installation for End Users](./end-users) | Non-technical users | ❌ No |
| [Developer Local Setup](./developer-local) | Active development | ✅ Yes |
| [Cloud Deployment](./cloud) | Hosted / production use | Optional |

## Authentication

User authentication is handled through a standard **register and login flow** — no third-party integrations or additional configuration required. This works out of the box in all deployment modes.

## Choosing the Right Option

- If you just want to **try the platform** without downloading any code → use [Installation for End Users](./end-users)
- If you want to **run it from source** → use [Docker Setup with Repository Code](./docker-repository)
- If you want to **develop or extend** the platform → use [Developer Local Setup](./developer-local)
- If you want to **host it publicly** → use [Cloud Deployment](./cloud)