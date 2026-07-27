# Build definition for every published v6y image.
#
# Local build of everything:
#   docker buildx bake
# Single service:
#   docker buildx bake bff
# Tag and push to the registry (what CI does):
#   REGISTRY=ghcr.io/ekino/ IMAGE_TAGS="$(git rev-parse HEAD) latest" \
#     docker buildx bake --push

# Trailing slash included, e.g. "ghcr.io/ekino/". Empty builds local image names.
variable "REGISTRY" {
  default = ""
}

# Space-separated list; every image gets each of these tags.
variable "IMAGE_TAGS" {
  default = "latest"
}

variable "PLATFORMS" {
  default = "linux/amd64"
}

# Inlined into the browser bundle at build time, so it cannot be overridden by a
# container environment variable later on.
variable "NEXT_PUBLIC_V6Y_BFF_PATH" {
  default = ""
}

variable "SOURCE_COMMIT" {
  default = ""
}

function "tags" {
  params = [image]
  result = [for tag in split(" ", IMAGE_TAGS) : "${REGISTRY}${image}:${tag}"]
}

target "_common" {
  context    = "."
  dockerfile = "v6y-config/Dockerfile"
  platforms  = split(",", PLATFORMS)
  labels = {
    # This label is what makes GitHub attach the package to the repository, which
    # in turn exposes the repository README and licence on the package page.
    "org.opencontainers.image.source"   = "https://github.com/ekino/v6y"
    "org.opencontainers.image.url"      = "https://github.com/ekino/v6y"
    "org.opencontainers.image.licenses" = "MIT"
    "org.opencontainers.image.vendor"   = "ekino"
    "org.opencontainers.image.revision" = SOURCE_COMMIT
  }
}

target "_front_common" {
  inherits = ["_common"]
  args = {
    NEXT_PUBLIC_V6Y_BFF_PATH = NEXT_PUBLIC_V6Y_BFF_PATH
  }
}

group "default" {
  targets = [
    "migrate",
    "bff",
    "bfb-main-analyzer",
    "bfb-static-code-auditor",
    "bfb-url-dynamic-auditor",
    "bfb-devops-auditor",
    "frontend",
    "frontend-bo",
  ]
}

# Backends only: useful when iterating without paying for the Next builds.
group "backends" {
  targets = [
    "bff",
    "bfb-main-analyzer",
    "bfb-static-code-auditor",
    "bfb-url-dynamic-auditor",
    "bfb-devops-auditor",
  ]
}

target "migrate" {
  inherits = ["_common"]
  target   = "migrate"
  tags     = tags("v6y-migrate")
  labels = {
    "org.opencontainers.image.title"       = "v6y-migrate"
    "org.opencontainers.image.description" = "Applies the v6y Prisma migrations, then exits"
  }
}

target "bff" {
  inherits = ["_common"]
  target   = "bff"
  tags     = tags("v6y-bff")
  labels = {
    "org.opencontainers.image.title"       = "v6y-bff"
    "org.opencontainers.image.description" = "v6y GraphQL backend-for-frontend"
  }
}

target "bfb-main-analyzer" {
  inherits = ["_common"]
  target   = "bfb-main-analyzer"
  tags     = tags("v6y-bfb-main-analyzer")
  labels = {
    "org.opencontainers.image.title"       = "v6y-bfb-main-analyzer"
    "org.opencontainers.image.description" = "v6y audit orchestrator"
  }
}

target "bfb-static-code-auditor" {
  inherits = ["_common"]
  target   = "bfb-static-code-auditor"
  tags     = tags("v6y-bfb-static-code-auditor")
  labels = {
    "org.opencontainers.image.title"       = "v6y-bfb-static-code-auditor"
    "org.opencontainers.image.description" = "v6y static code auditor"
  }
}

target "bfb-url-dynamic-auditor" {
  inherits = ["_common"]
  target   = "bfb-url-dynamic-auditor"
  tags     = tags("v6y-bfb-url-dynamic-auditor")
  labels = {
    "org.opencontainers.image.title"       = "v6y-bfb-url-dynamic-auditor"
    "org.opencontainers.image.description" = "v6y dynamic URL auditor"
  }
}

target "bfb-devops-auditor" {
  inherits = ["_common"]
  target   = "bfb-devops-auditor"
  tags     = tags("v6y-bfb-devops-auditor")
  labels = {
    "org.opencontainers.image.title"       = "v6y-bfb-devops-auditor"
    "org.opencontainers.image.description" = "v6y DevOps auditor"
  }
}

target "frontend" {
  inherits = ["_front_common"]
  target   = "frontend"
  tags     = tags("v6y-frontend")
  labels = {
    "org.opencontainers.image.title"       = "v6y-frontend"
    "org.opencontainers.image.description" = "v6y public web frontend"
  }
}

target "frontend-bo" {
  inherits = ["_front_common"]
  target   = "frontend-bo"
  tags     = tags("v6y-frontend-bo")
  labels = {
    "org.opencontainers.image.title"       = "v6y-frontend-bo"
    "org.opencontainers.image.description" = "v6y back-office frontend"
  }
}
