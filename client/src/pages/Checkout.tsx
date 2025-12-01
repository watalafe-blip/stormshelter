
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { products } from '@/lib/mockData';
import { Link, useLocation } from 'wouter';
import { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";

export default function Checkout() {
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setLocation('/confirmation');
    }, 2000);
  };

  // Mock cart summary
  const subtotal = 558.00;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Form Section */}
          <div>
            <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>
            
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Contact */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium">Contact Information</h2>
                  <Link href="/login" className="text-sm text-primary underline">Log in</Link>
                </div>
                <Input type="email" placeholder="Email address" required />
                <div className="flex items-center space-x-2">
                   <Checkbox id="newsletter" />
                   <Label htmlFor="newsletter" className="text-sm font-normal text-muted-foreground">Email me with news and offers</Label>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="space-y-4 pt-4">
                <h2 className="text-lg font-medium">Shipping Address</h2>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="First name" required />
                  <Input placeholder="Last name" required />
                </div>
                <Input placeholder="Address" required />
                <Input placeholder="Apartment, suite, etc. (optional)" />
                <div className="grid grid-cols-3 gap-4">
                  <Input placeholder="City" className="col-span-1" required />
                  <Input placeholder="State" className="col-span-1" required />
                  <Input placeholder="ZIP code" className="col-span-1" required />
                </div>
                <Input placeholder="Phone" type="tel" required />
              </div>

              {/* Shipping Method */}
              <div className="space-y-4 pt-4">
                <h2 className="text-lg font-medium">Shipping Method</h2>
                <RadioGroup defaultValue="free" className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="free" id="free" />
                      <Label htmlFor="free" className="font-medium">Standard Shipping</Label>
                    </div>
                    <span className="font-bold">Free</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="express" id="express" />
                      <Label htmlFor="express" className="font-medium">Express Shipping</Label>
                    </div>
                    <span className="font-bold">$15.00</span>
                  </div>
                </RadioGroup>
              </div>

              {/* Payment */}
              <div className="space-y-4 pt-4">
                <h2 className="text-lg font-medium">Payment</h2>
                <p className="text-sm text-muted-foreground mb-4">All transactions are secure and encrypted.</p>
                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="p-4 bg-muted/50 border-b border-border">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" checked={true} />
                      <Label htmlFor="card" className="font-medium">Credit Card</Label>
                    </div>
                  </div>
                  <div className="p-4 grid gap-4 bg-card">
                    <Input placeholder="Card number" />
                    <div className="grid grid-cols-2 gap-4">
                      <Input placeholder="Expiration date (MM/YY)" />
                      <Input placeholder="Security code" />
                    </div>
                    <Input placeholder="Name on card" />
                  </div>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full h-12 text-base" disabled={isProcessing}>
                {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Pay Now'}
              </Button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-muted/30 p-8 rounded-lg h-fit lg:sticky lg:top-24 border border-border/50">
            <div className="space-y-6">
              {[products[0], products[1]].map((product) => (
                <div key={product.id} className="flex gap-4">
                  <div className="relative h-16 w-16 bg-white rounded-md border border-border overflow-hidden">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">1</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium line-clamp-2">{product.name}</h4>
                    <p className="text-xs text-muted-foreground">{product.category}</p>
                  </div>
                  <span className="text-sm font-medium">${product.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-border my-6 pt-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>

            <div className="border-t border-border pt-6 flex justify-between items-center">
              <span className="text-lg font-medium">Total</span>
              <div className="text-right">
                <span className="text-xs text-muted-foreground mr-2">USD</span>
                <span className="text-2xl font-bold font-serif">${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
