
import { useRoute } from "wouter";
import { products } from "@/lib/mockData";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Heart, Share2, Truck, ShieldCheck, RefreshCw, Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/product/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 mb-24">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-muted rounded-xl overflow-hidden border border-border/50 sticky top-24">
              <img 
                src={product.image} 
                alt={product.name} 
                className="h-full w-full object-cover"
              />
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
              <div className="flex items-center gap-4 mb-6">
                 <div className="flex text-yellow-500">
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" />
                    <Star size={18} fill="currentColor" className="opacity-50" />
                 </div>
                 <span className="text-sm text-muted-foreground">(124 reviews)</span>
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-medium">${product.price.toFixed(2)}</span>
                <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">In Stock</span>
              </div>
            </div>

            <div className="prose prose-stone max-w-none text-muted-foreground leading-relaxed">
              <p>{product.description}</p>
              <p>Experience the perfect blend of style and functionality. Crafted with premium materials and designed for the modern lifestyle, this product delivers exceptional quality and performance that lasts.</p>
            </div>

            <div className="space-y-6 pt-6 border-t border-border">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-input rounded-md w-fit">
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
                <Button variant="outline" size="icon" className="h-12 w-12 shrink-0">
                  <Heart size={20} />
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                12 people are viewing this product right now
              </div>
            </div>

            {/* Tabs for Detail, Specs, Reviews */}
            <div className="pt-8">
               <Tabs defaultValue="details" className="w-full">
                  <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0 h-auto">
                    <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-3">Details</TabsTrigger>
                    <TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-3">Shipping & Returns</TabsTrigger>
                    <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-3">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details" className="pt-6 space-y-4">
                    <h3 className="font-serif font-bold text-lg">Product Specifications</h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                       <li>Premium grade materials sourced ethically</li>
                       <li>Hand-finished details for unique character</li>
                       <li>Designed in our Studio in New York</li>
                       <li>Water-resistant coating included</li>
                       <li>Dimensions: 12" x 8" x 4"</li>
                    </ul>
                  </TabsContent>
                  
                  <TabsContent value="shipping" className="pt-6">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Shipping Information</AccordionTrigger>
                        <AccordionContent>
                          We offer free standard shipping on all orders over $50. Orders are typically processed within 1-2 business days. You will receive a tracking number via email once your package has shipped.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Return Policy</AccordionTrigger>
                        <AccordionContent>
                          We accept returns within 30 days of delivery. Items must be unused and in their original packaging. Return shipping is free for all domestic orders.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="pt-6 space-y-6">
                     <div className="flex items-center justify-between">
                        <h3 className="font-serif font-bold text-lg">Customer Reviews</h3>
                        <Button variant="outline" size="sm">Write a Review</Button>
                     </div>
                     
                     {[1, 2].map((review) => (
                       <div key={review} className="border-b border-border pb-6 last:border-0">
                          <div className="flex items-center gap-3 mb-2">
                             <Avatar className="h-8 w-8">
                               <AvatarFallback>JD</AvatarFallback>
                             </Avatar>
                             <div>
                                <p className="text-sm font-medium">Jane Doe</p>
                                <div className="flex text-yellow-500">
                                  <Star size={12} fill="currentColor" />
                                  <Star size={12} fill="currentColor" />
                                  <Star size={12} fill="currentColor" />
                                  <Star size={12} fill="currentColor" />
                                  <Star size={12} fill="currentColor" />
                                </div>
                             </div>
                             <span className="text-xs text-muted-foreground ml-auto">2 days ago</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                             Absolutely love this product! The quality is unmatched and it looks even better in person than in the photos. Highly recommend to anyone on the fence.
                          </p>
                       </div>
                     ))}
                  </TabsContent>
               </Tabs>
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
