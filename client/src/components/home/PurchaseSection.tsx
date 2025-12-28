import { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Truck, Check, AlertTriangle, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';

export default function PurchaseSection() {
  const { products } = useStore();
  const { toast } = useToast();
  
  // Hardcoded to the main shelter product for this focused landing page
  const product = products.find(p => p.id === 'shelter-001') || products[0];
  
  const depositAmount = (product as any).deposit || 500;
  const remainingBalance = product.price - depositAmount;

  const handlePurchase = () => {
    toast({
      title: "Deposit Added to Cart",
      description: "Proceeding to secure checkout...",
    });
    // In a real app, this would redirect to checkout
  };

  if (!product) return null;

  return (
    <section id="purchase" className="py-24 bg-[#fdfaf5] relative overflow-hidden">
      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFD700]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-[#3E2723] mb-4">
            Secure Your Legacy
          </h2>
          <p className="text-xl text-muted-foreground">
            Production slots for the 2025 season are filling fast. Lock in your delivery date today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Features Column */}
          <div className="space-y-6 lg:pt-10">
            <h3 className="text-xl font-bold text-[#3E2723] flex items-center gap-2">
              <ShieldCheck className="text-[#FFD700]" /> Standard Inclusions
            </h3>
            <ul className="space-y-4">
              {[
                '10-Year Structural Warranty',
                'FEMA 320 & ICC 500 Certified',
                'Made in USA (Missouri)',
                'Dedicated Project Manager',
                'Installation Guide Included'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-stone-600">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Check size={14} className="text-green-600" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-8">
              <h4 className="font-bold text-blue-900 mb-1 flex items-center gap-2">
                <Truck size={16} /> Shipping Estimate
              </h4>
              <p className="text-sm text-blue-800/80">
                Ships from Missouri. Standard rate is $4/mile one-way. Calculated precisely at final invoice.
              </p>
            </div>
          </div>

          {/* Main Card */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-1 bg-white rounded-2xl shadow-2xl border-2 border-[#3E2723] overflow-hidden relative"
          >
            <div className="bg-[#3E2723] text-white py-3 text-center text-sm font-bold uppercase tracking-wider">
              Most Popular Choice
            </div>
            
            <div className="p-8 space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-[#3E2723]">{product.name}</h3>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-lg text-muted-foreground line-through">${product.compareAtPrice?.toLocaleString()}</span>
                  <span className="text-5xl font-extrabold text-[#3E2723]">${product.price.toLocaleString()}</span>
                </div>
                <p className="text-green-600 font-bold text-sm">Save ${(product.compareAtPrice! - product.price).toLocaleString()} Today</p>
              </div>

              <div className="space-y-4 pt-4 border-t border-dashed border-gray-200">
                 <div className="flex justify-between items-center">
                    <span className="font-medium text-stone-600">Deposit Due Now:</span>
                    <span className="text-3xl font-bold text-[#3E2723]">${depositAmount}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Balance at Shipping:</span>
                    <span>${remainingBalance.toLocaleString()}</span>
                 </div>
              </div>

              <Button 
                onClick={handlePurchase} 
                className="w-full h-16 text-xl font-bold bg-[#FFD700] hover:bg-[#FBC02D] text-[#3E2723] shadow-lg hover:shadow-xl transition-all"
              >
                Secure My Shelter
              </Button>
              
              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                <CreditCard size={12} /> 100% Secure Payment Processing
              </p>
            </div>
          </motion.div>

          {/* Warning / Info Column */}
          <div className="space-y-6 lg:pt-10">
             <Alert className="bg-orange-50 border-orange-200 text-[#3E2723]">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertTitle className="text-orange-800 font-bold">Important Requirement</AlertTitle>
                <AlertDescription className="text-orange-900/80 text-sm mt-2 leading-relaxed">
                   <strong>Customer Unloading Required.</strong> <br/>
                   You must have a forklift or crane available at the delivery site to unload the unit (approx. 12,000 lbs). The driver cannot unload it for you.
                </AlertDescription>
             </Alert>

             <div className="bg-stone-100 p-6 rounded-xl border border-stone-200">
                <h4 className="font-bold text-[#3E2723] mb-2">Why a Non-Refundable Deposit?</h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                   This deposit secures your raw materials and production slot in our casting schedule. This ensures we can maintain our delivery timelines for all customers.
                </p>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}