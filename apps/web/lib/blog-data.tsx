import { BLOG_POSTS_1 } from './blog-data-1';
import { BLOG_POSTS_2 } from './blog-data-2';
import { BLOG_POSTS_3 } from './blog-data-3';
import { BlogPost } from './blog-data-types';

export type { BlogPost };

export const BLOG_POSTS: BlogPost[] = [
  ...BLOG_POSTS_1,
  ...BLOG_POSTS_2,
  ...BLOG_POSTS_3,
];

export function getPostById(id: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.id === id);
}
