import { BlogPost } from '@/lib/mockData';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function BlogContent({ post }: { post: BlogPost }) {
  return (
    <article className="max-w-3xl mx-auto">
      <Link href="/blog">
        <button className="inline-flex items-center gap-2 text-stone-600 hover:text-[#E69138] transition-colors mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </button>
      </Link>

      <img 
        src={post.image} 
        alt={post.title} 
        className="w-full h-auto rounded-xl mb-8 shadow-lg"
      />

      <h1 className="text-4xl md:text-5xl font-bold text-[#3E2723] leading-tight mb-6">
        {post.title}
      </h1>

      <div className="flex items-center gap-4 text-sm text-stone-500 mb-8">
        <span>By {post.author}</span>
        <span className="h-1 w-1 bg-stone-300 rounded-full"></span>
        <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
      </div>

      <div 
        className="prose prose-lg prose-stone max-w-none text-stone-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}