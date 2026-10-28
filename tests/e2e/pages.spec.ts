import { expect, test } from '@playwright/test';
import { builtPages } from './pages';

const pages = builtPages();

test('the build produced the core templates', () => {
  for (const path of ['/', '/services/', '/industries/', '/pricing/', '/agencies/', '/giving/', '/about/', '/contact/', '/blog/', '/thanks/', '/form-error/']) {
    expect(pages).toContain(path);
  }
});

for (const path of pages) {
  test.describe(path, () => {
    test('loads with one h1, a title, a description and a canonical URL', async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page).toHaveTitle(/\S/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https?:\/\//);
    });

    for (const width of [320, 768, 1280]) {
      test(`has no horizontal scroll at ${width}px`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow).toBeLessThanOrEqual(0);
      });
    }
  });
}

test('unknown URLs get the 404 page', async ({ page }) => {
  const res = await page.goto('/this-does-not-exist/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText("couldn't find");
});

test('main navigation reaches every section', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const label of ['Services', 'Industries', 'Pricing', 'Giving', 'About', 'Blog']) {
    await page.goto('/');
    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: label }).click();
    await expect(page.locator('h1')).toBeVisible();
    expect(new URL(page.url()).pathname).not.toBe('/');
  }
});

test('mobile menu opens and links work', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  await page.getByText('Menu', { exact: true }).click();
  await page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Pricing' }).click();
  await expect(page).toHaveURL(/\/pricing\/$/);
});

test('landing pages hide the main nav, keep one action and stay out of search', async ({ page }) => {
  await page.goto('/lp/start/');
  await expect(page.getByRole('navigation', { name: 'Main' })).toHaveCount(0);
  await expect(page.locator('form.lead-form')).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
});

// This is GallarDesign's own site, so its name is expected; the kit's is not.
test('pages never credit the kit', async ({ page }) => {
  for (const path of pages) {
    await page.goto(path);
    const html = await page.content();
    expect(html).not.toMatch(/agency-kit|name="generator"/i);
  }
});

test('every internal link on every page resolves', async ({ page, request }) => {
  const links = new Set<string>();
  for (const path of pages) {
    await page.goto(path);
    const hrefs = await page.$$eval('a[href^="/"], link[rel="icon"]', (els) => els.map((el) => el.getAttribute('href') ?? ''));
    for (const href of hrefs) links.add(href.split('#')[0]);
  }
  const broken: string[] = [];
  for (const href of links) {
    const res = await request.get(href);
    if (res.status() !== 200) broken.push(`${href} (${res.status()})`);
  }
  expect(broken).toEqual([]);
});
