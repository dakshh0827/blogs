import ClientMenuList from '@/components/MenuList.client'
import type { Category, GetDataResponse } from '@/helpers/menuListTypes'
import { getBaseUrl } from '@/lib/api';

const getCategoriesWithCounts = async (): Promise<Category[]> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/category-with-counts`, { 
      method: 'GET', 
      cache: 'no-store' 
    });
    if (!res.ok) throw new Error(`Failed to fetch categories with counts: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error('Error fetching categories with counts:', error);
    return [];
  }
}

const getCategoryData = async (): Promise<Category[]> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/category`, { 
      method: 'GET',
      cache: 'no-store' 
    });
    if (!res.ok) throw new Error(`Failed to fetch categories: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error('Error fetching category data:', error);
    return [];
  }
}

const getPostsData = async (page: number, cate: string): Promise<GetDataResponse> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/posts?page=${page}&cate=${cate || ''}`, { 
      method: 'GET',
      cache: 'no-store' 
    });
    if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error('Error fetching posts data:', error);
    return { posts: [], count: 0 };
  }
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