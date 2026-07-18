import { test, expect } from '@playwright/test';

const URL = 'https://landingads.es/';

test('la pàgina principal i el formulari de contacte estan disponibles', async ({ page }) => {
  const response = await page.goto(URL, {
    waitUntil: 'domcontentloaded',
  });

  // Primer comprovem que el servidor ha retornat una pàgina HTML correctament.
  expect(response).not.toBeNull();
  expect(response!.status()).toBeGreaterThanOrEqual(200);
  expect(response!.status()).toBeLessThan(400);
  expect(response!.headers()['content-type']).toContain('text/html');

  // Contingut mínim que identifica la landing i evita falsos positius.
  await expect(page).toHaveTitle(/Sergi Ruiz/i);
  await expect(
    page.getByText(/Convierte tu inversión en Google Ads/i).first(),
  ).toBeVisible();

  // Fem servir noms accessibles en lloc de classes generades per Elementor.
  const form = page
    .locator('form')
    .filter({
      has: page.getByRole('button', { name: /recibir consultoría gratuita/i }),
    })
    .first();

  await expect(form).toBeVisible();
  await expect(form.getByRole('textbox', { name: /nombre completo/i })).toBeVisible();
  await expect(form.getByRole('textbox', { name: /teléfono/i })).toBeVisible();
  await expect(form.getByRole('textbox', { name: /email/i })).toBeVisible();
  await expect(form.getByRole('checkbox')).toBeVisible();

  const submitButton = form.getByRole('button', {
    name: /recibir consultoría gratuita/i,
  });
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toBeEnabled();
});
