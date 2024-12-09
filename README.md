# mylittletextbook-next14

## Environment Setup

1. Copy the example environment files:

```bash
cp .env.example .env
cp my-app/.env.example my-app/.env
```

2. Update the environment variables in both `.env` files:

Root `.env`:

- Used by Docker Compose for production deployment
- Configure Auth0, Gemini API, and database credentials
- Database URL should use `postgres` as host (Docker service name)

my-app/.env:

- Used for local development
- Configure Auth0, Gemini API, and database credentials
- Database URL should use `localhost` as host

### Required Environment Variables

- `AUTH_AUTH0_ID`: Your Auth0 application client ID
- `AUTH_AUTH0_SECRET`: Your Auth0 application client secret
- `AUTH_AUTH0_ISSUER`: Your Auth0 domain
- `NEXTAUTH_URL`: Your application URL
- `NEXTAUTH_SECRET`: A secure random string for NextAuth.js
- `GEMINI_API_KEY`: Your Google Gemini API key
- `DATABASE_URL`: PostgreSQL connection string
