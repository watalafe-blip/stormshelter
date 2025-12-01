
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { products } from '@/lib/mockData';
import { Link, useLocation } from 'wouter';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, CreditCard, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const { toast } = useToast();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Order Placed Successfully",
      description: "Redirecting to confirmation page...",
    });

    setTimeout(() => {
      setIsProcessing(false);
      setLocation('/confirmation');
    }, 500);
  };

  // Mock cart summary
  const subtotal = 558.00;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left Column: Form Section */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-4 mb-8">
               <Link href="/cart" className="text-muted-foreground hover:text-foreground">Cart</Link>
               <span className="text-muted-foreground">/</span>
               <span className="font-medium">Information</span>
               <span className="text-muted-foreground">/</span>
               <span className="text-muted-foreground">Shipping</span>
               <span className="text-muted-foreground">/</span>
               <span className="text-muted-foreground">Payment</span>
            </div>
            
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Contact */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">Contact</h2>
                  <Link href="/login" className="text-sm text-primary underline">Log in</Link>
                </div>
                <Input type="email" placeholder="Email or mobile phone number" required className="h-12" />
                <div className="flex items-center space-x-2">
                   <Checkbox id="newsletter" />
                   <Label htmlFor="newsletter" className="text-sm font-normal text-muted-foreground">Email me with news and offers</Label>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-4 pt-4">
                <h2 className="text-lg font-medium">Shipping address</h2>
                <Select>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Country/Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First name" required className="h-12" />
                  <Input placeholder="Last name" required className="h-12" />
                </div>
                <Input placeholder="Address" required className="h-12" />
                <Input placeholder="Apartment, suite, etc. (optional)" className="h-12" />
                <div className="grid grid-cols-3 gap-4">
                  <Input placeholder="City" className="col-span-1 h-12" required />
                  <Select>
                     <SelectTrigger className="h-12 col-span-1">
                       <SelectValue placeholder="State" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="ny">New York</SelectItem>
                       <SelectItem value="ca">California</SelectItem>
                       <SelectItem value="tx">Texas</SelectItem>
                     </SelectContent>
                  </Select>
                  <Input placeholder="ZIP code" className="col-span-1 h-12" required />
                </div>
                <Input placeholder="Phone" type="tel" required className="h-12" />
              </div>

              {/* Shipping Method */}
              <div className="space-y-4 pt-4">
                <h2 className="text-lg font-medium">Shipping method</h2>
                <RadioGroup defaultValue="free" className="space-y-0">
                  <div className="flex items-center justify-between p-4 border border-border rounded-t-lg has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="free" id="free" />
                      <Label htmlFor="free" className="font-medium cursor-pointer">Standard Shipping</Label>
                    </div>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border border-t-0 rounded-b-lg has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="font-medium cursor-pointer">Express Shipping</Label>
                    </div>
                    <span className="font-medium">$15.00</span>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment */}
              <div className="space-y-4 pt-4">
                <h2 className="text-lg font-medium">Payment</h2>
                <p className="text-sm text-muted-foreground mb-4">All transactions are secure and encrypted.</p>
                
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-0">
                  <div className={`border border-border rounded-t-lg overflow-hidden ${paymentMethod === 'credit_card' ? 'border-primary ring-1 ring-primary' : ''}`}>
                    <div className="p-4 flex items-center justify-between bg-background">
                       <div className="flex items-center space-x-2">
                         <RadioGroupItem value="credit_card" id="credit_card" />
                         <Label htmlFor="credit_card" className="font-medium cursor-pointer">Credit Card</Label>
                       </div>
                       <div className="flex gap-1">
                          {/* Simple card icons using divs for visual rep */}
                          <div className="w-8 h-5 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-bold">VISA</div>
                          <div className="w-8 h-5 bg-orange-500 rounded flex items-center justify-center text-[8px] text-white font-bold">MC</div>
                          <div className="w-8 h-5 bg-blue-400 rounded flex items-center justify-center text-[8px] text-white font-bold">AMEX</div>
                       </div>
                    </div>
                    
                    {paymentMethod === 'credit_card' && (
                      <div className="p-4 bg-muted/20 border-t border-border space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="relative">
                           <Input placeholder="Card number" required className="h-12 pl-10 bg-white" />
                           <CreditCard className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input placeholder="Expiration date (MM / YY)" required className="h-12 bg-white" />
                          <Input placeholder="Security code" required className="h-12 bg-white" />
                        </div>
                        <Input placeholder="Name on card" required className="h-12 bg-white" />
                        <div className="flex items-center space-x-2 mt-2">
                          <Checkbox id="save_card" />
                          <Label htmlFor="save_card" className="text-sm font-normal text-muted-foreground">Use shipping address as billing address</Label>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className={`border border-border border-t-0 rounded-b-lg overflow-hidden ${paymentMethod === 'debit_card' ? 'border-primary ring-1 ring-primary' : ''}`}>
                     <div className="p-4 flex items-center space-x-2 bg-background">
                        <RadioGroupItem value="debit_card" id="debit_card" />
                        <Label htmlFor="debit_card" className="font-medium cursor-pointer">Debit Card</Label>
                     </div>
                     {paymentMethod === 'debit_card' && (
                        <div className="p-4 bg-muted/20 border-t border-border space-y-4 animate-in slide-in-from-top-2 fade-in duration-200">
                          <div className="relative">
                             <Input placeholder="Debit Card number" required className="h-12 pl-10 bg-white" />
                             <Wallet className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                          </div>
                           <div className="grid grid-cols-2 gap-4">
                            <Input placeholder="Expiration date (MM / YY)" required className="h-12 bg-white" />
                            <Input placeholder="Security code" required className="h-12 bg-white" />
                          </div>
                          <Input placeholder="Name on card" required className="h-12 bg-white" />
                        </div>
                     )}
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" size="lg" className="w-full h-14 text-lg font-medium mt-6" disabled={isProcessing}>
                {isProcessing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : 'Pay Now'}
              </Button>
              
              <div className="flex justify-center gap-4 text-xs text-muted-foreground pt-4 border-t border-border">
                 <Link href="/refund-policy" className="underline">Refund policy</Link>
                 <Link href="/shipping-policy" className="underline">Shipping policy</Link>
                 <Link href="/privacy-policy" className="underline">Privacy policy</Link>
                 <Link href="/terms-of-service" className="underline">Terms of service</Link>
              </div>
            </form>
          </div>

          {/* Right Column: Order Summary Sidebar */}
          <div className="lg:col-span-2 pl-0 lg:pl-8 lg:border-l border-border">
            <div className="sticky top-24 space-y-6">
              <div className="space-y-4 max-h-[50vh] overflow-auto pr-2">
                {[products[0], products[1]].map((product) => (
                  <div key={product.id} className="flex gap-4 items-center">
                    <div className="relative h-16 w-16 bg-white rounded-md border border-border overflow-hidden shrink-0">
                      <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">1</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-2">{product.name}</h4>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <span className="text-sm font-medium whitespace-nowrap">${product.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                 <div className="flex gap-2">
                    <Input placeholder="Discount code" className="h-12 bg-white" />
                    <Button variant="outline" className="h-12 px-6">Apply</Button>
                 </div>
              </div>

              <div className="border-t border-border pt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-xs text-muted-foreground">(Calculated at next step)</span>
                </div>
              </div>

              <div className="border-t border-border pt-6 flex justify-between items-center">
                <span className="text-lg font-medium">Total</span>
                <div className="text-right flex items-baseline gap-2">
                  <span className="text-xs text-muted-foreground">USD</span>
                  <span className="text-3xl font-bold font-serif">${subtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
