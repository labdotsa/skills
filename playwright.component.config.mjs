import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "test/component",
  outputDir: "tmp/playwright-component-results",
  reporter: "line",
  retries: 0,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:4195",
    colorScheme: "light",
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npx vite --config test/component/vite.config.ts --host 127.0.0.1 --port 4195 --strictPort",
    reuseExistingServer: false,
    url: "http://127.0.0.1:4195/",
  },
  projects: [{ name: "component-chromium" }],
});
