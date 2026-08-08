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
