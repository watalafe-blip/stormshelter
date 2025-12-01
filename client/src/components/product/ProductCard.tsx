
import { Link } from 'wouter';
import { Product } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative bg-card rounded-lg overflow-hidden border border-transparent hover:border-border/50 transition-all duration-300">
      <div className="aspect-[3/4] overflow-hidden bg-muted relative">
        <Link href={`/product/${product.id}`}>
          <img 
            src={product.image} 
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 cursor-pointer"
          />
        </Link>
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full uppercase tracking-wider font-medium">
            New
          </span>
        )}
        {product.isTopPick && (
          <span className="absolute top-3 right-3 bg-white/90 text-black text-xs px-2 py-1 rounded-full uppercase tracking-wider font-medium backdrop-blur">
            Top Pick
          </span>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent pt-12">
          <Button className="w-full gap-2 bg-white text-black hover:bg-white/90 shadow-lg border-none">
            <ShoppingBag size={16} /> Quick Add
          </Button>
        </div>
      </div>
      
      <div className="p-4 space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif font-medium text-lg hover:underline cursor-pointer line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="font-medium text-foreground">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
