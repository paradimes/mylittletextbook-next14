# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy Prisma directory 
COPY ./prisma prisma

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
# Omit --production flag for TypeScript devDependencies
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
    # Allow install without lockfile, so example works even without Node.js installed locally
    else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
    fi

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .


# Environment variables must be present at build time
ARG AUTH_AUTH0_ID
ENV AUTH_AUTH0_ID=${AUTH_AUTH0_ID}
ARG AUTH_AUTH0_SECRET
ENV AUTH_AUTH0_SECRET=${AUTH_AUTH0_SECRET}
ARG AUTH_AUTH0_ISSUER
ENV AUTH_AUTH0_ISSUER=${AUTH_AUTH0_ISSUER}
ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG NEXT_PUBLIC_AUTH0_ISSUER
ENV NEXT_PUBLIC_AUTH0_ISSUER=${NEXT_PUBLIC_AUTH0_ISSUER}
ARG NEXT_PUBLIC_AUTH0_ID
ENV NEXT_PUBLIC_AUTH0_ID=${NEXT_PUBLIC_AUTH0_ID}
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}



# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN \
    if [ -f yarn.lock ]; then yarn run build; \
    elif [ -f package-lock.json ]; then npm run build; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
    else echo "Lockfile not found." && exit 1; \
    fi

# Generate Prisma client after build
RUN npx prisma generate


# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# I don't have a public directory
# COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Environment variables must be redefined at run time
ARG AUTH_AUTH0_ID
ENV AUTH_AUTH0_ID=${AUTH_AUTH0_ID}
ARG AUTH_AUTH0_SECRET
ENV AUTH_AUTH0_SECRET=${AUTH_AUTH0_SECRET}
ARG AUTH_AUTH0_ISSUER
ENV AUTH_AUTH0_ISSUER=${AUTH_AUTH0_ISSUER}
ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG NEXT_PUBLIC_AUTH0_ISSUER
ENV NEXT_PUBLIC_AUTH0_ISSUER=${NEXT_PUBLIC_AUTH0_ISSUER}
ARG NEXT_PUBLIC_AUTH0_ID
ENV NEXT_PUBLIC_AUTH0_ID=${NEXT_PUBLIC_AUTH0_ID}
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

USER nextjs

EXPOSE 3001

ENV PORT=3001

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]