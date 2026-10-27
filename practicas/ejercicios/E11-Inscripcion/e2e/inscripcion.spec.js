import { test, expect } from '@playwright/test';

test('al cargar se ve el primer paso', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByLabel('Nombre', { exact: true })).toBeVisible();
});

// TODO: añade el resto de recorridos del enunciado
