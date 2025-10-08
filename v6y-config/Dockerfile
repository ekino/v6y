ARG NODE_VERSION=22-alpine
ARG SERVICE_PATH=.
FROM node:${NODE_VERSION}

# Set working dir inside the image
WORKDIR /app

# Copy the service sources from the repository into the image
# SERVICE_PATH is a path relative to the build context (we'll set context to repo root in docker-compose)
COPY ${SERVICE_PATH} .

# Install pnpm globally
RUN npm i -g pnpm@9.1.3

# Install app dependencies and build
RUN pnpm install
RUN pnpm run build

# Default command
CMD ["pnpm", "start"]
