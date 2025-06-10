import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Pagination from './Pagination'
import { getBaseUrl } from '@/lib/api';

// Define the Post interface based on your Prisma model
interface Post {
  id: string;
  createdAt: string; // Will be serialized as string from API
  slug: string;
  title: string;
  desc: string;
  img?: string; // Optional field
  views: number;
  catSlug: string;
  userEmail: string;
  // Optional: Include related data if your API returns it
  cat?: {
    slug: string;
    title: string;
  };
  user?: {
    email: string;
    name?: string;
  };
}

interface CardListProps {
  page: number;
  cate: string;
}

interface GetDataResponse {
  posts: Post[];
  count: number;
}

const getData = async (page: number, cate: string): Promise<GetDataResponse> => {
  try {
    const baseUrl = getBaseUrl();
    const res = await fetch(`${baseUrl}/api/posts?page=${page}&cate=${cate || ""}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error('Failed to fetch posts:', res.status, res.statusText);
      throw new Error(`Failed to fetch posts: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error in getData:', error);
    return { posts: [], count: 0 };
  }
}

const CardList: React.FC<CardListProps> = async ({ page, cate }) => {
  const { posts, count } = await getData(page, cate);

  const postsPerPage = 4;
  const hasPrevious = postsPerPage * (page - 1) > 0;
  const hasNext = postsPerPage * (page - 1) + postsPerPage < count;

  if (posts.length === 0) {
    return (
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Recent Posts
        </h2>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
        Recent Posts
      </h2>

      {/* Posts List */}
      <div className="space-y-8">
        {posts.map((post: Post) => (
          <article key={post.id} className="flex flex-col md:flex-row gap-6">
            {/* Image */}
            <div className="w-full md:w-96 flex-shrink-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={post.img || '/placeholder-image.jpg'} // Handle optional image
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 320px"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              {/* Date and Category */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{(post.createdAt).substring(0, 10)}</span>
                <span>-</span>
                <span className="uppercase font-medium text-red-400">
                  {post.cat?.title || post.catSlug}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                {post.title}
              </h3>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {post.desc.substring(0, 60)}
              </p>

              {/* Read More */}
              <div className="pt-2">
                <Link
                  href={`/posts/${post.slug}`} // Use slug for URL
                  className="text-primary hover:text-primary/80 font-medium underline"
                >
                  Read More
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination - Moved outside and reduced gap */}
      <div className="mt-2">
        <Pagination page={page} hasPrevious={hasPrevious} hasNext={hasNext} />
      </div>
    </div>
  )
}

export default CardList