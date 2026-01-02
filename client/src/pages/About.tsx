import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Layout from '@/components/layout/Layout';
import familyCouple from '@assets/generated_images/country_couple_family_business_portrait.png';
import helpingVictims from '@assets/generated_images/founders_helping_tornado_victims.png';
import shelterInstall from '@assets/generated_images/storm_shelter_installation_worksite.png';

export default function About() {
  return (
    <Layout>
      <div className="bg-white" data-testid="about-page">
        <section className="pt-32 pb-20 md:pt-40 md:pb-28">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-[#E69138] font-medium text-sm tracking-wide uppercase mb-4">About Us</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3E2723] leading-tight tracking-tight mb-6">
              Protecting families since 2008
            </h1>
            <p className="text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
              We build concrete underground storm shelters engineered to withstand 
              the most extreme weather conditions. Simple as that.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-[#3E2723]">2M+</p>
                <p className="text-stone-500 mt-1">Families protected</p>
              </div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-[#3E2723]">17</p>
                <p className="text-stone-500 mt-1">Years in business</p>
              </div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-[#3E2723]">EF5</p>
                <p className="text-stone-500 mt-1">Tornado rated</p>
              </div>
              <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold text-[#3E2723]">100%</p>
                <p className="text-stone-500 mt-1">FEMA compliant</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-stone-50">
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
                <h2 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-6">A family business</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
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

        <section className="py-24">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <h2 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-6">We're there when it matters</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    After every major storm, we're on the ground helping families 
                    pick up the pieces. We've seen firsthand the devastation that 
                    tornadoes leave behind.
                  </p>
                  <p>
                    That's why we do what we do. It's not just a business—it's 
                    a mission to protect families before the next storm hits.
                  </p>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <img 
                  src={helpingVictims} 
                  alt="Helping families after storm damage" 
                  className="w-full rounded-2xl"
                  data-testid="img-helping-victims"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-stone-50">
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src={shelterInstall} 
                  alt="Professional shelter installation" 
                  className="w-full rounded-2xl"
                  data-testid="img-installation"
                />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-6">Professional installation</h2>
                <div className="space-y-4 text-lg text-stone-600 leading-relaxed">
                  <p>
                    Our team handles everything from delivery to installation. 
                    We use professional equipment to safely place your shelter 
                    exactly where you need it.
                  </p>
                  <p>
                    You don't lift a finger. We show up, we install, and you 
                    have peace of mind for life.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-8">What we believe</h2>
            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-semibold text-[#3E2723] mb-3">Quality over quantity</h3>
                <p className="text-lg text-stone-600 leading-relaxed">
                  We use reinforced concrete, not prefabricated steel. Our shelters are built 
                  to last decades, not years. This isn't the cheapest option—it's the best one.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#3E2723] mb-3">Transparent pricing</h3>
                <p className="text-lg text-stone-600 leading-relaxed">
                  The price you see is the price you pay. Shipping is calculated based on actual 
                  mileage from our facility. No hidden fees, no surprises at delivery.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#3E2723] mb-3">Lifetime warranty</h3>
                <p className="text-lg text-stone-600 leading-relaxed">
                  We stand behind our construction. If there's ever a structural issue with 
                  your shelter, we'll make it right. Period.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-[#3E2723]">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to protect your family?
            </h2>
            <p className="text-xl text-stone-300 mb-10 max-w-xl mx-auto">
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
