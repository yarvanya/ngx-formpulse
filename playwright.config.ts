import {defineConfig, devices} from '@playwright/test';

const SANDBOX_PORT = 4300;
const SANDBOX_URL = `http://localhost:${String(SANDBOX_PORT)}`;
const CONTINUOUS_INTEGRATION_RETRIES = 2;
const IS_CONTINUOUS_INTEGRATION = Boolean(process.env['CI']);

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: IS_CONTINUOUS_INTEGRATION,
  retries: IS_CONTINUOUS_INTEGRATION ? CONTINUOUS_INTEGRATION_RETRIES : 0,
  reporter: IS_CONTINUOUS_INTEGRATION ? [['github'], ['html', {open: 'never'}]] : [['list']],
  use: {
    baseURL: SANDBOX_URL,
    trace: 'on-first-retry'
  },
  projects: [
    {name: 'chromium', use: {...devices['Desktop Chrome']}}
  ],
  webServer: {
    command: `npx serve dist/sandbox/browser --listen ${String(SANDBOX_PORT)} --no-request-logging`,
    url: SANDBOX_URL,
    reuseExistingServer: !IS_CONTINUOUS_INTEGRATION
  }
});
