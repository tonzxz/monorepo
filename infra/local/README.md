# Local Postgres (Docker)

Local Postgres instance for development.

## Files

```
infra/local/
  docker-compose.yml   # Postgres container definition
```

## Usage

```
docker compose up -d
```

Default connection string:

```
postgresql://postgres:postgres@localhost:5432/psms?schema=public
```
