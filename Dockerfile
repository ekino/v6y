FROM node:22-alpine

LABEL authors="Vitality Team"

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

# Expose the ports of the apps run on
EXPOSE 4007
EXPOSE 4005
EXPOSE 4001
EXPOSE 4002
EXPOSE 4003
EXPOSE 4004

# Serve the apps
CMD ["pnpm", "start"]

