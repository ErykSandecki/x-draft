import { test, expect } from '@playwright/test';

// pages
import { DesignPage } from './DesignPage';

test('draws a new text node on the canvas using the Text tool', async ({ page }) => {
  const designPage = new DesignPage(page);

  await designPage.goto('e2e-test-project');
  await expect(designPage.canvas).toBeVisible();

  const box = await designPage.canvas.boundingBox();
  if (!box) {
    throw new Error('Canvas bounding box unavailable');
  }

  const before = await designPage.canvas.screenshot();

  const textTool = designPage.toolRadio('text');
  await expect(textTool).toBeVisible();

  const startX = box.x + box.width * 0.3;
  const startY = box.y + box.height * 0.3;
  const endX = box.x + box.width * 0.6;
  const endY = box.y + box.height * 0.4;

  await designPage.drawTextBox(startX, startY, endX, endY);

  const defaultTool = designPage.toolRadio('default');
  await expect(defaultTool).toHaveAttribute('aria-checked', 'true');

  await designPage.typeText('Hello world');
  await designPage.click(box.x + box.width * 0.9, box.y + box.height * 0.9);

  const after = await designPage.canvas.screenshot();
  expect(after.equals(before)).toBe(false);
});

test('discards the text node when no content is entered before clicking away', async ({ page }) => {
  const designPage = new DesignPage(page);

  await designPage.goto('e2e-test-project');
  await expect(designPage.canvas).toBeVisible();

  const box = await designPage.canvas.boundingBox();
  if (!box) {
    throw new Error('Canvas bounding box unavailable');
  }

  const before = await designPage.canvas.screenshot();

  const startX = box.x + box.width * 0.3;
  const startY = box.y + box.height * 0.3;
  const endX = box.x + box.width * 0.6;
  const endY = box.y + box.height * 0.4;

  await designPage.drawTextBox(startX, startY, endX, endY);
  await designPage.click(box.x + box.width * 0.9, box.y + box.height * 0.9);

  const after = await designPage.canvas.screenshot();
  expect(after.equals(before)).toBe(true);
});
