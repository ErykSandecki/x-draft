const getRandomChannel = (): string => Math.floor(Math.random() * 256).toString(16).padStart(2, '0');

export const getRandomColor = (): string => `#${getRandomChannel()}${getRandomChannel()}${getRandomChannel()}`;
