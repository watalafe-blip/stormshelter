
import Layout from '@/components/layout/Layout';
import HeroSlider from '@/components/home/HeroSlider';
import CategoryGrid from '@/components/home/CategoryGrid';
import ServiceFeatures from '@/components/home/ServiceFeatures';
import ProductCard from '@/components/product/ProductCard';
import { useStore } from '@/lib/storeContext';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Home() {
  const { products, theme } = useStore();
  const topPicks = products.filter(p => p.isTopPick);
  const newArrivals = products.filter(p => p.isNew);

  // Helper to check if a section is enabled
  const isSectionEnabled = (id: string) => theme.homeLayout.find(s => s.id === id)?.enabled;
  // Helper to get order of sections
  const getSectionOrder = () => theme.homeLayout.filter(s => s.enabled);

  const renderSection = (section: any) => {
    switch (section.type) {
      case 'hero':
        return <HeroSlider key={section.id} />;
      case 'category-grid':
        return (
          <section key={section.id} className="py-16 container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className={`text-3xl font-bold mb-2 ${theme.typography.heading === 'serif' ? 'font-serif' : 'font-sans'}`}>
                  {section.title || 'Shop by Category'}
                </h2>
                <p className="text-muted-foreground">Browse our curated collections.</p>
              </div>
            </div>
            <CategoryGrid />
          </section>
        );
      case 'featured-products':
        return (
          <section key={section.id} className="py-16 container mx-auto px-4 bg-[#fdfaf5]">
             <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className={`text-3xl font-bold mb-2 text-[#3E2723] ${theme.typography.heading === 'serif' ? 'font-serif' : 'font-sans'}`}>
                  {section.title || 'Our Top Picks'}
                </h2>
                <p className="text-muted-foreground">Engineered for survival.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {topPicks.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      case 'image-text':
        return (
          <section key={section.id} className="py-20 container mx-auto px-4 overflow-hidden">
             <div className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-20 ${section.imagePosition === 'right' ? '' : 'lg:flex-row-reverse'}`}>
               <div className="flex-1 space-y-6">
                 <h2 className={`text-3xl md:text-4xl font-bold text-[#3E2723] ${theme.typography.heading === 'serif' ? 'font-serif' : 'font-sans'}`}>
                   {section.title}
                 </h2>
                 <p className="text-lg text-muted-foreground leading-relaxed">
                   {section.content}
                 </p>
                 {section.bullets && (
                   <ul className="space-y-3 mt-6">
                     {section.bullets.map((bullet: string, idx: number) => (
                       <li key={idx} className="flex items-start gap-3 text-[#3E2723]/90 font-medium">
                         <CheckCircle2 className="h-6 w-6 text-[#FFD700] shrink-0 fill-[#3E2723]" />
                         <span>{bullet}</span>
                       </li>
                     ))}
                   </ul>
                 )}
                 <Button className="mt-8 bg-[#3E2723] text-white hover:bg-[#5D4037]">
                   Learn More
                 </Button>
               </div>
               <div className="flex-1 w-full">
                 <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#3E2723]/10">
                   <img 
                     src={section.image} 
                     alt={section.title}
                     className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                   />
                 </div>
               </div>
             </div>
          </section>
        );
      case 'text-block':
        return (
          <section key={section.id} className="py-20 bg-[#3E2723] text-white">
            <div className="container mx-auto px-4 text-center max-w-4xl">
              <h2 className="text-3xl md:text-4xl font-sans font-bold mb-6 text-[#FFD700]">{section.title}</h2>
              <div className="text-lg md:text-xl leading-relaxed opacity-90">
                {section.content}
              </div>
              <div className="mt-8 flex justify-center gap-4 text-sm font-medium opacity-75">
                 <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#FFD700] rounded-full"></div> Requires Flatbed Truck</div>
                 <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#FFD700] rounded-full"></div> Heavy Equipment Needed</div>
              </div>
            </div>
          </section>
        );
      case 'newsletter':
        return (
          <section key={section.id} className="py-24 bg-stone-900 text-white">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <h2 className={`text-4xl font-bold mb-6 ${theme.typography.heading === 'serif' ? 'font-serif' : 'font-sans'}`}>
                Join the Vitality Club
              </h2>
              <p className="text-lg text-stone-300 mb-8">
                Sign up for our newsletter and receive expert wellness guides, early access to new technology, and exclusive member offers.
              </p>
              <div className="flex max-w-md mx-auto gap-2">
                 <input 
                   type="email" 
                   placeholder="Enter your email address" 
                   className="flex-1 bg-white/10 border border-white/20 rounded-md px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                 />
                 <Button className="bg-white text-stone-900 hover:bg-white/90">Subscribe</Button>
              </div>
            </div>
          </section>
        );
      case 'new-arrivals':
        return (
          <section key={section.id} className="py-16 container mx-auto px-4">
             <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className={`text-3xl font-bold mb-2 ${theme.typography.heading === 'serif' ? 'font-serif' : 'font-sans'}`}>
                  {section.title || 'New Arrivals'}
                </h2>
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
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      {getSectionOrder().map(section => renderSection(section))}
      <ServiceFeatures />
    </Layout>
  );
}
