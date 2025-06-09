'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShuffledColors } from '@/helpers/useShuffledColors';

interface Category {
  id: string;
  slug: string;
  title: string;
  img?: string;
  _count?: { Posts: number };
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
  cat?: { slug: string; title: string };
  user?: { email: string; name?: string };
}

interface GetDataResponse {
  posts: Post[];
  count: number;
}

interface MenuListProps {
  topCategories: Category[];
  topTwoCategories: Category[];
  allCategories: Category[];
  popularPostsResults: GetDataResponse[];
  editorsPickResults: GetDataResponse[];
}

export default function ClientMenuList({
  topCategories,
  topTwoCategories,
  allCategories,
  popularPostsResults,
  editorsPickResults,
}: MenuListProps) {
  const categoryColors = useShuffledColors(allCategories.length);
  const popularColors = useShuffledColors(topCategories.length);
  const editorColors = useShuffledColors(topTwoCategories.length);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* What's Hot - Most Popular Section */}
      <div className="pt-6 pb-6">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-1">What&apos;s hot</p>
          <h3 className="text-xl font-bold text-foreground">Most Popular</h3>
        </div>

        <div className="space-y-4">
          {popularPostsResults.map((result, index) => {
            const post = result.posts[0];
            const category = topCategories[index];
            const colors = popularColors[index];

            if (!post) return null;

            return (
              <Link
                key={post.id}
                className="space-y-2"
                href={`/posts/${post.slug}`}
              >
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}
                >
                  {category.title}
                </span>
                <h4 className="text-sm font-medium text-foreground leading-tight">
                  {post.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {post.user?.name || post.userEmail} • {formatDate(post.createdAt)}
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
            const post = result.posts[0];
            const category = topTwoCategories[index];
            const colors = editorColors[index];

            if (!post) return null;

            return (
              <Link
                key={post.id}
                className="flex gap-3"
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
                  <span
                    className={`inline-block px-2 py-1 rounded text-xs font-medium ${colors.bg} ${colors.text}`}
                  >
                    {category.title}
                  </span>
                  <h4 className="text-sm font-medium text-foreground leading-tight">
                    {post.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {post.user?.name || post.userEmail} • {formatDate(post.createdAt)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
