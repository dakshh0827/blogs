'use client'

const colorPalette = [
  { bg: 'bg-blue-200', text: 'text-blue-800' },
  { bg: 'bg-red-200', text: 'text-red-800' },
  { bg: 'bg-green-200', text: 'text-green-800' },
  { bg: 'bg-orange-200', text: 'text-orange-800' },
  { bg: 'bg-yellow-200', text: 'text-yellow-800' },
  { bg: 'bg-purple-200', text: 'text-purple-800' }
];

export function useShuffledColors(itemCount: number) {
  const shuffledColors = [];
  const availableColors = [...colorPalette];

  for (let i = 0; i < itemCount; i++) {
    if (availableColors.length === 0) {
      availableColors.push(...colorPalette);
    }

    const randomIndex = Math.floor(Math.random() * availableColors.length);
    const selectedColor = availableColors[randomIndex];

    shuffledColors.push(selectedColor);
    availableColors.splice(randomIndex, 1);
  }

  return shuffledColors;
}
