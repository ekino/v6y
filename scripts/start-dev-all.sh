#!/bin/bash

# Wrapper to start all dev servers with increased file descriptor limits
# and automatic cleanup of orphaned processes

set -e

# PIDs of the dev servers started below, so cleanup can hard-kill them directly
# instead of going through nx's task runner, whose own graceful-shutdown
# sequencing across 7 parallel tasks is what made Ctrl+C take 30s-1min.
PIDS=()

# Ctrl+C (or the terminal closing) should tear every spawned dev server down
# immediately instead of waiting on each framework's own graceful-shutdown path
# (Next.js/refine in particular can take several seconds each) one after another.
# Disabling the trap first avoids re-entering it when the kills below signal
# this script's own process group.
cleanup() {
  trap - EXIT INT TERM
  echo ""
  echo "Stopping dev servers..."
  for pid in "${PIDS[@]}"; do
    kill -TERM "$pid" 2>/dev/null || true
  done
  sleep 0.3
  for pid in "${PIDS[@]}"; do
    kill -KILL "$pid" 2>/dev/null || true
  done
  node scripts/stop-ports.js > /dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

echo "Starting all dev servers..."
echo ""

# 1. Stop orphaned ports
echo "Cleaning up orphaned processes..."
node scripts/stop-ports.js > /dev/null 2>&1 || true
echo ""

# 1b. Make sure Redis is available for the BullMQ-backed main analyzer.
if command -v docker >/dev/null 2>&1; then
  echo "🧱 Starting Redis for queue processing..."
  if ! docker compose up -d v6y-redis >/dev/null 2>&1; then
    echo "⚠️  Could not start Redis via Docker (daemon not running?); it must already be running on 127.0.0.1:6379."
  fi
  echo ""
else
  echo "⚠️  Docker is not available; Redis must already be running on 127.0.0.1:6379."
  echo ""
fi

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

# 4. Start each dev server directly via pnpm --filter, bypassing nx's task
# runner entirely. nx run-many is what previously made Ctrl+C so slow: it
# manages its own child processes and forwards signals with a grace period
# per task, so killing it does not promptly kill the 7 underlying servers.
echo "Starting 7 dev servers in parallel..."
echo ""
export WATCHPACK_POLLING=true
export CHOKIDAR_USEPOLLING=true
export NODE_OPTIONS="--max-old-space-size=4096"

for project in \
  @v6y/bff \
  @v6y/bfb-main-analyzer \
  @v6y/bfb-static-auditor \
  @v6y/bfb-dynamic-auditor \
  @v6y/bfb-devops-auditor \
  @v6y/front \
  @v6y/front-bo \
; do
  pnpm --filter "$project" run start:dev &
  PIDS+=($!)
done

wait
