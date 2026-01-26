# AWS Setup (High-Level)

High-level checklist for production hosting. No IaC included yet.

## Suggested Services

- **RDS Postgres** for database (or Supabase if you prefer managed features).
- **ECS/Fargate** or **App Runner** for API hosting.
- **S3 + CloudFront** for frontend static hosting (Vite build).
- **Secrets Manager** for DB/JWT secrets.

## Suggested Flow

1) Create RDS Postgres and note the connection string.
2) Store DB creds and JWT signing key in Secrets Manager.
3) Build and push API image to ECR.
4) Deploy API to ECS/Fargate or App Runner.
5) Build Vite app and deploy to S3 + CloudFront.
6) Set `VITE_API_URL` to the API public URL.
