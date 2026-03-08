GAMIFIED LEARNING PLATFORM

## Production with Docker Compose

1. Create an env file from the template:

```bash
cp .env.production.example .env.production
```

2. Update `.env.production` values (at minimum `JWT_SECRET` and `MONGO_ROOT_PASSWORD`).

3. Build and start all services:

```bash
docker compose --env-file .env.production up -d --build
```

4. Open the app:

```text
http://localhost:8080
```

## Services

- `frontend` (Nginx): serves built React app and proxies `/api` to backend
- `backend` (Node/Express): API service on internal port `4000`
- `mongo` (MongoDB): persistent database with volume `mongo_data`

## Useful Commands

```bash
# View logs
docker compose --env-file .env.production logs -f

# Stop services
docker compose --env-file .env.production down

# Stop + remove volumes (deletes database data)
docker compose --env-file .env.production down -v
```
