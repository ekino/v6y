ARG NODE_VERSION=22-alpine
FROM node:${NODE_VERSION}

# Create app directory
WORKDIR /app

# Copy everything from the source path
COPY . .

# Install pnpm
RUN npm i -g pnpm@9.1.3

# Install app dependencies
RUN pnpm install

# Build the app
RUN pnpm run build

# Serve the apps
CMD ["pnpm", "start"]
