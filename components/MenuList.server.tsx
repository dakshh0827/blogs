import ClientMenuList from '@/components/MenuList.client'
import type { Category, GetDataResponse } from '@/helpers/menuListTypes'

const getCategoriesWithCounts = async (): Promise<Category[]> => {
  const res = await fetch('http://localhost:3000/api/category-with-counts', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch categories with counts');
  return res.json();
}

const getCategoryData = async (): Promise<Category[]> => {
  const res = await fetch('http://localhost:3000/api/category', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

const getPostsData = async (page: number, cate: string): Promise<GetDataResponse> => {
  const res = await fetch(`http://localhost:3000/api/posts?page=${page}&cate=${cate || ''}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export default async function MenuList() {
  try {
    const categoriesWithCounts = await getCategoriesWithCounts();
    const topCategories = categoriesWithCounts
      .sort((a, b) => (b._count?.Posts || 0) - (a._count?.Posts || 0))
      .slice(0, 4);
    const topTwoCategories = topCategories.slice(0, 2);
    const allCategories = await getCategoryData();

    const popularPostsResults = await Promise.all(
      topCategories.map(category => getPostsData(1, category.slug))
    );
    const editorsPickResults = await Promise.all(
      topTwoCategories.map(category => getPostsData(1, category.slug))
    );

    return (
      <ClientMenuList
        topCategories={topCategories}
        topTwoCategories={topTwoCategories}
        allCategories={allCategories}
        popularPostsResults={popularPostsResults}
        editorsPickResults={editorsPickResults}
      />
    );
  } catch (error) {
    console.error('Error loading menu data:', error);
    return (
      <div className="space-y-8">
        <div className="text-center text-red-500">
          Failed to load menu data. Please try again later.
        </div>
      </div>
    );
  }
}
