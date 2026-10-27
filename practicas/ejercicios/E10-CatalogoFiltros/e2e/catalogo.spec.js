import { test, expect } from '@playwright/test';

test('al cargar se ve el formulario de filtros', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('search', { name: 'Filtros del catálogo' })).toBeVisible();
});

// TODO: añade el resto de recorridos del enunciado
