import { defineConfig } from "@playwright/test";

const PORT = 4173;
const HOST = "127.0.0.1";
const BASE_URL = `http://${HOST}:${PORT}`;

export default defineConfig({
    testDir: "tests/e2e",
    retries: process.env.CI ? 2 : 0,
    use: {
        baseURL: BASE_URL,
        trace: "retain-on-failure",
        video: "retain-on-failure",
        screenshot: "only-on-failure",
    },
    webServer: {
        command: "node scripts/serve-static.js",
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
    },
});
