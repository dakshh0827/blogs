import React from 'react'
import PostPageTopContainer from '@/components/PostPageTopContainer'
import PostPageBottomContainer from '@/components/PostPageBottomContainer'
import useSWR from 'swr'

const getData = async (slug: string) => {
  const res = await fetch(`http://localhost:3000/api/posts/${slug}`, {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }

  return res.json();
}

type PageProps = {
  params: {
    slug: string;
  };
};

const Page = async ({ params }: PageProps, postSlug: string) => {
  const { slug } = params;
  const post = await getData(slug);
  console.log("post: ", post);
  console.log("user: ", postSlug);
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
