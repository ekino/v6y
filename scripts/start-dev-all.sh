#!/bin/bash

# Wrapper to start all dev servers with increased file descriptor limits
# and automatic cleanup of orphaned processes

set -e

echo "🚀 Starting all dev servers..."
echo ""

# 1. Stop orphaned ports
echo "🛑 Cleaning up orphaned processes..."
node scripts/stop-ports.js > /dev/null 2>&1 || true
echo ""

# 2. Increase file descriptor limit for this shell and all child processes
echo "📊 Setting file descriptor limits..."
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
  echo "🧹 Clearing watchman cache..."
  watchman watch-del-all 2>/dev/null || true
  echo ""
fi

# 4. Run the actual dev command with increased limits
echo "⚙️  Starting 7 dev servers in parallel..."
echo ""
NODE_OPTIONS="--max-old-space-size=4096" \
  nx run-many --target=start:dev --all --parallel --maxParallel=7
