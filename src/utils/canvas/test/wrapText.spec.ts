// utils
import { wrapText } from '../wrapText';

// each character measures 10 units wide, so width thresholds are easy to reason about
const measureWidth = (text: string): number => text.length * 10;

describe('wrapText', () => {
  it('should keep a single short word on one line', () => {
    // result
    expect(wrapText(measureWidth, 'hello', 100)).toEqual(['hello']);
  });

  it('should wrap to a new line once the next word would overflow maxWidth', () => {
    // result — "hello world" is 110 units wide, over the 100-unit budget
    expect(wrapText(measureWidth, 'hello world', 100)).toEqual(['hello', 'world']);
  });

  it('should pack as many words as fit before wrapping', () => {
    // result — "one two" is 70 units (fits in 80), adding "three" would push past it
    expect(wrapText(measureWidth, 'one two three', 80)).toEqual(['one two', 'three']);
  });

  it('should keep an unbreakable word that alone exceeds maxWidth on its own line', () => {
    // result
    expect(wrapText(measureWidth, 'supercalifragilistic', 50)).toEqual(['supercalifragilistic']);
  });

  it('should treat an explicit newline as a forced line break, regardless of width', () => {
    // result
    expect(wrapText(measureWidth, 'hi\nthere', 1000)).toEqual(['hi', 'there']);
  });

  it('should preserve a blank line from consecutive newlines', () => {
    // result
    expect(wrapText(measureWidth, 'hi\n\nthere', 1000)).toEqual(['hi', '', 'there']);
  });

  it('should return a single blank line for empty content', () => {
    // result
    expect(wrapText(measureWidth, '', 100)).toEqual(['']);
  });
});
