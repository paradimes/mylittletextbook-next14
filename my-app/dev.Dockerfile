# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine

WORKDIR /app

# Install OpenSSL 1.1 and other required dependencies
RUN apk add --no-cache \
    openssl \
    openssl-dev \
    libc6-compat

# Install dependencies
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
COPY ./prisma prisma

RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
    else echo "Warning: Lockfile not found." && yarn install; \
    fi

# Copy project files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Environment variables for development
ARG GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ARG GOOGLE_CLIENT_SECRET
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=${GEMINI_API_KEY}
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# Start Next.js in development mode
CMD \
    if [ -f yarn.lock ]; then yarn dev; \
    elif [ -f package-lock.json ]; then npm run dev; \
    elif [ -f pnpm-lock.yaml ]; then pnpm dev; \
    else npm run dev; \
    fi