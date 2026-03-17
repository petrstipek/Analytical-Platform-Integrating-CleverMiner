---
sidebar_position: 3
---

# Installation for End Users

This is the simplest way to get the platform running. No source code download or build step is required — pre-built images are pulled directly from Docker Hub.

## Prerequisites

- [Docker Desktop](https://docs.docker.com/get-docker/) installed and running

## Setup

**1. Download the compose file:**

```bash
curl -O https://raw.githubusercontent.com/petrstipek/Analytical-Platform-Integrating-CleverMiner/main/docker-compose.hub.yml
```

Or manually download `docker-compose.hub.yml` from the [repository](https://github.com/petrstipek/Analytical-Platform-Integrating-CleverMiner).

**2. Start the application:**

```bash
docker compose -f docker-compose.hub.yml up -d
```

Docker will automatically pull all pre-built images from Docker Hub and start the platform.

**3. Open [http://localhost:3000](http://localhost:3000), register and log in.**

## Common Commands

```bash
# Start the platform
docker compose -f docker-compose.hub.yml up -d

# Stop the platform
docker compose -f docker-compose.hub.yml down

# Stop and remove all data (fresh start)
docker compose -f docker-compose.hub.yml down -v

# View logs
docker compose -f docker-compose.hub.yml logs -f
```

:::tip Hosted version
If you prefer not to run anything locally, a publicly accessible hosted version of the platform is also available — no installation required.
:::