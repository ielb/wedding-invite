import { expect, test, type Page } from '@playwright/test';

async function holdScripts(page: Page) {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/*', async route => {
    if (route.request().resourceType() === 'script') await gate;
    await route.continue();
  });
  return release;
}

test('keeps names hidden from first paint through the opening video', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const release = await holdScripts(page);
  try {
    await page.goto('/', { waitUntil: 'commit' });
    await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '0');
    await expect(page.locator('.hero-media')).toHaveCSS('background-image', /closed-invitation\.webp/);
    await expect(page.locator('video')).toHaveCount(0);
  } finally {
    release();
  }

  const video = page.locator('video');
  await expect(video).toBeVisible();
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '0');
  await expect.poll(() => video.evaluate(element => {
    const media = element as HTMLVideoElement;
    return !media.paused && media.currentTime > 0;
  })).toBe(true);
  await expect(video).toHaveCount(0, { timeout: 15_000 });
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
  await expect(page.locator('.hero-media')).toHaveCSS('background-image', /tetouan-arch\.webp/);
  expect(errors).toEqual([]);
});

test('skip reveals the names and motion can replay the opening on the henna invitation', async ({ page }) => {
  await page.goto('/henna');
  await page.getByRole('button', { name: 'تخطّي المقدمة' }).click();
  await expect(page.locator('video')).toHaveCount(0);
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
  await page.getByRole('button', { name: 'إيقاف الحركة' }).click();
  await page.getByRole('button', { name: 'تشغيل الحركة' }).click();
  await expect(page.locator('video')).toBeVisible();
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '0');
});

test('reduced motion shows the names before hydration without playing video', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const release = await holdScripts(page);
  try {
    await page.goto('/', { waitUntil: 'commit' });
    await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
    await expect(page.locator('.hero-media')).toHaveCSS('background-image', /tetouan-arch\.webp/);
  } finally {
    release();
  }
  await page.waitForLoadState('networkidle');
  await expect(page.locator('video')).toHaveCount(0);
  await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('shows the full invitation immediately', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.hero-copy')).toHaveCSS('opacity', '1');
    await expect(page.locator('.hero-media')).toHaveCSS('background-image', /tetouan-arch\.webp/);
    await expect(page.locator('video')).toHaveCount(0);
  });
});
