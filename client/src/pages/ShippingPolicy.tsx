import { Link } from 'wouter';
import { ArrowRight, Truck, MapPin, Clock, DollarSign } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Layout from '@/components/layout/Layout';

export default function ShippingPolicy() {
  return (
    <Layout>
      <div className="bg-white" data-testid="shipping-policy-page">
        <section className="pt-24 pb-12 md:pt-28 md:pb-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-[#E69138] font-medium text-sm tracking-wide uppercase mb-3">Delivery</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3E2723] leading-tight tracking-tight mb-4">
              Shipping & Delivery Policy
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Transparent, mileage-based pricing with no hidden fees. 
              Here's everything you need to know about getting your shelter delivered.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center p-8 bg-stone-50 rounded-2xl">
                <DollarSign className="w-10 h-10 text-[#E69138] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#3E2723] mb-2">$5.20 per mile</h3>
                <p className="text-stone-600">Flat rate from our facility to your address</p>
              </div>
              <div className="text-center p-8 bg-stone-50 rounded-2xl">
                <MapPin className="w-10 h-10 text-[#E69138] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#3E2723] mb-2">Grandview, MO</h3>
                <p className="text-stone-600">All deliveries originate from our facility</p>
              </div>
              <div className="text-center p-8 bg-stone-50 rounded-2xl">
                <Truck className="w-10 h-10 text-[#E69138] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#3E2723] mb-2">Crane Delivery</h3>
                <p className="text-stone-600">Placed directly into your excavation</p>
              </div>
              <div className="text-center p-8 bg-stone-50 rounded-2xl">
                <Clock className="w-10 h-10 text-[#E69138] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#3E2723] mb-2">1 Week Lead Time</h3>
                <p className="text-stone-600">From deposit to delivery</p>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="max-w-3xl mx-auto px-6">
            <div className="space-y-12">
              
              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Shipping Cost Calculation</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    Shipping is calculated at <strong className="text-[#3E2723]">$5.20 per mile</strong> from 
                    our manufacturing facility in Grandview, Missouri to your delivery address.
                  </p>
                  <p>
                    When you enter your address during checkout, we automatically calculate 
                    the exact distance and shipping cost. This is the final shipping price—no 
                    hidden fees or surcharges.
                  </p>
                  <div className="bg-stone-50 rounded-xl p-6 mt-6">
                    <p className="font-medium text-[#3E2723] mb-2">Example Shipping Costs:</p>
                    <ul className="space-y-2 text-stone-600">
                      <li>Kansas City, MO (20 miles): <strong>$104</strong></li>
                      <li>Topeka, KS (80 miles): <strong>$416</strong></li>
                      <li>Oklahoma City, OK (350 miles): <strong>$1,820</strong></li>
                      <li>Dallas, TX (500 miles): <strong>$2,600</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Delivery Area</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    We deliver throughout the <strong className="text-[#3E2723]">continental United States</strong>. 
                    Most of our customers are located within 500 miles of our Missouri facility, 
                    including Kansas, Oklahoma, Texas, Arkansas, Nebraska, Iowa, and Illinois.
                  </p>
                  <p>
                    For deliveries beyond 750 miles, please contact us directly to discuss 
                    logistics and scheduling.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">What's NOT Included</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>You are responsible for:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Excavation of the installation site (approximately 10' x 12' x 8' deep)</li>
                    <li>Backfilling around the shelter after placement</li>
                    <li>Drainage and waterproofing around the shelter</li>
                    <li>Installation of access steps or ramps</li>
                    <li>Any interior finishing or customization</li>
                  </ul>
                  <p className="mt-4">
                    We recommend hiring a local excavation contractor for site preparation. 
                    We can provide detailed specifications upon request.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Site Access Requirements</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    Our delivery truck is a large flatbed with a mounted crane. To complete 
                    delivery, we need:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>A cleared path at least 12 feet wide to the installation site</li>
                    <li>Firm, level ground that can support a 30-ton truck</li>
                    <li>Overhead clearance of at least 20 feet (no low power lines or tree branches)</li>
                    <li>The excavation site within 30 feet of where the truck can park</li>
                  </ul>
                  <p className="mt-4">
                    If site access is a concern, please contact us before ordering. We can 
                    often work out solutions for challenging locations.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Scheduling & Timing</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    After you place your deposit, you'll select a preferred delivery date 
                    from our available slots. Typical lead time is <strong className="text-[#3E2723]">1 week</strong> 
                    from deposit to delivery, depending on current demand.
                  </p>
                  <p>
                    We'll contact you 2-3 days before delivery to confirm the date and 
                    provide an estimated arrival window (typically a 4-hour window in 
                    the morning or afternoon).
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Weather Delays</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    Deliveries may be postponed due to severe weather conditions that 
                    make transport or crane operation unsafe. If we need to reschedule 
                    due to weather, we'll work with you to find the next available date 
                    at no additional cost.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="py-16 bg-stone-50">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Ready to get started?</h2>
            <p className="text-lg text-stone-600 mb-8">
              Enter your address during checkout to see your exact shipping cost.
            </p>
            <Link href="/booking">
              <Button 
                className="bg-[#E69138] hover:bg-[#D4802F] text-white px-8 py-6 text-lg font-medium"
                data-testid="cta-order-now"
              >
                Order Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
