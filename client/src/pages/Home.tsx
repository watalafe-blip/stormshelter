
import Layout from '@/components/layout/Layout';
import HeroSlider from '@/components/home/HeroSlider';
import CategoryGrid from '@/components/home/CategoryGrid';
import ServiceFeatures from '@/components/home/ServiceFeatures';
import ProductCard from '@/components/product/ProductCard';
import { products } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const topPicks = products.filter(p => p.isTopPick);
  const newArrivals = products.filter(p => p.isNew);

  return (
    <Layout>
      <HeroSlider />
      
      <section className="py-16 container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">Shop by Category</h2>
            <p className="text-muted-foreground">Browse our curated collections.</p>
          </div>
        </div>
        <CategoryGrid />
      </section>

      <ServiceFeatures />

      <section className="py-16 container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">Our Top Picks</h2>
            <p className="text-muted-foreground">Hand-selected favorites just for you.</p>
          </div>
          <Button variant="link" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topPicks.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
          {/* Duplicating for grid fill demo */}
          {topPicks.slice(0, 1).map((product, i) => (
             <ProductCard key={`dup-${i}`} product={{...product, id: `dup-${product.id}`}} />
          ))}
        </div>
      </section>

      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-4xl font-serif font-bold mb-6">Join the Luxe Club</h2>
          <p className="text-lg text-gray-300 mb-8">
            Sign up for our newsletter and receive 15% off your first order, plus exclusive access to new arrivals and members-only sales.
          </p>
          <div className="flex max-w-md mx-auto gap-2">
             <input 
               type="email" 
               placeholder="Enter your email address" 
               className="flex-1 bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
             />
             <Button className="bg-white text-black hover:bg-white/90">Subscribe</Button>
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-4">
         <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">New Arrivals</h2>
            <p className="text-muted-foreground">The latest trends, hot off the press.</p>
          </div>
          <Button variant="link" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
           {products.slice(0, 2).map((product, i) => (
             <ProductCard key={`new-dup-${i}`} product={{...product, id: `new-dup-${product.id}`}} />
          ))}
        </div>
      </section>
    </Layout>
  );
}
