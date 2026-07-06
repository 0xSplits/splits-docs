FROM node:22-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM base AS runtime
WORKDIR /app
COPY --from=build /app /app
ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080
CMD ["pnpm", "start"]
