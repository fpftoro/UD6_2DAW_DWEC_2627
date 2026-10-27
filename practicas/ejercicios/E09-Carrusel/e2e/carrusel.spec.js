import { test, expect } from '@playwright/test';

test('al cargar se ve la primera diapositiva', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Granada' })).toBeVisible();
});

// TODO: añade el resto de recorridos del enunciado
