import { WhopCheckoutEmbed } from "@whop/checkout/react";
import Layout from '@/components/layout/Layout';

export default function Checkout() {
  const returnUrl = `${window.location.origin}/checkout/complete`;

  return (
    <Layout>
      <div className="min-h-screen bg-stone-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#3E2723]" data-testid="checkout-title">
              Secure Your Storm Shelter
            </h1>
            <p className="text-stone-600 mt-2">
              Complete your $500 deposit to reserve your shelter
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg border border-stone-200 overflow-hidden" data-testid="whop-checkout-container">
            <WhopCheckoutEmbed
              planId="plan_0uXfZPdIAvES2"
              returnUrl={returnUrl}
            />
          </div>
          
          <div className="mt-6 text-center text-sm text-stone-500">
            <p>Your deposit is non-refundable and secures your production slot.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
