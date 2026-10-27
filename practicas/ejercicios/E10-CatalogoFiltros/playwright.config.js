// Configuración de Playwright (no hace falta modificarla)
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'e2e',
  use: { baseURL: 'http://localhost:3610' },
  // Arranca el servidor de la página antes de las pruebas (o usa el del Dev Container)
  webServer: {
    command: 'npx --yes serve@14.2.6 --no-clipboard --listen 3610 .',
    url: 'http://localhost:3610',
    reuseExistingServer: true,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
