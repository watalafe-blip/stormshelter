
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/product/ProductCard';
import { products, categories } from '@/lib/mockData';
import { useRoute } from 'wouter';

export default function Shop() {
  const [, params] = useRoute('/shop/:category?');
  const categoryId = params?.category;
  
  const filteredProducts = categoryId 
    ? products.filter(p => p.category === categoryId)
    : products;

  const categoryName = categoryId 
    ? categories.find(c => c.id === categoryId)?.name 
    : 'All Products';

  return (
    <Layout>
      <div className="bg-muted/30 py-12 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">{categoryName}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our collection of premium goods designed for the modern lifestyle.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          {/* Duplicate for demo volume */}
          {filteredProducts.length < 4 && products.slice(0, 4).map((p, i) => (
             <ProductCard key={`fill-${i}`} product={{...p, id: `fill-${p.id}`}} />
          ))}
        </div>
      </div>
    </Layout>
  );
}
