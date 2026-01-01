import { WhopCheckoutEmbed } from "@whop/checkout/react";
import { Shield, Clock, Phone, Lock, CheckCircle2 } from 'lucide-react';
import { Link } from 'wouter';

export default function Checkout() {
  const returnUrl = `${window.location.origin}/checkout/complete`;

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="bg-white border-b border-stone-200 py-4">
        <div className="container mx-auto px-4">
          <Link href="/">
            <span className="text-2xl font-bold text-[#3E2723]">Home Defend</span>
          </Link>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#3E2723]" data-testid="checkout-title">
            Secure Your Storm Shelter
          </h1>
          <p className="text-stone-600 mt-2">
            Complete your $500 deposit to reserve your production slot
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden" data-testid="whop-checkout-container">
              <WhopCheckoutEmbed
                planId="plan_0uXfZPdIAvES2"
                returnUrl={returnUrl}
              />
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-stone-200">
              <h3 className="font-bold text-[#3E2723] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#E69138]" />
                Your Purchase is Protected
              </h3>
              <ul className="space-y-3 text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>256-bit SSL encrypted checkout</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Secure payment processing by Stripe</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Your card information is never stored</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-stone-200">
              <h3 className="font-bold text-[#3E2723] mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#E69138]" />
                What Happens Next
              </h3>
              <ol className="space-y-3 text-sm text-stone-600">
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#E69138] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  <span>Confirmation email sent immediately</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#E69138] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  <span>Our team contacts you within 24-48 hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#E69138] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                  <span>Production begins within 2-4 weeks</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#E69138] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
                  <span>Delivery scheduled (balance due before shipping)</span>
                </li>
              </ol>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-stone-200">
              <h3 className="font-bold text-[#3E2723] mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[#E69138]" />
                Deposit Terms
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Your $500 deposit is non-refundable and secures your production slot. 
                The remaining balance of $4,499 plus shipping is due before delivery.
              </p>
            </div>
            
            <div className="bg-stone-50 rounded-xl p-6 border border-stone-200">
              <h3 className="font-bold text-[#3E2723] mb-2 flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#E69138]" />
                Questions?
              </h3>
              <p className="text-sm text-stone-600">
                Call us at <a href="tel:+18005550123" className="text-[#E69138] font-medium">1-800-555-0123</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
