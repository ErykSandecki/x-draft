import { Locator, Page } from '@playwright/test';

export type TToolName = 'comment' | 'default' | 'frame';

export class DesignPage {
  readonly page: Page;
  readonly canvas: Locator;

  constructor(page: Page) {
    this.page = page;
    this.canvas = page.locator('canvas');
  }

  async goto(projectId: string): Promise<void> {
    await this.page.goto(`/design/${projectId}`);
  }

  toolRadio(tool: TToolName): Locator {
    return this.page.getByRole('radio', { name: tool });
  }

  async selectTool(tool: TToolName): Promise<void> {
    await this.toolRadio(tool).click();
  }

  async drawFrame(x1: number, y1: number, x2: number, y2: number): Promise<void> {
    await this.selectTool('frame');
    await this.pointerDown(x1, y1);
    await this.page.mouse.move(x2, y2, { steps: 5 });
    await this.pointerUp();
  }

  async click(x: number, y: number, options: { shift?: boolean } = {}): Promise<void> {
    if (options.shift) {
      await this.page.keyboard.down('Shift');
    }

    await this.page.mouse.click(x, y);

    if (options.shift) {
      await this.page.keyboard.up('Shift');
    }
  }

  async pointerDown(x: number, y: number): Promise<void> {
    await this.page.mouse.move(x, y);
    await this.page.mouse.down();
  }

  async pointerMove(x: number, y: number): Promise<void> {
    await this.page.mouse.move(x, y, { steps: 5 });
  }

  async pointerUp(): Promise<void> {
    await this.page.mouse.up();
  }

  async panBy(dx: number, dy: number): Promise<void> {
    const startX = 500;
    const startY = 500;

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down({ button: 'middle' });
    await this.page.mouse.move(startX + dx, startY + dy, { steps: 5 });
    await this.page.mouse.up({ button: 'middle' });
  }

  async zoomAt(x: number, y: number, deltaY: number): Promise<void> {
    await this.page.mouse.move(x, y);
    await this.page.keyboard.down('Control');
    await this.page.mouse.wheel(0, deltaY);
    await this.page.keyboard.up('Control');
  }
}
