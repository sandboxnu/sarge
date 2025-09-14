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

DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}
```

Run the following commands in order

- Run `./start.sh`
- Once you are finished run `docker-compose down`
