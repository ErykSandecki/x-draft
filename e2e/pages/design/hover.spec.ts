import { test, expect } from '@playwright/test';

// pages
import { DesignPage } from './DesignPage';

test('hovering a frame shows an outline highlight, which clears once the pointer leaves it', async ({ page }) => {
  const designPage = new DesignPage(page);

  await designPage.goto('e2e-test-hover-highlight');
  await expect(designPage.canvas).toBeVisible();

  await designPage.drawFrame(100, 100, 140, 140); // P

  await designPage.pointerMove(10, 10); // rest away from P first
  const baseline = await designPage.canvas.screenshot();

  await designPage.pointerMove(120, 120); // move onto P, without pressing
  const hovered = await designPage.canvas.screenshot();

  expect(hovered.equals(baseline)).toBe(false);

  await designPage.pointerMove(10, 10); // move back off P
  const afterLeaving = await designPage.canvas.screenshot();

  expect(afterLeaving.equals(baseline)).toBe(true);
});

test('hovering an ellipse only highlights inside its curve, not the corners of its bounding box', async ({ page }) => {
  const designPage = new DesignPage(page);

  await designPage.goto('e2e-test-hover-highlight');
  await expect(designPage.canvas).toBeVisible();

  await designPage.drawEllipse(100, 100, 180, 160); // bounding box (100,100)-(180,160), center (140,130)

  await designPage.pointerMove(10, 10); // rest away first
  const baseline = await designPage.canvas.screenshot();

  await designPage.pointerMove(105, 105); // inside the bounding box, but outside the ellipse's curve
  const atCorner = await designPage.canvas.screenshot();

  expect(atCorner.equals(baseline)).toBe(true);

  await designPage.pointerMove(140, 130); // the ellipse's own center
  const atCenter = await designPage.canvas.screenshot();

  expect(atCenter.equals(baseline)).toBe(false);
});
