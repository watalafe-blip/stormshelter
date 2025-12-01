
import { useRoute } from "wouter";
import { products } from "@/lib/mockData";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Heart, Share2, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/product/ProductCard";

export default function ProductDetail() {
  const [, params] = useRoute("/product/:id");
  const product = products.find((p) => p.id === params?.id) || products[0];
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const handleAddToCart = () => {
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-muted rounded-xl overflow-hidden border border-border/50">
              <img 
                src={product.image} 
                alt={product.name} 
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className={`aspect-square rounded-lg overflow-hidden border cursor-pointer ${i === 0 ? 'border-black ring-1 ring-black' : 'border-border hover:border-gray-400'}`}>
                  <img src={product.image} className="h-full w-full object-cover" alt="Thumbnail" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{product.category}</span>
                {product.isNew && <span className="bg-secondary text-secondary-foreground text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">New Arrival</span>}
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">{product.name}</h1>
              <div className="flex items-baseline gap-4">
                <span className="text-2xl font-medium">${product.price.toFixed(2)}</span>
                <span className="text-sm text-green-600 font-medium">In Stock</span>
              </div>
            </div>

            <div className="prose prose-stone max-w-none text-muted-foreground leading-relaxed">
              <p>{product.description}</p>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-border">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-input rounded-md">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-muted transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <Button onClick={handleAddToCart} size="lg" className="flex-1 h-12 text-base">
                  Add to Cart - ${(product.price * quantity).toFixed(2)}
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Heart size={20} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-lg gap-2">
                <Truck className="text-muted-foreground" size={24} />
                <span className="text-xs font-medium">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-lg gap-2">
                <ShieldCheck className="text-muted-foreground" size={24} />
                <span className="text-xs font-medium">2 Year Warranty</span>
              </div>
              <div className="flex flex-col items-center text-center p-4 bg-muted/30 rounded-lg gap-2">
                <RefreshCw className="text-muted-foreground" size={24} />
                <span className="text-xs font-medium">30 Day Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-border pt-16">
            <h2 className="text-3xl font-serif font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
