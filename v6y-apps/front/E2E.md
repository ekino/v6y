# E2E Tests

End-to-end tests for the front application, using [Playwright](https://playwright.dev).

## Prerequisites

- Node.js and pnpm installed
- Playwright browsers installed (see below)
- The application running locally or at a reachable URL

## Install Playwright browsers

```bash
pnpm exec playwright install
```

## Run the application

Start the dev server before running tests:

```bash
pnpm start:dev
```

## Run the tests

```bash
# Run all e2e tests (headless)
pnpm test:e2e
```

## Environment variables

| Variable   | Default                  | Description                      |
|------------|--------------------------|----------------------------------|
| `BASE_URL`  | `http://localhost:3000`  | Base URL of the running app      |
| `PORT`      | `3000`                   | Port used when BASE_URL is unset |

Example against a staging environment:

```bash
BASE_URL=https://staging.example.com pnpm test:e2e
```

## Test coverage

| Suite            | Test                                              |
|------------------|---------------------------------------------------|
| Authentication   | Login page renders the form                       |
| Authentication   | Protected route redirects to login (unauthenticated) |
| Public routes    | FAQ page loads without authentication             |
| Public routes    | Contact page loads without authentication         |

## View the HTML report

After a run, open the generated report:

```bash
pnpm exec playwright show-report
```
