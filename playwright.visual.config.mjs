import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "test/visual",
  outputDir: "tmp/playwright-visual-results",
  snapshotPathTemplate: "{testDir}/{testFilePath}-snapshots/{arg}-{projectName}{ext}",
  reporter: "line",
  retries: 0,
  timeout: 180_000,
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.005 } },
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
    { name: "visual-desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 720 } } },
    {
      name: "visual-mobile",
      use: { browserName: "chromium", hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } },
    },
  ],
});
