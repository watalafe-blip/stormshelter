import Layout from '@/components/layout/Layout';
import BlogContent from '@/components/blog/BlogContent';
import { blogPosts } from '@/lib/mockData';
import { useRoute } from 'wouter';
import NotFound from '@/pages/not-found';

export default function BlogPost() {
  const [, params] = useRoute('/blog/:slug');
  const post = blogPosts.find((p) => p.slug === params?.slug);

  if (!post) {
    return <NotFound />;
  }

  return (
    <Layout>
      <div className="bg-stone-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <BlogContent post={post} />
        </div>
      </div>
    </Layout>
  );
}