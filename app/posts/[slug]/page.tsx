import React from 'react'
import PostPageTopContainer from '@/components/PostPageTopContainer'
import PostPageBottomContainer from '@/components/PostPageBottomContainer'
import { getBaseUrl } from '@/lib/api';

const getData = async (slug: string) => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/posts/${slug}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  return res.json();
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const Page = async ({ params }: PageProps) => {
  const { slug } = await params;
  const post = await getData(slug);
  console.log("post: ", post);
  console.log("slug: ", slug);
  
  return (
    <div>
      <PostPageTopContainer
        title={post.post.title}
        author={post.post.user?.name}
        date={post.post.createdAt}
        authorImage={post.post.user?.image || '/default-avatar.png'}
        blogImage={post.post.img || '/default-blog-image.jpg'}
      />
      <PostPageBottomContainer
        content={post.post.desc}
        postSlug={post.post.slug || ''}
      />
    </div>
  );
}

export default Page