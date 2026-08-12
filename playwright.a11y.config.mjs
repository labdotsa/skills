import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "test/a11y",
  outputDir: "tmp/playwright-a11y-results",
  reporter: "line",
  retries: 0,
  timeout: 120_000,
  use: {
    baseURL: "http://127.0.0.1:4173",
    colorScheme: "light",
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/serve-e2e-publications.mjs",
    reuseExistingServer: false,
    url: "http://127.0.0.1:4173/",
  },
  projects: [
    { name: "a11y-desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 720 } } },
    {
      name: "a11y-mobile",
      use: { browserName: "chromium", hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } },
    },
  ],
});
