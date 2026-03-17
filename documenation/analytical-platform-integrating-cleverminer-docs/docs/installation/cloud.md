---
sidebar_position: 5
---

# Cloud Deployment

The platform can be deployed to cloud infrastructure for publicly accessible, hosted use. This section walks through deploying each service individually using [Railway](https://railway.com/) as the cloud provider, though the same principles apply to other platforms.

## Architecture

Compared to the local setup, the cloud deployment adds an **S3 bucket** for dataset storage, replacing the local media volume. The rest of the services remain the same: PostgreSQL, Redis, Django backend, Celery worker, and the React frontend.

## Services Configuration

### Backend & Celery Worker

Both the backend and Celery worker require the same environment variables as in the local setup, plus the additional Redis and S3 credentials provided by the cloud environment:

| Variable | Description |
|---|---|
| `SECRET_KEY` | Django secret key |
| `DATABASE_URL` | PostgreSQL connection URL |
| `REDIS_URL` | Redis connection URL (provided by Railway's Redis service) |
| `AWS_ACCESS_KEY_ID` | S3 access key |
| `AWS_SECRET_ACCESS_KEY` | S3 secret key |
| `AWS_STORAGE_BUCKET_NAME` | S3 bucket name |

### Frontend

The frontend only requires one variable:

| Variable | Description |
|---|---|
| `VITE_BACKEND_URL` | URL of the deployed backend service |

### Custom Domain

Railway supports custom domains with automatic SSL certificate provisioning. To use your own domain, add a **CNAME record** in your domain registrar pointing to the Railway-assigned subdomain. If no custom domain is configured, the app remains accessible under the auto-generated Railway URL.

## CI/CD with GitHub

Railway integrates directly with GitHub. Developers who fork the repository can connect it to their Railway project to enable **automatic redeployment** on every push to the target branch — no manual redeploy steps needed.

:::info S3 configuration
To enable S3 storage in the backend, uncomment the S3 section in `settings.py` and ensure all required environment variables are set as described in `.env.example`.
:::