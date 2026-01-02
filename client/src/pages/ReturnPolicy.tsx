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
              Refund & Cancellation Policy
            </h1>
          </div>
        </section>

        <section className="pb-24">
          <div className="max-w-3xl mx-auto px-6">
            <div className="space-y-12">
              
              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Deposit Cancellations</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    If you place a deposit for a storm shelter and later cancel your order, 
                    <strong className="text-[#3E2723]"> 50% of the deposit amount paid will be refunded</strong> and 
                    50% will be retained.
                  </p>
                  <p>
                    If you cancel within <strong className="text-[#3E2723]">twenty-four (24) hours</strong> of a 
                    scheduled date/time confirmed by Home Defend Pro, the deposit will be 
                    forfeited in full (no refund).
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Full Payment Cancellations</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    If the storm shelter was paid in full upfront, any approved refund will be 
                    subject to a <strong className="text-[#3E2723]">3% return/processing fee</strong> calculated 
                    on the total amount paid, which will be deducted from the refund.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Delays Outside Our Control</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    We are not responsible for delays caused by weather or other circumstances 
                    outside our reasonable control.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Refund Processing</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    All refunds, if issued, will be processed to the original payment method 
                    used by the customer.
                  </p>
                  <p>
                    Please allow up to <strong className="text-[#3E2723]">48 hours</strong> for the refund to 
                    be processed, although we aim to complete refunds on the next business day. 
                    Home Defend Pro is not responsible for delays caused by our merchant processor 
                    or your credit card company in posting the refund to your account.
                  </p>
                </div>
              </div>

              <div className="bg-stone-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">How to Request a Refund</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    To request a refund, please email{' '}
                    <a href="mailto:info@homedefendpro.com" className="text-[#E69138] hover:underline">
                      info@homedefendpro.com
                    </a>{' '}
                    and include your order number, name, and the reason for your refund request.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Warranty Claims</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    If a storm shelter is found to be faulty or does not meet the described 
                    specifications under an applicable warranty, please contact us immediately. 
                    This policy does not apply to damage caused by misuse, accidents, or neglect. 
                    Valid warranty claims will be handled in accordance with our standard warranty terms.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Policy Changes</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    Home Defend Pro reserves the right to modify this Refund & Cancellation Policy 
                    at any time. Changes become effective immediately upon posting to this website.
                  </p>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-8">
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Acceptance</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    By submitting a deposit, placing a purchase, or using Home Defend Pro products, 
                    you acknowledge that you have read, understand, and agree to be bound by this 
                    Refund & Cancellation Policy and the{' '}
                    <Link href="/terms" className="text-[#E69138] hover:underline">
                      Terms & Conditions
                    </Link>.
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
