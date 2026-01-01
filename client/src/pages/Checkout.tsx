import { WhopCheckoutEmbed } from "@whop/checkout/react";

export default function Checkout() {
  const returnUrl = `${window.location.origin}/checkout/complete`;

  return (
    <div className="min-h-screen bg-white" data-testid="checkout-page">
      <WhopCheckoutEmbed
        planId="plan_0uXfZPdIAvES2"
        returnUrl={returnUrl}
      />
    </div>
  );
}
