import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "test/browser-quality",
  outputDir: "tmp/playwright-browser-quality-results",
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
    { name: "quality-chromium-desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 720 } } },
    {
      name: "quality-chromium-mobile",
      use: { browserName: "chromium", hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } },
    },
    { name: "quality-firefox-desktop", use: { ...devices["Desktop Firefox"], viewport: { width: 1280, height: 720 } } },
    { name: "quality-webkit-desktop", use: { ...devices["Desktop Safari"], viewport: { width: 1280, height: 720 } } },
  ],
});
