# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.js file.
# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:22.22.0-alpine AS base

FROM base AS base_with_env
ARG NODE_ENV
ARG APP_PORT
ARG PAYLOAD_SECRET
ARG PAYLOAD_DATABASE_URI
ARG NEXT_PUBLIC_SERVER_URL
ARG PREVIEW_SECRET
ARG PAYLOAD_PUBLIC_ASSETS_PATH
ARG PAYLOAD_MAILER_FROM
ARG PAYLOAD_MAILER_NAME
ARG NODE_MAILER_SMTP_HOST
ARG NODE_MAILER_SMTP_PORT
ARG NODE_MAILER_SMTP_USER
ARG NODE_MAILER_SMTP_PWD
ARG NODE_MAILER_SMTP_SECURE
ARG NEXT_PUBLIC_META_NAME
ARG NEXT_PUBLIC_META_TITLE
ARG NEXT_PUBLIC_META_DESCRIPTION
ARG NEXT_PUBLIC_META_TYPE

ENV NODE_ENV=production
ENV APP_PORT=3000
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
ENV PAYLOAD_DATABASE_URI=${PAYLOAD_DATABASE_URI}
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ENV PREVIEW_SECRET=${PREVIEW_SECRET}
ENV PAYLOAD_PUBLIC_ASSETS_PATH=${PAYLOAD_PUBLIC_ASSETS_PATH}
ENV PAYLOAD_MAILER_FROM=${PAYLOAD_MAILER_FROM}
ENV PAYLOAD_MAILER_NAME=${PAYLOAD_MAILER_NAME}
ENV NODE_MAILER_SMTP_HOST=${NODE_MAILER_SMTP_HOST}
ENV NODE_MAILER_SMTP_PORT=${NODE_MAILER_SMTP_PORT}
ENV NODE_MAILER_SMTP_USER=${NODE_MAILER_SMTP_USER}
ENV NODE_MAILER_SMTP_PWD=${NODE_MAILER_SMTP_PWD}
ENV NODE_MAILER_SMTP_SECURE=${NODE_MAILER_SMTP_SECURE}
ENV NEXT_PUBLIC_META_NAME=${NEXT_PUBLIC_META_NAME}
ENV NEXT_PUBLIC_META_TITLE=${NEXT_PUBLIC_META_TITLE}
ENV NEXT_PUBLIC_META_DESCRIPTION=${NEXT_PUBLIC_META_DESCRIPTION}
ENV NEXT_PUBLIC_META_TYPE=${NEXT_PUBLIC_META_TYPE}

# Install corepack globally to prevent error "Cannot find matching keyid (corepack.cjs)"
RUN npm install -g corepack@latest

# Install dependencies only when needed
FROM base_with_env AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi


# Rebuild the source code only when needed
FROM base_with_env AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

# RUN env

RUN \
  if [ -f yarn.lock ]; then yarn run build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

# Set timezone
ENV TZ=Europe/Berlin
RUN date

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Remove this line if you do not have this folder
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD HOSTNAME="0.0.0.0" node server.js
