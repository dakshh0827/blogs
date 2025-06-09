// types.ts

export interface Category {
  id: string;
  slug: string;
  title: string;
  img?: string;
  _count?: {
    Posts: number;
  };
}

export interface Post {
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

export interface GetDataResponse {
  posts: Post[];
  count: number;
}
