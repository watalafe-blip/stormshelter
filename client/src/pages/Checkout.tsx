import { WhopCheckoutEmbed } from "@whop/checkout/react";
import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'wouter';

export default function Checkout() {
  const returnUrl = `${window.location.origin}/checkout/complete`;

  return (
    <div className="min-h-screen flex" data-testid="checkout-page">
      <div className="w-full lg:w-[45%] bg-[#1a1a1a] text-white p-8 lg:p-12 flex flex-col">
        <div className="flex items-center gap-4 mb-12">
          <Link href="/">
            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors" data-testid="back-btn">
              <ArrowLeft className="w-4 h-4" />
            </button>
          </Link>
          <span className="text-xl font-bold">Home Defend</span>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-400 text-sm mb-2">Reserve Storm Shelter</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold">$500</span>
            <span className="text-gray-400">deposit</span>
          </div>
        </div>
        
        <div className="bg-[#252525] rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#E69138] rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Storm Shelter Deposit</p>
              <p className="text-sm text-gray-400">Secures your production slot</p>
            </div>
            <span className="font-bold">$500.00</span>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 space-y-3">
          <div className="flex justify-between text-gray-400">
            <span>Subtotal</span>
            <span className="text-white">$500.00</span>
          </div>
          <div className="flex justify-between text-2xl font-bold pt-4 border-t border-gray-700">
            <span>Total due today</span>
            <span>$500.00</span>
          </div>
        </div>
        
        <div className="mt-auto pt-12">
          <div className="bg-[#252525] rounded-xl p-4">
            <p className="text-sm text-gray-400 leading-relaxed">
              Your deposit is non-refundable and secures your production slot. 
              The remaining balance of $4,499 + shipping is due before delivery.
            </p>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block w-[55%] bg-white overflow-auto">
        <WhopCheckoutEmbed
          planId="plan_0uXfZPdIAvES2"
          returnUrl={returnUrl}
        />
      </div>
      
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
        <Link href="/checkout-mobile">
          <button className="w-full h-14 bg-[#E69138] text-white font-bold rounded-lg">
            Continue to Payment
          </button>
        </Link>
      </div>
    </div>
  );
}
