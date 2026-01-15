import Layout from '@/components/layout/Layout';
import BlogCard from '@/components/blog/BlogCard';
import { blogPosts } from '@/lib/mockData';

export default function Blog() {
  return (
    <Layout>
      <div className="bg-stone-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-4">
              Our Blog
            </h1>
            <p className="text-lg text-stone-600">
              Insights, tips, and stories about storm shelter safety, installation, and peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}