setup:
	@command -v pnpm >/dev/null 2>&1 || { echo >&2 "pnpm is required but not installed. Aborting."; exit 1; }
	pnpm install
	bash ./scripts/start-db-and-init.sh
