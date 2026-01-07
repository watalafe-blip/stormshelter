import { Link } from 'wouter';
import { BlogPost } from '@/lib/mockData';
import { format } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-stone-200 hover:shadow-md transition-all duration-300">
      <Link href={`/blog/${post.slug}`}>
        <div className="aspect-video overflow-hidden cursor-pointer">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-3 text-sm text-stone-500">
          <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
          <span className="h-1 w-1 bg-stone-300 rounded-full"></span>
          <span>{post.author}</span>
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h3 className="text-xl font-bold text-[#3E2723] leading-tight hover:underline cursor-pointer">
            {post.title}
          </h3>
        </Link>
        <p className="text-stone-600 text-sm line-clamp-3">
          {post.excerpt}
        </p>
        <Link href={`/blog/${post.slug}`}>
          <Button variant="link" className="px-0 text-[#E69138] hover:text-[#D4842F] font-semibold">
            Read More <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}