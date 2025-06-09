import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Category {
  id: string;
  slug: string;
  title: string;
  img?: string;
  _count?: {
    Posts: number;
  };
}

interface Post {
  id: string;
  createdAt: string;
  slug: string;
  title: string;
  desc: string;
  img?: string;
  views: number;
  catSlug: string;
  userEmail: string;
  cat?: {
    slug: string;
    title: string;
  };
  user?: {
    email: string;
    name?: string;
  };
}

interface GetDataResponse {
  posts: Post[];
  count: number;
}

// Fetch categories with post counts
const getCategoriesWithCounts = async (): Promise<Category[]> => {
  const res = await fetch('http://localhost:3000/api/category-with-counts', {  
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories with counts');
  }

  return res.json();
}

// Fetch all categories
const getCategoryData = async (): Promise<Category[]> => {
  const res = await fetch('http://localhost:3000/api/category', {  
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch categories');
  }

  return res.json();
}

// Fetch posts by category
const getPostsData = async (page: number, cate: string): Promise<GetDataResponse> => {
  const res = await fetch(`http://localhost:3000/api/posts?page=${page}&cate=${cate || ""}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    console.log(res);
    throw new Error('Failed to fetch posts');
  }

  return res.json();
}

const colorPalette = [
  { bg: 'bg-blue-200', text: 'text-blue-800' },
  { bg: 'bg-red-200', text: 'text-red-800' },
  { bg: 'bg-green-200', text: 'text-green-800' },
  { bg: 'bg-orange-200', text: 'text-orange-800' },
  { bg: 'bg-yellow-200', text: 'text-yellow-800' },
  { bg: 'bg-purple-200', text: 'text-purple-800' }
];

const useShuffledColors = (itemCount: number) => {
  const shuffledColors = []
  const availableColors = [...colorPalette]
  
  for (let i = 0; i < itemCount; i++) {
    if (availableColors.length === 0) {
      availableColors.push(...colorPalette)
    }
    
    const randomIndex = Math.floor(Math.random() * availableColors.length)
    const selectedColor = availableColors[randomIndex]
    
    shuffledColors.push(selectedColor)
    availableColors.splice(randomIndex, 1)
  }
  
  return shuffledColors
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

const MenuList: React.FC = async () => {
  try {
    // Fetch categories with post counts
    const categoriesWithCounts = await getCategoriesWithCounts();
    
    // Sort categories by post count and get top 4 for popular posts
    const topCategories = categoriesWithCounts
      .sort((a, b) => (b._count?.Posts || 0) - (a._count?.Posts || 0))
      .slice(0, 4);
    
    // Get top 2 categories for editor's choice
    const topTwoCategories = topCategories.slice(0, 2);
    
    // Fetch all categories for the categories section
    const allCategories = await getCategoryData();
    
    // Fetch one post from each top category for popular posts
    const popularPostsPromises = topCategories.map(category => 
      getPostsData(1, category.slug)
    );
    const popularPostsResults = await Promise.all(popularPostsPromises);
    
    // Fetch one post from each top 2 categories for editor's choice
    const editorsPickPromises = topTwoCategories.map(category => 
      getPostsData(1, category.slug)
    );
    const editorsPickResults = await Promise.all(editorsPickPromises);
    
    // Prepare colors for categories
    const categoryColors = useShuffledColors(allCategories.length);
    const popularColors = useShuffledColors(topCategories.length);
    const editorColors = useShuffledColors(topTwoCategories.length);

    return (
      <div className="space-y-8">
        {/* What's Hot - Most Popular Section */}
        <div className="pt-6 pb-6">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">What's hot</p>
            <h3 className="text-xl font-bold text-foreground">Most Popular</h3>
          </div>

          <div className="space-y-4">
            {popularPostsResults.map((result, index) => {
              const post = result.posts[0]; // Get first post from each category
              const category = topCategories[index];
              const colors = popularColors[index];
              
              if (!post) return null;
              
              return (
                <Link key={post.id} className="space-y-2" 
                  href={`/posts/${post.slug}`}
                  >
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                    {category.title}
                  </span>
                  <h4 className="text-sm font-medium text-foreground leading-tight">
                    {post.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {post.user?.name || post.userEmail} • {(post.createdAt.substring(0, 10))}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Discover by Topic Section */}
        <div>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Discover by topic</p>
            <h3 className="text-xl font-bold text-foreground">Categories</h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {allCategories.map((category, index) => {
              const colors = categoryColors[index];
              return (
                <Link
                  key={category.id}
                  href={`/blog?cate=${encodeURIComponent(category.slug)}`}
                  className={`flex items-center justify-center px-3 py-2 rounded-sm text-sm font-medium ${colors.bg} ${colors.text} hover:opacity-80`}
                >
                  <span>{category.title}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Chosen by the Editor Section */}
        <div>
          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-1">Chosen by the editor</p>
            <h3 className="text-xl font-bold text-foreground">Editors Pick</h3>
          </div>

          <div className="space-y-4">
            {editorsPickResults.map((result, index) => {
              const post = result.posts[0]; // Get first post from each category
              const category = topTwoCategories[index];
              const colors = editorColors[index];
              
              if (!post) return null;
              
              return (
                <Link key={post.id} className="flex gap-3"
                  href={`/posts/${post.slug}`}
                  >
                  {/* Circular Image */} 
                  <div className="w-12 h-12 flex-shrink-0">
                    <div className="relative w-full h-full overflow-hidden rounded-full bg-gray-200">
                      {post.img ? (
                        <Image
                          src={post.img}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                      {category.title}
                    </span>
                    <h4 className="text-sm font-medium text-foreground leading-tight">
                      {post.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {post.user?.name || post.userEmail} • {(post.createdAt.substring(0, 10))}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
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

export default MenuList