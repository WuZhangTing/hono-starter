FROM oven/bun:1.2.19-alpine AS base

ARG PROJECT_DIR

ENV APP_PORT=3001

WORKDIR $PROJECT_DIR
COPY package.json pnpm-lock.yaml* bun.lockb* ./
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo 'Asia/Shanghai' > /etc/timezone

FROM base AS prod-deps
RUN bun install --prod --frozen-lockfile

FROM base AS build
COPY . .
RUN bun install --frozen-lockfile
RUN bun run build

FROM oven/bun:1.2.19-alpine AS runtime
ARG PROJECT_DIR
WORKDIR $PROJECT_DIR

# # Create logs directory
RUN mkdir -p logs

# Copy dependencies and built application
COPY --from=prod-deps $PROJECT_DIR/node_modules ./node_modules
COPY --from=build $PROJECT_DIR/dist ./dist
COPY --from=build $PROJECT_DIR/src/db/migrations ./src/db/migrations
COPY --from=build $PROJECT_DIR/drizzle.config.ts ./
COPY --from=build $PROJECT_DIR/src/env.ts ./src
COPY package.json ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S hono -u 1001
RUN chown -R hono:nodejs $PROJECT_DIR
USER hono

EXPOSE $APP_PORT
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun --version || exit 1

CMD ["sh", "-c", "bun run migrate:prod && bun run dist/index.js"]