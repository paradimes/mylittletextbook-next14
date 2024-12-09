# Docker Deployment Guide

## Prerequisites

1. Docker and Docker Compose installed
2. Node.js and npm installed (for running Prisma migrations)
3. Environment files set up (see Environment Setup below)

## Environment Setup

1. Copy the example environment files:

```bash
cp .env.example .env
cp my-app/.env.example my-app/.env
```

2. Update both `.env` files with your actual credentials and configuration.

## Deployment Steps

### 1. Start PostgreSQL Container

First, start only the PostgreSQL container:

```bash
docker compose -f compose.prod.yaml up -d postgres
```

### 2. Run Database Migrations

Change to the Next.js app directory and run Prisma migrations:

```bash
cd my-app
npx prisma migrate deploy
```

Note: The migrations will work because your local `DATABASE_URL` in `my-app/.env` points to `localhost:5433`, which maps to the PostgreSQL container's `5432` port.

### 3. Start Next.js Application

Return to the root directory and start the remaining services:

```bash
cd ..
docker compose -f compose.prod.yaml up --build -d
```

## Useful Commands

### View Logs

```bash
# View logs for all services
docker compose -f compose.prod.yaml logs

# View logs for specific service
docker compose -f compose.prod.yaml logs next-app
```

### Stop Services

```bash
# Stop all services
docker compose -f compose.prod.yaml down

# Stop all services and remove volumes
docker compose -f compose.prod.yaml down -v
```

### Rebuild Application

If you've made changes to the application:

```bash
docker compose -f compose.prod.yaml up --build -d next-app
```

## Troubleshooting

### Database Connection Issues

- Ensure PostgreSQL container is running: `docker ps`
- Check PostgreSQL logs: `docker compose -f compose.prod.yaml logs postgres`
- Verify DATABASE_URL in both `.env` files:
  - Root `.env`: Should use `postgres` as host
  - `my-app/.env`: Should use `localhost` for migrations

### Next.js Application Issues

- Check application logs: `docker compose -f compose.prod.yaml logs next-app`
- Verify all environment variables are properly set
- Ensure port 3001 is not in use by another service

## Cloud Deployment

To deploy to a cloud provider:

1. Build the image for your target platform:

```bash
docker build --platform=linux/amd64 -t your-registry.com/mylittletextbook ./my-app -f my-app/prod.Dockerfile
```

2. Push to your registry:

```bash
docker push your-registry.com/mylittletextbook
```

Remember to:

- Update NEXTAUTH_URL to your production domain
- Set up proper database credentials
- Configure Auth0 for your production environment
