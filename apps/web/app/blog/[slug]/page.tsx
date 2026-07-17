import React from 'react';
import { getPostById } from '@/lib/blog-data';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PublicNavbar from '@/components/PublicNavbar';
import ShareButton from '@/components/ShareButton';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostById(slug);
  
  if (!post) {
    return { title: 'Post Not Found' };
  }
  
  return {
    title: `${post.title} | SigmaSpire Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostById(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans relative pb-24">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px]" />
      </div>

      <PublicNavbar />

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-36">
        
        {/* Top bar with back and share buttons */}
        <div className="mb-10 border-b border-white/5 pb-5 flex justify-between items-center">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold"
          >
            <ArrowLeft size={16} /> Back to Articles
          </Link>
          <ShareButton title={post.title} />
        </div>

        {/* Title & Category Info */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 items-center text-sm text-gray-500 mb-6">
            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3.5 py-1 rounded-full font-bold uppercase tracking-wider">{post.category}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {post.title}
          </h1>
        </div>

        {/* Body Content */}
        <div className="border-t border-white/5 pt-10 text-lg blog-content">
          {post.content}
        </div>

        {/* Tags Footer */}
        <div className="border-t border-white/5 pt-8 mt-12 flex flex-wrap gap-2 items-center">
          <span className="text-gray-500 text-sm font-bold mr-2">Tags:</span>
          {post.tags.map(tag => (
            <span key={tag} className="bg-white/5 border border-white/5 text-gray-400 text-xs px-3 py-1 rounded-md font-medium">#{tag}</span>
          ))}
        </div>

      </div>
    </div>
  );
}
