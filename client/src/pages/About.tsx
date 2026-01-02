import { Link } from 'wouter';
import { Shield, MapPin, Phone, Mail, Award, Users, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Layout from '@/components/layout/Layout';

export default function About() {
  return (
    <Layout>
      <div className="bg-white" data-testid="about-page">
        <main>
          <section className="bg-stone-50 border-b border-stone-200 py-20 md:py-28 text-center relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#3E2723]">
                Safety Built on Trust
              </h1>
              <p className="text-stone-600 text-lg md:text-2xl max-w-2xl mx-auto font-medium">
                We provide families with the strongest concrete underground storm shelters, 
                delivering peace of mind when it matters most.
              </p>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <div className="w-12 h-1 bg-[#E69138] mb-6" />
                <h2 className="text-3xl font-bold text-[#3E2723] mb-6">Our Mission & Story</h2>
                <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                  <p>
                    Home Defend Pro was founded with a simple mission: to provide 
                    families with reliable, affordable protection against severe weather. 
                    After witnessing the devastation caused by tornadoes in the heartland, 
                    our team committed to making high-quality storm shelters accessible to 
                    every family.
                  </p>
                  <p>
                    Today, we've helped protect over 2 million families across the country. 
                    Our concrete underground shelters are engineered to withstand EF5 tornadoes 
                    and provide peace of mind when you need it most.
                  </p>
                  <p>
                    Every shelter we deliver is built with the same care and attention we'd 
                    want for our own families. That's the Home Defend Pro promise.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-stone-50 border-stone-200 shadow-none">
                  <CardContent className="p-8 text-center">
                    <Users className="w-8 h-8 mx-auto mb-4 text-[#E69138]" />
                    <p className="text-3xl font-bold mb-1 text-[#3E2723]">2M+</p>
                    <p className="text-stone-500 text-sm">Families Protected</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-stone-200 shadow-none">
                  <CardContent className="p-8 text-center">
                    <Shield className="w-8 h-8 mx-auto mb-4 text-[#E69138]" />
                    <p className="text-3xl font-bold mb-1 text-[#3E2723]">EF5</p>
                    <p className="text-stone-500 text-sm">Tornado Rated</p>
                  </CardContent>
                </Card>
                <Card className="bg-white border-stone-200 shadow-none">
                  <CardContent className="p-8 text-center">
                    <Clock className="w-8 h-8 mx-auto mb-4 text-[#E69138]" />
                    <p className="text-3xl font-bold mb-1 text-[#3E2723]">17+</p>
                    <p className="text-stone-500 text-sm">Years of Service</p>
                  </CardContent>
                </Card>
                <Card className="bg-stone-50 border-stone-200 shadow-none">
                  <CardContent className="p-8 text-center">
                    <Award className="w-8 h-8 mx-auto mb-4 text-[#E69138]" />
                    <p className="text-3xl font-bold mb-1 text-[#3E2723]">D-U-N-S®</p>
                    <p className="text-stone-500 text-sm">Verified Co.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          <section className="bg-stone-50 py-20 border-y border-stone-200">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-[#3E2723] mb-12 text-center">Why Families Choose Home Defend Pro</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { title: "FEMA Compliant", desc: "Our shelters meet or exceed all FEMA standards for residential storm protection." },
                  { title: "Quick Delivery", desc: "Efficient scheduling and professional delivery from our hub to your location." },
                  { title: "Lifetime Warranty", desc: "We stand behind our construction with a lifetime structural integrity warranty." }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-xl border border-stone-200">
                    <div className="w-12 h-12 bg-[#E69138]/10 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-6 h-6 text-[#E69138]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#3E2723] mb-4">{item.title}</h3>
                    <p className="text-stone-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="max-w-5xl mx-auto px-4 py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-6">Reserve Your Protection Today</h2>
            <p className="text-stone-600 text-lg mb-8 max-w-2xl mx-auto">
              Don't wait for the next storm. Secure your family's safety with a professional underground shelter. 
              $500 fully refundable deposit reserves your unit and delivery slot.
            </p>
            <Link href="/booking">
              <Button className="bg-[#E69138] hover:bg-[#D4802F] text-white px-10 py-8 text-xl rounded-full shadow-lg hover:shadow-xl transition-all">
                Order My Shelter Now <ChevronRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </section>
        </main>
      </div>
    </Layout>
  );
}
