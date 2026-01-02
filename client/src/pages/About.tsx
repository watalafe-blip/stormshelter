import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Layout from '@/components/layout/Layout';
import familyCouple from '@assets/generated_images/country_couple_family_business_portrait.png';

export default function About() {
  return (
    <Layout>
      <div className="bg-white" data-testid="about-page">
        <section className="pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-[#E69138] font-medium text-sm tracking-wide uppercase mb-4">About Us</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
              Protecting families since 2008
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              We build concrete underground storm shelters engineered to withstand 
              the most extreme weather conditions. Simple as that.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-slate-900">2M+</p>
                <p className="text-slate-500 mt-1">Families protected</p>
              </div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-slate-900">17</p>
                <p className="text-slate-500 mt-1">Years in business</p>
              </div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-slate-900">EF5</p>
                <p className="text-slate-500 mt-1">Tornado rated</p>
              </div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-slate-900">100%</p>
                <p className="text-slate-500 mt-1">FEMA compliant</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Our story</h2>
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                Home Defend Pro started with a simple observation: too many families in tornado-prone 
                areas didn't have access to reliable storm protection. The existing options were 
                either too expensive, poorly constructed, or simply unavailable.
              </p>
              <p>
                We set out to change that. Our team of engineers designed a shelter that could 
                withstand EF5 tornadoes while remaining accessible to everyday families. We focused 
                on concrete construction, proper ventilation, and ease of installation.
              </p>
              <p>
                Today, we've protected over 2 million families across the Midwest and beyond. 
                Every shelter we deliver carries the same promise: when the storm comes, 
                your family has a safe place to go.
              </p>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">What we believe</h2>
            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Quality over quantity</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  We use reinforced concrete, not prefabricated steel. Our shelters are built 
                  to last decades, not years. This isn't the cheapest option—it's the best one.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Transparent pricing</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  The price you see is the price you pay. Shipping is calculated based on actual 
                  mileage from our facility. No hidden fees, no surprises at delivery.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">Lifetime warranty</h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  We stand behind our construction. If there's ever a structural issue with 
                  your shelter, we'll make it right. Period.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src={familyCouple} 
                  alt="Family business owners" 
                  className="w-full rounded-2xl"
                  data-testid="img-family-owners"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">A family business</h2>
                <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
                  <p>
                    We're a family-owned company from the heart of the Midwest. 
                    We started this business after losing our own home to a tornado, 
                    and we've dedicated our lives to making sure other families 
                    never have to go through what we did.
                  </p>
                  <p>
                    Every shelter we build, we build like it's going into our own backyard. 
                    That's the promise we make to every customer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-slate-900">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to protect your family?
            </h2>
            <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto">
              Reserve your storm shelter with a $500 refundable deposit. 
              We'll handle the rest.
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
