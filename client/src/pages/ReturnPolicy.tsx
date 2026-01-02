import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Layout from '@/components/layout/Layout';

export default function ReturnPolicy() {
  return (
    <Layout>
      <div className="bg-white" data-testid="return-policy-page">
        <section className="pt-24 pb-12 md:pt-28 md:pb-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-[#E69138] font-medium text-sm tracking-wide uppercase mb-3">Policies</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3E2723] leading-tight tracking-tight mb-4">
              Return & Refund Policy
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              We want you to be completely confident in your purchase. Here's our 
              straightforward policy on deposits, cancellations, and refunds.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="max-w-3xl mx-auto px-6">
            <div className="space-y-12">
              
              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Deposit Policy</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    We require a <strong className="text-[#3E2723]">$500 refundable deposit</strong> to 
                    reserve your delivery slot. This deposit secures your place in our 
                    production and delivery schedule.
                  </p>
                  <p>
                    The deposit will be applied toward your final balance when payment 
                    is due before delivery.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Full Refund</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    You are entitled to a <strong className="text-[#3E2723]">full refund of your deposit</strong> if 
                    you cancel your order at least <strong className="text-[#3E2723]">14 days before</strong> your 
                    scheduled delivery date.
                  </p>
                  <p>
                    To request a cancellation, contact us by phone at (833) 906-1077 or 
                    email info@homedefendpro.com. We'll process your refund within 
                    5-7 business days.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Partial Refund</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    If you cancel within <strong className="text-[#3E2723]">7-14 days</strong> of your scheduled 
                    delivery date, you will receive a <strong className="text-[#3E2723]">50% refund</strong> of 
                    your deposit ($250).
                  </p>
                  <p>
                    This partial forfeiture covers the administrative costs and lost 
                    opportunity of the reserved delivery slot.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">No Refund</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    Cancellations made <strong className="text-[#3E2723]">less than 7 days</strong> before 
                    your scheduled delivery date are not eligible for a deposit refund.
                  </p>
                  <p>
                    At this point, the delivery truck and crew have been scheduled, 
                    and the shelter is staged for transport.
                  </p>
                </div>
              </div>

              <div className="bg-stone-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">After Delivery</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    Once the shelter has been delivered and placed, <strong className="text-[#3E2723]">all 
                    sales are final</strong>. Due to the nature of the product (custom 
                    delivery, crane placement, and site-specific installation), we 
                    cannot accept returns after delivery.
                  </p>
                  <p>
                    If there are any defects or issues with your shelter, these are 
                    covered under our <strong className="text-[#3E2723]">lifetime structural warranty</strong>. 
                    Please contact us immediately to report any concerns.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Rescheduling</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    Need to change your delivery date? No problem. You can reschedule 
                    your delivery <strong className="text-[#3E2723]">one time at no charge</strong>, provided 
                    you give us at least 7 days notice.
                  </p>
                  <p>
                    Additional rescheduling requests may be subject to a $100 
                    administrative fee, depending on circumstances.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Weather & Access Issues</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    If delivery cannot be completed due to weather conditions or 
                    site access issues on the scheduled date, we will work with you 
                    to reschedule at no additional cost.
                  </p>
                  <p>
                    If site access issues are due to inadequate site preparation on 
                    your part, a rescheduling fee may apply.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="py-16 bg-stone-50">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Questions about our policies?</h2>
            <p className="text-lg text-stone-600 mb-8">
              We're happy to clarify anything before you place your order.
            </p>
            <Link href="/contact">
              <Button 
                className="bg-[#E69138] hover:bg-[#D4802F] text-white px-8 py-6 text-lg font-medium"
                data-testid="cta-contact-us"
              >
                Contact Us <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
