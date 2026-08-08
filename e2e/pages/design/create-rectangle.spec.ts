import { test, expect } from '@playwright/test';

// pages
import { DesignPage } from './DesignPage';

test('draws a new rectangle on the canvas using the Rectangle tool', async ({ page }) => {
  const designPage = new DesignPage(page);

  await designPage.goto('e2e-test-project');
  await expect(designPage.canvas).toBeVisible();

  const box = await designPage.canvas.boundingBox();
  if (!box) {
    throw new Error('Canvas bounding box unavailable');
  }

  const before = await designPage.canvas.screenshot();

  const rectangleTool = designPage.toolRadio('rectangle');
  await expect(rectangleTool).toBeVisible();
  await designPage.selectTool('rectangle');
  await expect(rectangleTool).toHaveAttribute('aria-checked', 'true');

  const startX = box.x + box.width * 0.3;
  const startY = box.y + box.height * 0.3;
  const endX = box.x + box.width * 0.6;
  const endY = box.y + box.height * 0.6;

  await designPage.pointerDown(startX, startY);
  await designPage.pointerMove(endX, endY);
  await designPage.pointerUp();

  const defaultTool = designPage.toolRadio('default');
  await expect(defaultTool).toHaveAttribute('aria-checked', 'true');

  const after = await designPage.canvas.screenshot();
  expect(after.equals(before)).toBe(false);
});

test('draws a rectangle with the "R" keyboard shortcut', async ({ page }) => {
  const designPage = new DesignPage(page);

  await designPage.goto('e2e-test-project');
  await expect(designPage.canvas).toBeVisible();

  const box = await designPage.canvas.boundingBox();
  if (!box) {
    throw new Error('Canvas bounding box unavailable');
  }

  const before = await designPage.canvas.screenshot();

  await page.keyboard.press('r');

  const rectangleTool = designPage.toolRadio('rectangle');
  await expect(rectangleTool).toHaveAttribute('aria-checked', 'true');

  const startX = box.x + box.width * 0.3;
  const startY = box.y + box.height * 0.3;
  const endX = box.x + box.width * 0.6;
  const endY = box.y + box.height * 0.6;

  await designPage.pointerDown(startX, startY);
  await designPage.pointerMove(endX, endY);
  await designPage.pointerUp();

  const after = await designPage.canvas.screenshot();
  expect(after.equals(before)).toBe(false);
});
