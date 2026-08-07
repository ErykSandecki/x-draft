import { test, expect } from '@playwright/test';

// pages
import { DesignPage } from './DesignPage';

test('shift-click adds a second frame to the selection and draws the shared group outline', async ({ page }) => {
  const designPage = new DesignPage(page);

  await designPage.goto('e2e-test-selection-shift-click');
  await expect(designPage.canvas).toBeVisible();

  await designPage.drawFrame(100, 100, 140, 140); // A
  await designPage.drawFrame(300, 100, 340, 140); // B

  await designPage.click(120, 120); // select A
  const singleSelection = await designPage.canvas.screenshot();

  await designPage.click(320, 120, { shift: true }); // add B
  const groupSelection = await designPage.canvas.screenshot();

  expect(groupSelection.equals(singleSelection)).toBe(false);
});

test('clicking an unselected frame inside a multi-selection does not replace the selection until release', async ({
  page,
}) => {
  const designPage = new DesignPage(page);

  await designPage.goto('e2e-test-selection-gap-click');
  await expect(designPage.canvas).toBeVisible();

  await designPage.drawFrame(100, 100, 140, 140); // A
  await designPage.drawFrame(200, 100, 240, 140); // C — sits unselected, inside A+B's shared bounds
  await designPage.drawFrame(300, 100, 340, 140); // B

  await designPage.click(120, 120); // select A
  await designPage.click(320, 120, { shift: true }); // add B — shared outline now spans A..B, covering C
  const groupSelection = await designPage.canvas.screenshot();

  // pressing down on C must not flicker the outline away from the group while the button is held
  await designPage.pointerDown(220, 120);
  const heldOnUnselectedNode = await designPage.canvas.screenshot();
  expect(heldOnUnselectedNode.equals(groupSelection)).toBe(true);

  // releasing without moving replaces the selection with the node that was actually clicked
  await designPage.pointerUp();
  const releasedOnUnselectedNode = await designPage.canvas.screenshot();
  expect(releasedOnUnselectedNode.equals(groupSelection)).toBe(false);
});

test('selecting a frame still works after panning the canvas', async ({ page }) => {
  const designPage = new DesignPage(page);

  await designPage.goto('e2e-test-selection-pan');
  await expect(designPage.canvas).toBeVisible();

  await designPage.drawFrame(100, 100, 140, 140); // A, center at screen (120, 120)

  const dx = 150;
  const dy = 90;

  await designPage.panBy(dx, dy);

  // A rendered at screen (120, 120) before the pan now renders at (120 + dx, 120 + dy) — the world
  // position never changed, only the viewport offset did
  await designPage.click(120 + dx, 120 + dy);
  const selected = await designPage.canvas.screenshot();

  await designPage.click(10, 10); // empty canvas, well away from the panned frame — deselects
  const deselected = await designPage.canvas.screenshot();

  expect(selected.equals(deselected)).toBe(false);
});

test('selecting a frame still works after zooming the canvas', async ({ page }) => {
  const designPage = new DesignPage(page);

  await designPage.goto('e2e-test-selection-zoom');
  await expect(designPage.canvas).toBeVisible();

  await designPage.drawFrame(100, 100, 140, 140); // A, center at screen (120, 120)

  // zooming with the anchor at A's own center keeps that exact screen point mapped to the same
  // world point (A's center) afterwards, regardless of the resulting zoom factor
  await designPage.zoomAt(120, 120, -240);

  await designPage.click(120, 120);
  const selected = await designPage.canvas.screenshot();

  await designPage.click(10, 10); // empty canvas — deselects
  const deselected = await designPage.canvas.screenshot();

  expect(selected.equals(deselected)).toBe(false);
});
