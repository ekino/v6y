#!/bin/bash

# Wrapper to start all dev servers with increased file descriptor limits
# and automatic cleanup of orphaned processes

set -e

# Ctrl+C (or the terminal closing) should tear every spawned dev server down
# immediately. Two things make that slow otherwise:
#  1. nx run-many manages its own child processes and forwards signals with a
#     grace period per task, so waiting on nx to exit gracefully is slow.
#  2. Running it in the foreground means bash can't even start cleaning up
#     until nx itself returns - the trap below only fires promptly because nx
#     is launched in the background and waited on (see the bottom of this file).
# So cleanup hard-kills every known dev-server process by name directly rather
# than asking nx (or the servers) to shut themselves down.
cleanup() {
  trap - EXIT INT TERM
  echo ""
  echo "Stopping dev servers..."
  pkill -9 -f "nx run-many" 2>/dev/null || true
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

# 4. Run the actual dev command with increased limits. Started in the
# background (with `wait` below) instead of in the foreground so the trap
# above can react to Ctrl+C immediately instead of only after nx returns.
echo "Starting 7 dev servers in parallel..."
echo ""
# Use polling watchers to avoid Watchpack/Chokidar exhausting file descriptors
# when all frontends and backend dev servers run together. NX_TUI=false skips
# nx's interactive dashboard, which takes over the terminal (alternate screen,
# its own keybindings) and is the actual reason Ctrl+C felt stuck/slow here.
# --output-style=stream makes nx print each app's log lines live, prefixed
# with its project name, instead of buffering a task's whole output until it
# finishes (the non-TUI default) - that buffering is what made per-app logs
# seem to disappear once the TUI was turned off.
NX_TUI=false \
WATCHPACK_POLLING=true \
CHOKIDAR_USEPOLLING=true \
NODE_OPTIONS="--max-old-space-size=4096" \
nx run-many --target=start:dev --all --parallel --maxParallel=7 --output-style=stream &

wait $!
