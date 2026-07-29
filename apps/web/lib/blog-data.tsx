import { BLOG_POSTS_1 } from './blog-data-1';
import { BLOG_POSTS_2 } from './blog-data-2';
import { BLOG_POSTS_3 } from './blog-data-3';
import { BLOG_POSTS_4 } from './blog-data-4';
import { BLOG_POSTS_5 } from './blog-data-5';
import { BLOG_POSTS_6 } from './blog-data-6';
import { BLOG_POSTS_7 } from './blog-data-7';
import { BlogPost } from './blog-data-types';

export type { BlogPost };

export const BLOG_POSTS: BlogPost[] = [
  ...BLOG_POSTS_1,
  ...BLOG_POSTS_2,
  ...BLOG_POSTS_3,
  ...BLOG_POSTS_4,
  ...BLOG_POSTS_5,
  ...BLOG_POSTS_6,
  ...BLOG_POSTS_7,
];

export function getPostById(id: string): BlogPost | undefined {
  return BLOG_POSTS.find(post => post.id === id);
}
