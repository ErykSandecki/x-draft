import { test, expect } from '@playwright/test';

test('draws a new frame on the canvas using the Frame tool', async ({ page }) => {
  await page.goto('/design/e2e-test-project');

  const canvas = page.locator('canvas');
  await expect(canvas).toBeVisible();

  const box = await canvas.boundingBox();
  if (!box) {
    throw new Error('Canvas bounding box unavailable');
  }

  const before = await canvas.screenshot();

  const frameTool = page.getByRole('radio', { name: 'frame' });
  await expect(frameTool).toBeVisible();
  await frameTool.click();
  await expect(frameTool).toHaveAttribute('aria-checked', 'true');

  const startX = box.x + box.width * 0.3;
  const startY = box.y + box.height * 0.3;
  const endX = box.x + box.width * 0.6;
  const endY = box.y + box.height * 0.6;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(endX, endY, { steps: 10 });
  await page.mouse.up();

  const defaultTool = page.getByRole('radio', { name: 'default' });
  await expect(defaultTool).toHaveAttribute('aria-checked', 'true');

  const after = await canvas.screenshot();
  expect(after.equals(before)).toBe(false);
});
