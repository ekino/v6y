import { defineConfig } from "@playwright/test";

export default defineConfig({
  projects: [
    {
      name: "v6y-front",
      testDir: "./tests/v6y-front",
      use: {
        baseURL: "http://localhost:4004",
      },
    },
    {
      name: "v6y-front-bo",
      testDir: "./tests/v6y-front-bo",
      use: {
        baseURL: "http://localhost:4006",
      },
    },
  ],
  timeout: 3000,
  retries: 2,
  use: {
    trace: "on-first-retry",
  },
});
