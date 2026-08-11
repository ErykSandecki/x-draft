export const wrapText = (context: CanvasRenderingContext2D, content: string, maxWidth: number): string[] => {
  const lines: string[] = [];

  content.split('\n').forEach((sourceLine) => {
    let currentLine = '';

    sourceLine.split(' ').forEach((word) => {
      const candidate = currentLine ? `${currentLine} ${word}` : word;

      if (currentLine && context.measureText(candidate).width > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = candidate;
      }
    });

    lines.push(currentLine);
  });

  return lines;
};
