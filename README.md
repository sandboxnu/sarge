# Sarge

### Requirements:

- PNPM
- Docker

### Running in Dev Mode:

Add the following env variables to a .env file:

```
DB_USER="postgres"
DB_PASSWORD="password"
DB_NAME="sarge"

DEV_DATABASE=postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}
```

Run the following commands in order

- `pnpm install`
- `pnpm run dev`
- Once you are finished run `docker-compose down`

