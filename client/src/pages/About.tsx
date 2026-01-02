import { Link } from 'wouter';
import { Shield, MapPin, Phone, Mail, Award, Users, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import headerLogoImg from '@assets/home-defend-pro-logo.png';

export default function About() {
  return (
    <div className="min-h-screen bg-stone-50" data-testid="about-page">
      <header className="bg-white border-b border-stone-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/">
            <img src={headerLogoImg} alt="Home Defend Pro" className="h-10 w-auto cursor-pointer" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-[#E69138] transition-colors">Home</Link>
            <Link href="/about" className="text-[#E69138] font-medium border-b-2 border-[#E69138]">About Us</Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#E69138] transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/booking">
              <Button className="bg-[#E69138] hover:bg-[#D4802F] text-white">Order Now</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-[#E69138] text-white py-20 md:py-28 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[#3E2723]/10" />
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Safety Built on Trust
            </h1>
            <p className="text-white/90 text-lg md:text-2xl max-w-2xl mx-auto font-medium">
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
              <Card className="bg-[#3E2723] text-white border-0">
                <CardContent className="p-8 text-center">
                  <Users className="w-8 h-8 mx-auto mb-4 text-[#E69138]" />
                  <p className="text-3xl font-bold mb-1">2M+</p>
                  <p className="text-white/60 text-sm">Families Protected</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-stone-200">
                <CardContent className="p-8 text-center">
                  <Shield className="w-8 h-8 mx-auto mb-4 text-[#E69138]" />
                  <p className="text-3xl font-bold mb-1 text-[#3E2723]">EF5</p>
                  <p className="text-gray-500 text-sm">Tornado Rated</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-stone-200">
                <CardContent className="p-8 text-center">
                  <Clock className="w-8 h-8 mx-auto mb-4 text-[#E69138]" />
                  <p className="text-3xl font-bold mb-1 text-[#3E2723]">17+</p>
                  <p className="text-gray-500 text-sm">Years of Service</p>
                </CardContent>
              </Card>
              <Card className="bg-[#E69138] text-white border-0">
                <CardContent className="p-8 text-center">
                  <Award className="w-8 h-8 mx-auto mb-4 text-white" />
                  <p className="text-3xl font-bold mb-1">D-U-N-S®</p>
                  <p className="text-white/80 text-sm">Verified Co.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-[#3E2723] py-20">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">Why Families Choose Home Defend Pro</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "FEMA Compliant", desc: "Our shelters meet or exceed all FEMA standards for residential storm protection." },
                { title: "Quick Delivery", desc: "Efficient scheduling and professional delivery from our hub to your location." },
                { title: "Lifetime Warranty", desc: "We stand behind our construction with a lifetime structural integrity warranty." }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 p-8 rounded-xl border border-white/10">
                  <div className="w-12 h-12 bg-[#E69138] rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                  <p className="text-stone-300 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="bg-stone-100 rounded-3xl p-8 md:p-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-6">Reserve Your Protection Today</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              Don't wait for the next storm. Secure your family's safety with a professional underground shelter. 
              $500 fully refundable deposit reserves your unit and delivery slot.
            </p>
            <Link href="/booking">
              <Button className="bg-[#E69138] hover:bg-[#D4802F] text-white px-10 py-8 text-xl rounded-full shadow-lg hover:shadow-xl transition-all">
                Order My Shelter Now <ChevronRight className="ml-2 w-6 h-6" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <img src={headerLogoImg} alt="Home Defend Pro" className="h-8 w-auto mb-6" />
              <p className="text-gray-500 text-sm leading-relaxed">
                Home Defend Pro is committed to protecting families with the highest quality 
                storm shelters on the market. Engineered for extreme safety.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[#3E2723] mb-6">Quick Links</h4>
              <nav className="flex flex-col gap-4 text-sm text-gray-600">
                <Link href="/" className="hover:text-[#E69138]">Home</Link>
                <Link href="/about" className="hover:text-[#E69138]">About Us</Link>
                <Link href="/contact" className="hover:text-[#E69138]">Contact</Link>
                <Link href="/booking" className="hover:text-[#E69138]">Order Now</Link>
              </nav>
            </div>
            <div>
              <h4 className="font-bold text-[#3E2723] mb-6">Contact</h4>
              <div className="flex flex-col gap-4 text-sm text-gray-600">
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#E69138]" /> Casper, WY 82601</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#E69138]" /> (833) 906-1077</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#E69138]" /> info@homedefendpro.com</p>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
            <p>© {new Date().getFullYear()} Home Defend Pro. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="https://assets-2-prod.whop.com/uploads/user_20314880/other/bots/2026-01-02/8155c636-5290-4808-838b-6e4560f35e6f.pdf" target="_blank" rel="noopener noreferrer">Terms of Service</a>
              <a href="https://assets-2-prod.whop.com/uploads/user_20314880/other/bots/2026-01-02/8155c636-5290-4808-838b-6e4560f35e6f.pdf" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
