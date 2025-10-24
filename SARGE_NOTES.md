# Sarge Notes

Lockfiles MUST also be pushed when installing dependencies

1. Run next app locally - DB is in container
    - we are required to add the DATABASE_URL environment variable
    - BUT the containerized postgres instance is still required
        - `docker compose up db`
        - `pnpm install`
        - `npm run dev`

2. Run containerized web app + DB
    - `docker compose up`

# Changing Environments

- If app running, run `docker compose down -v`
- Navigate to `.env`
- Comment the variables you are currently using
- Uncomment the variables of the environment you want to use.
- Run

# Setting up ECR

```sh
AWS_REGION=us-east-2
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# create (once)
aws ecr create-repository --repository-name sarge-app --region $AWS_REGION

# auth docker to ECR
aws ecr get-login-password --region $AWS_REGION \
| docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# build, tag, push
docker build -t sarge:latest .
docker tag sarge:latest $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/sarge:latest
docker push $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/sarge:latest
```

Our production database will be managed by AWS Secrets Manager. Staging will be managed by the team so we can drop in and replace it.

postgresql://postgres:]v<~G(kaOj5F1bwVD:DDV>DIMq~X@sarge-db-prod.cbamu0sy0arw.us-east-2.rds.amazonaws.com:5432/sarge-db-prod

docker buildx build --platform linux/amd64 -t $ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/sarge:latest --push .

                         (optional)

Internet ──► [Route53 DNS] ─────────────┐
▼
SG: allow 80 (and 443) from anywhere
┌───────────────────────────────────────────┐
│ Internet-facing ALB │
│ Listeners: │
│ 80: Forward → TG: web-3000 │
│ 443: (later) TLS → TG: web-3000 │
└───────────────────────────────────────────┘
│ forwards HTTP
▼
┌────────────────────────────┐
│ Target Group (type: IP) │
│ Protocol: HTTP Port: 3000│
│ Health check: GET / 200-399│
└────────────────────────────┘
│ registers task ENI IPs
(only ALB SG can reach 3000)
▼
┌────────────────────────────────────┐
│ ECS Tasks (Fargate) │
│ SG: Inbound 3000 FROM ALB SG only │
│ App listens on 0.0.0.0:3000 │
└────────────────────────────────────┘
│ outbound (pull image, logs, APIs)
via Public IP (public subnet) or via NAT (private subnet)
