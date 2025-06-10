import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { getBaseUrl } from '@/lib/api';

interface Category {
  id: string;
  slug: string;
  title: string;
  img?: string;
}

const getData = async (): Promise<Category[]> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/category`, {
      method: 'GET',
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return []; // Return empty array as fallback
  }
};

const colorPalette = [
  { bg: 'bg-blue-200', text: 'text-blue-800' },
  { bg: 'bg-red-200', text: 'text-red-800' },
  { bg: 'bg-green-200', text: 'text-green-800' },
  { bg: 'bg-orange-200', text: 'text-orange-800' },
  { bg: 'bg-yellow-200', text: 'text-yellow-800' },
  { bg: 'bg-purple-200', text: 'text-purple-800' },
];

const getShuffledColors = (itemCount: number) => {
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
};

const CategoryList = async () => {
  const categories: Category[] = await getData();
  const shuffledColors = getShuffledColors(categories.length);

  if (categories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 md:py-12">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Popular Categories
          </h1>
          <p className="text-muted-foreground">Categories are currently unavailable.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          Popular Categories
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((item, index) => {
            const colorScheme = shuffledColors[index];

            return (
              <Link
                key={item.id}
                href={`/blog?cate=${encodeURIComponent(item.slug)}`}
                className={`flex items-center justify-center gap-2 px-4 py-4 md:px-6 md:py-5 rounded-md ${colorScheme.bg} ${colorScheme.text} hover:opacity-80 transition-opacity w-full`}
              >
                {item.img && (
                  <Image
                    src={item.img}
                    alt={item.title}
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                )}
                <span className="font-medium text-sm md:text-base">
                  {item.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;