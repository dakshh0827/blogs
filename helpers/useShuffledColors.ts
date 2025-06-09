'use client'

const colorPalette = [
  { bg: 'bg-blue-200', text: 'text-blue-800' },
  { bg: 'bg-red-200', text: 'text-red-800' },
  { bg: 'bg-green-200', text: 'text-green-800' },
  { bg: 'bg-orange-200', text: 'text-orange-800' },
  { bg: 'bg-yellow-200', text: 'text-yellow-800' },
  { bg: 'bg-purple-200', text: 'text-purple-800' }
];

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) & 0xffffffff;
  }
  return Math.abs(hash);
}

export function getDeterministicColors(categories: Array<{ id: string; slug: string; title: string }>) {
  return categories.map((category, index) => {
    const hash = simpleHash(category.slug + category.id);
    const colorIndex = (hash + index) % colorPalette.length;
    return colorPalette[colorIndex];
  });
}

export function getIndexBasedColors(itemCount: number) {
  const colors = [];
  for (let i = 0; i < itemCount; i++) {
    colors.push(colorPalette[i % colorPalette.length]);
  }
  return colors;
}

export function useShuffledColors(itemCount: number) {
  return getIndexBasedColors(itemCount);
}