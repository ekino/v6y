FROM node:22-alpine

# Create app directory
WORKDIR /app

# This will copy everything from the source path
# --more of a convenience when testing locally.
COPY . .

# Install pnpm
RUN npm i -g pnpm@9.1.3

# Install app dependencies
RUN pnpm install

# Build the app
RUN pnpm run build

# Serve the apps
CMD ["pnpm", "start"]

