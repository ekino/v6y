#!/bin/bash

# Wrapper to start all dev servers with increased file descriptor limits
# and automatic cleanup of orphaned processes

set -e

echo "Starting all dev servers..."
echo ""

# 1. Stop orphaned ports
echo "Cleaning up orphaned processes..."
node scripts/stop-ports.js > /dev/null 2>&1 || true
echo ""

# 2. Increase file descriptor limit for this shell and all child processes
echo "Setting file descriptor limits..."
OLD_LIMIT=$(ulimit -n)
# Try to set soft limit to 65536, fall back to available
NEW_LIMIT=$(ulimit -H -n 2>/dev/null || echo "65536")
if [ "$NEW_LIMIT" = "unlimited" ]; then
  NEW_LIMIT=65536
fi
ulimit -n $NEW_LIMIT 2>/dev/null || ulimit -n $OLD_LIMIT
CURRENT_LIMIT=$(ulimit -n)
echo "  File descriptors: $OLD_LIMIT → $CURRENT_LIMIT"
echo ""

# 3. Optional: clear watchman cache if available
if command -v watchman &> /dev/null; then
  echo "Clearing watchman cache..."
  watchman watch-del-all 2>/dev/null || true
  echo ""
fi

# 4. Hybrid watcher strategy:
#    - Polling by default for frontend watchers (Watchpack-heavy apps)
#    - Native watchers by default for backend services
#    - Fully configurable through env vars
ALL_PROJECTS=(
  "@v6y/front"
  "@v6y/front-bo"
  "@v6y/bff"
  "@v6y/bfb-main-analyzer"
  "@v6y/bfb-static-auditor"
  "@v6y/bfb-dynamic-auditor"
  "@v6y/bfb-devops-auditor"
)

contains_project() {
  local needle="$1"
  shift
  for item in "$@"; do
    if [ "$item" = "$needle" ]; then
      return 0
    fi
  done
  return 1
}

parse_csv_projects() {
  local csv="$1"
  local parsed=()

  if [ -z "$csv" ]; then
    echo ""
    return 0
  fi

  IFS=',' read -r -a raw_values <<< "$csv"
  for value in "${raw_values[@]}"; do
    trimmed_value=$(echo "$value" | xargs)
    if [ -n "$trimmed_value" ] && contains_project "$trimmed_value" "${ALL_PROJECTS[@]}"; then
      parsed+=("$trimmed_value")
    fi
  done

  echo "${parsed[*]}"
}

DEFAULT_POLLING_PROJECTS=("@v6y/front" "@v6y/front-bo")
POLLING_PROJECTS=("${DEFAULT_POLLING_PROJECTS[@]}")

if [ "${USE_POLLING_FOR_ALL:-false}" = "true" ]; then
  POLLING_PROJECTS=("${ALL_PROJECTS[@]}")
elif [ "${USE_NATIVE_FOR_ALL:-false}" = "true" ]; then
  POLLING_PROJECTS=()
elif [ -n "${POLLING_PROJECTS_CSV:-}" ]; then
  parsed_polling_projects=$(parse_csv_projects "$POLLING_PROJECTS_CSV")
  if [ -n "$parsed_polling_projects" ]; then
    IFS=' ' read -r -a POLLING_PROJECTS <<< "$parsed_polling_projects"
  else
    POLLING_PROJECTS=()
  fi
fi

NATIVE_PROJECTS=()
for project in "${ALL_PROJECTS[@]}"; do
  if ! contains_project "$project" "${POLLING_PROJECTS[@]}"; then
    NATIVE_PROJECTS+=("$project")
  fi
done

echo "Hybrid watcher setup:"
echo "  Tip: override polling set with POLLING_PROJECTS_CSV=<csv> or force all native with USE_NATIVE_FOR_ALL=true"
if [ ${#NATIVE_PROJECTS[@]} -gt 0 ]; then
  echo "  Native watchers: ${NATIVE_PROJECTS[*]}"
fi
if [ ${#POLLING_PROJECTS[@]} -gt 0 ]; then
  echo "  Polling watchers: ${POLLING_PROJECTS[*]}"
fi
echo ""

# 5. Long-lived dev servers don't benefit from the Nx daemon (no cached
#    task outputs to reuse, no need for cross-run project-graph caching),
#    and running two `nx run-many` groups in parallel makes each one race
#    the other to spawn/reconnect to a daemon at startup, crashing both
#    with "this process is no longer the current daemon" or
#    EEXIST/EADDRINUSE on the daemon socket file. Disabling the daemon for
#    these invocations removes the race entirely instead of just narrowing
#    its window.
export NX_DAEMON=false

PIDS=()
if [ ${#NATIVE_PROJECTS[@]} -gt 0 ]; then
  IFS=',' native_projects_csv="${NATIVE_PROJECTS[*]}"
  echo "Starting native watcher services..."
  NODE_OPTIONS="--max-old-space-size=4096" \
  pnpm nx run-many \
    --target=start:dev \
    --projects="$native_projects_csv" \
    --parallel \
    --maxParallel=${#NATIVE_PROJECTS[@]} \
    --outputStyle=stream &
  PIDS+=($!)
fi

if [ ${#POLLING_PROJECTS[@]} -gt 0 ]; then
  IFS=',' polling_projects_csv="${POLLING_PROJECTS[*]}"
  echo "Starting polling fallback services..."
  WATCHPACK_POLLING=true \
  CHOKIDAR_USEPOLLING=true \
  NODE_OPTIONS="--max-old-space-size=4096" \
  pnpm nx run-many \
    --target=start:dev \
    --projects="$polling_projects_csv" \
    --parallel \
    --maxParallel=${#POLLING_PROJECTS[@]} \
    --outputStyle=stream &
  PIDS+=($!)
fi

cleanup() {
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done
}

trap cleanup INT TERM EXIT

if [ ${#PIDS[@]} -eq 1 ]; then
  if wait "${PIDS[0]}"; then
    EXIT_CODE=0
  else
    EXIT_CODE=$?
  fi
else
  EXIT_CODE=0
  while true; do
    for pid in "${PIDS[@]}"; do
      if ! kill -0 "$pid" 2>/dev/null; then
        if wait "$pid"; then
          EXIT_CODE=0
        else
          EXIT_CODE=$?
        fi
        break 2
      fi
    done
    sleep 1
  done
fi

cleanup
for pid in "${PIDS[@]}"; do
  wait "$pid" 2>/dev/null || true
done

exit "$EXIT_CODE"
