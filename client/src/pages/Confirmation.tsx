
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'wouter';

export default function Confirmation() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center container mx-auto px-4 py-12">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
               <CheckCircle2 size={48} strokeWidth={1.5} />
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-serif font-bold">Order Confirmed!</h1>
            <p className="text-muted-foreground">
              Thank you for your purchase. We've sent a confirmation email to your inbox.
            </p>
          </div>

          <div className="bg-muted/30 p-6 rounded-lg border border-border/50 text-left space-y-4">
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Order Number</span>
              <p className="font-mono font-medium text-lg">#LX-88291</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">Estimated Delivery</span>
              <p className="font-medium">Oct 24 - Oct 26</p>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button size="lg" variant="outline">Return Home</Button>
            </Link>
            <Link href="/shop">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
