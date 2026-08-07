// utils
import { getRandomColor } from '../getRandomColor';

describe('getRandomColor', () => {
  it('should return a 6-digit hex color', () => {
    // result
    expect(getRandomColor()).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('should return different colors across calls', () => {
    // before
    const colors = Array.from({ length: 20 }, () => getRandomColor());

    // result
    expect(new Set(colors).size).toBeGreaterThan(1);
  });
});
