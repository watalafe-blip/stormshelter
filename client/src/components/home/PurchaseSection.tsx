import { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Check, AlertTriangle, CreditCard, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Link } from 'wouter';

export default function PurchaseSection() {
  const { products } = useStore();
  const { toast } = useToast();
  const [zipCode, setZipCode] = useState('');
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Hardcoded to the main shelter product for this focused landing page
  const product = products.find(p => p.id === 'shelter-001') || products[0];
  
  const depositAmount = (product as any).deposit || 500;
  const remainingBalance = product.price - depositAmount;

  const handleCalculateShipping = async () => {
    if (!zipCode || zipCode.length < 5) {
      toast({
        title: "Invalid Zip Code",
        description: "Please enter a valid 5-digit zip code.",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Mock calculation logic based on distance from Missouri (simulated)
      // Base rate $500 + random distance factor
      const simulatedDistance = Math.floor(Math.random() * 800) + 100;
      const ratePerMile = 6;
      const cost = simulatedDistance * ratePerMile;
      
      setShippingCost(cost);
      setIsCalculating(false);
      
      toast({
        title: "Shipping Estimate Calculated",
        description: `Estimated distance: ${simulatedDistance} miles from Missouri factory.`,
      });
    }, 1500);
  };

  if (!product) return null;

  return (
    <section id="purchase" className="py-24 bg-[#fdfaf5] relative overflow-hidden">
      {/* Background Decorative Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E69138]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-[#3E2723] mb-4">
            Secure Your Legacy
          </h2>
          <p className="text-xl text-muted-foreground">
            Production slots are filling fast. Lock in your delivery date today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Features Column */}
          <div className="space-y-6 lg:pt-10">
            <h3 className="text-xl font-bold text-[#3E2723] flex items-center gap-2">
              <ShieldCheck className="text-[#E69138]" /> Standard Inclusions
            </h3>
            <ul className="space-y-4">
              {[
                '10-Year Structural Warranty',
                'FEMA 320 & ICC 500 Certified',
                'Made in USA (Missouri)',
                'Expert Support Included'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-stone-600">
                  <div className="w-6 h-6 rounded-full bg-[#E69138]/10 flex items-center justify-center shrink-0">
                    <Check size={14} className="text-[#E69138]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            
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
                 <div className="flex justify-between items-center bg-stone-50 p-3 rounded-lg">
                    <span className="font-bold text-stone-700">Deposit Due Today:</span>
                    <span className="text-3xl font-bold text-[#3E2723]">${depositAmount}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm text-muted-foreground px-2">
                    <span>Remaining Balance (due before shipping):</span>
                    <span className={shippingCost ? "font-bold text-[#E69138]" : ""}>
                      ${(remainingBalance + (shippingCost || 0)).toLocaleString()}
                      {shippingCost ? " (inc. shipping)" : " + shipping"}
                    </span>
                 </div>
                 
                 <div className="bg-stone-100 p-3 rounded-lg">
                   <div className="flex gap-2">
                     <div className="relative flex-1">
                       <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                       <Input 
                         placeholder="Zip code" 
                         className="pl-9 bg-white text-sm h-9" 
                         value={zipCode}
                         onChange={(e) => setZipCode(e.target.value)}
                         maxLength={5}
                       />
                     </div>
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={handleCalculateShipping}
                       disabled={isCalculating}
                       className="border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-white"
                     >
                       {isCalculating ? '...' : 'Shipping'}
                     </Button>
                   </div>
                   {shippingCost !== null && (
                     <div className="mt-2 text-center text-sm">
                       <span className="text-stone-600">Est. shipping: </span>
                       <span className="font-bold text-[#3E2723]">${shippingCost.toLocaleString()}</span>
                     </div>
                   )}
                 </div>
              </div>

              <div className="space-y-3">
                <Link href="/booking">
                  <Button 
                    className="w-full h-16 text-xl font-bold bg-[#E69138] hover:bg-[#D4842F] text-[#3E2723] shadow-lg hover:shadow-xl transition-all"
                  >
                    Secure My Spot
                  </Button>
                </Link>
                
                <div className="text-center space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    We Accept
                  </p>
                  <div className="flex justify-center gap-3 opacity-70">
                    <div className="flex items-center gap-1 text-xs font-bold text-stone-600 bg-stone-100 px-2 py-1 rounded">
                      <CreditCard size={12} /> Credit Cards
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-stone-600 bg-stone-100 px-2 py-1 rounded">
                      <span>🏦</span> Wire Transfer
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Warning / Info Column */}
          <div className="space-y-6 lg:pt-10">
             <Alert className="bg-stone-50 border-stone-200 text-stone-800">
                <AlertTriangle className="h-4 w-4 text-stone-600" />
                <AlertTitle className="text-stone-800 font-bold">Important Requirement</AlertTitle>
                <AlertDescription className="text-stone-600 text-sm mt-2 leading-relaxed">
                   <strong>Customer Unloading Required.</strong> <br/>
                   You must have a forklift or crane available at the delivery site to unload the unit (approx. 12,000 lbs). The driver cannot unload it for you.
                </AlertDescription>
             </Alert>

             <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                <h4 className="font-bold text-stone-800 mb-2">Why a Non-Refundable Deposit?</h4>
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