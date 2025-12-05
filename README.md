# Sarge

### Requirements:

- [PNPM](https://pnpm.io/installation)
- [Docker](https://docs.docker.com/desktop/)

### Running in Dev Mode:

Add the following env variables to a .env file:

```
DB_USER="postgres"
DB_PASSWORD="password"
DB_NAME="sarge"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_SECRET_NAME=
AWS_BUCKET_NAME=

JWT_SECRET="sarge"
NEXT_PUBLIC_CDN_BASE=
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}
```

Run the following commands in order

- Run `./start.sh`
