import { expect, test } from '@playwright/test';

test.describe('lead form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact/');
  });

  async function fill(page: import('@playwright/test').Page) {
    const form = page.locator('form.lead-form');
    await form.getByLabel('Name').fill('Dana');
    await form.getByLabel('Email').fill('dana@example.com');
    await form.getByLabel('How can we help?').fill('Leaky tap');
    return form;
  }

  test('shows the success message and fires a generate_lead event', async ({ page }) => {
    let posted = '';
    await page.route('**/api/lead', async (route) => {
      posted = route.request().postData() ?? '';
      await route.fulfill({ json: { ok: true } });
    });
    const form = await fill(page);
    await form.getByRole('button', { name: 'Send request' }).click();
    await expect(form.getByRole('status')).toContainText('Thanks');
    expect(posted).toContain('Dana');
    const events = await page.evaluate(() => (window as unknown as { dataLayer: { event?: string }[] }).dataLayer);
    expect(events.some((e) => e.event === 'generate_lead')).toBe(true);
    await expect(form.getByLabel('Name')).toHaveValue('');
  });

  test('shows a real error with the phone fallback when sending fails', async ({ page }) => {
    await page.route('**/api/lead', (route) => route.fulfill({ status: 502, json: { ok: false, error: 'We could not send your message.' } }));
    const form = await fill(page);
    await form.getByRole('button', { name: 'Send request' }).click();
    const status = form.getByRole('status');
    await expect(status).toContainText('We could not send your message.');
    await expect(status.getByRole('link').first()).toHaveAttribute('href', /^tel:/);
    const events = await page.evaluate(() => (window as unknown as { dataLayer: { event?: string }[] }).dataLayer);
    expect(events.some((e) => e.event === 'generate_lead')).toBe(false);
  });

  test('works without JavaScript by posting to the function', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.route('**/api/lead', (route) =>
      route.fulfill({ status: 303, headers: { location: 'http://localhost:4321/thanks/' } }),
    );
    await page.goto('/contact/');
    const form = page.locator('form.lead-form');
    await form.getByLabel('Name').fill('Dana');
    await form.getByLabel('Phone').fill('5035550100');
    await form.getByRole('button', { name: 'Send request' }).click();
    await expect(page).toHaveURL(/\/thanks\/$/);
    await context.close();
  });
});

test('the real endpoint runs on the worker and says when no webhook is set', async ({ page }) => {
  // CI has no LEAD_WEBHOOK_URL, so this proves the form reaches the worker
  // and that a missing setup is reported instead of a fake thank-you.
  await page.goto('/contact/');
  const form = page.locator('form.lead-form');
  await form.getByLabel('Name').fill('Dana');
  await form.getByLabel('Email').fill('dana@example.com');
  await form.getByRole('button', { name: 'Send request' }).click();
  await expect(form.getByRole('status')).toContainText('The form is not set up yet.');
});
