import { useRoute, Link } from "wouter";
import { useStore } from "@/lib/storeContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Star, AlertTriangle, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ProductPricing from "@/components/ProductPricing";
import UrgencyTimer from "@/components/UrgencyTimer";
import { isGoogleShoppingVisitor, getDynamicPrice, getDiscount } from "@/lib/urlParams";

export default function ProductDetail() {
  const { products } = useStore();
  const [, params] = useRoute("/product/:id");
  const product = products.find((p) => p.id === params?.id) || products[0];
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  if (!product) return <div>Product not found</div>;

  const depositAmount = (product as any).deposit || 500;
  const remainingBalance = product.price - depositAmount;

  const handleAddToCart = () => {
    toast({
      title: "Deposit Added",
      description: `Deposit for ${product.name} added to cart.`,
    });
  };

  return (
    <Layout>
      <div className="bg-[#fdfaf5]">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
            <div className="space-y-4">
              <div className="aspect-[4/3] bg-white rounded-xl overflow-hidden border-2 border-[#3E2723]/10 shadow-lg sticky top-24">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#FFD700] text-[#3E2723] px-4 py-2 font-bold text-sm uppercase tracking-wider rounded shadow-md">
                  EF5 Rated
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-bold text-[#3E2723] uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck size={16} className="text-[#FFD700]" /> Home Defense Certified
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-sans font-extrabold text-[#3E2723] mb-4 leading-tight">{product.name}</h1>
                
                <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-lg border border-[#3E2723]/10 shadow-sm">
                   <div className="flex text-[#FFD700]">
                      <Star size={20} fill="currentColor" />
                      <Star size={20} fill="currentColor" />
                      <Star size={20} fill="currentColor" />
                      <Star size={20} fill="currentColor" />
                      <Star size={20} fill="currentColor" />
                   </div>
                   <span className="text-sm font-medium text-[#3E2723]">5.0 (24 Verified Owners)</span>
                </div>

                <div className="space-y-4 bg-white p-6 rounded-xl border-2 border-[#3E2723]/10 shadow-md">
                  {isGoogleShoppingVisitor() ? (
                    <>
                      <ProductPricing basePrice={product.price} />
                      <UrgencyTimer durationMinutes={15} />
                      <div className="bg-[#fefce8] border border-yellow-200 rounded-lg p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center border-b border-yellow-200 pb-2">
                          <span className="font-bold text-[#3E2723]">Reserve Now for Only:</span>
                          <span className="font-extrabold text-2xl text-[#3E2723]" data-testid="deposit-amount">
                            $500
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-[#3E2723]/80 pt-1">
                          <span>Total Price (with discount):</span>
                          <span data-testid="special-price">${getDynamicPrice(product.price).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-green-600 font-bold">
                          You save ${getDiscount()} with this exclusive offer!
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-baseline gap-3">
                          <span className="text-5xl font-extrabold text-[#3E2723]">${product.price.toLocaleString()}</span>
                          {product.compareAtPrice && (
                            <span className="text-xl text-muted-foreground line-through decoration-red-500/50">${product.compareAtPrice.toLocaleString()}</span>
                          )}
                        </div>
                        {product.compareAtPrice && (
                           <span className="text-sm font-bold text-green-600">You Save ${(product.compareAtPrice - product.price).toLocaleString()}</span>
                        )}
                      </div>

                      <div className="bg-[#fefce8] border border-yellow-200 rounded-lg p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center border-b border-yellow-200 pb-2">
                          <span className="font-bold text-[#3E2723]">Non-Refundable Deposit Today:</span>
                          <span className="font-extrabold text-2xl text-[#3E2723]">${depositAmount}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-[#3E2723]/80 pt-1">
                          <span>Remaining Balance (Due before ship):</span>
                          <span>${remainingBalance.toLocaleString()}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                 {!isGoogleShoppingVisitor() && (
                   <Alert className="bg-orange-50 border-orange-200 text-[#3E2723]">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertTitle className="text-orange-800 font-bold">Important Delivery Info</AlertTitle>
                      <AlertDescription className="text-orange-900/80 text-sm mt-1">
                         <ul className="list-disc list-inside space-y-1">
                            <li>Ships from Missouri ($4 per mile shipping fee outside MO)</li>
                            <li><strong>Customer responsible for unloading</strong> (Forklift/Crane required)</li>
                            <li>Installation services not included</li>
                         </ul>
                      </AlertDescription>
                   </Alert>
                 )}

                 <Link href="/booking">
                   <Button size="lg" className="w-full h-16 text-xl font-bold bg-[#E69138] hover:bg-[#D4842F] text-white shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1" data-testid="reserve-now-btn">
                      {isGoogleShoppingVisitor() ? 'Reserve Now - $500 Deposit' : `Secure Your Unit - Pay $${depositAmount} Deposit`}
                   </Button>
                 </Link>
                 
                 <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> Secure 256-bit SSL Encrypted Payment
                 </p>
              </div>

              <div className="prose prose-stone max-w-none text-[#3E2723]/80 leading-relaxed">
                <h3 className="text-[#3E2723] font-bold">Product Description</h3>
                <p className="whitespace-pre-line">{product.description}</p>
                
                <h4 className="text-[#3E2723] font-bold mt-4">Key Features:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-none pl-0">
                   <li className="flex items-center gap-2"><Check size={16} className="text-green-600"/> 6000 PSI Cured Concrete</li>
                   <li className="flex items-center gap-2"><Check size={16} className="text-green-600"/> Double Handrail Steps</li>
                   <li className="flex items-center gap-2"><Check size={16} className="text-green-600"/> 10-Year Warranty</li>
                   <li className="flex items-center gap-2"><Check size={16} className="text-green-600"/> Made in USA</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
