
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { products } from '@/lib/mockData';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export default function Cart() {
  // Mock cart items
  const cartItems = [
    { product: products[0], quantity: 1, size: 'One Size' },
    { product: products[1], quantity: 2, size: 'US 10' },
  ];

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-serif font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex gap-6 p-6 border border-border rounded-lg bg-card">
                <div className="h-32 w-24 bg-muted rounded-md overflow-hidden shrink-0">
                  <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif font-medium text-lg mb-1">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">Category: {item.product.category}</p>
                      <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                    </div>
                    <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-input rounded-md h-8">
                      <button className="px-2 hover:bg-muted h-full flex items-center"><Minus size={14} /></button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button className="px-2 hover:bg-muted h-full flex items-center"><Plus size={14} /></button>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8">
                      <Trash2 size={16} className="mr-2" /> Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-muted/30 p-6 rounded-lg border border-border/50 sticky top-24">
              <h2 className="text-xl font-serif font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium text-muted-foreground">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl">${total.toFixed(2)}</span>
              </div>

              <Link href="/checkout">
                <Button size="lg" className="w-full text-base h-12">
                  Proceed to Checkout <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
              
              <p className="text-xs text-center text-muted-foreground mt-4">
                Secure checkout powered by Stripe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
