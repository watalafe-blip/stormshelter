import { Link } from 'wouter';
import { Shield, MapPin, Phone, Mail, Award, Users, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import headerLogoImg from '@assets/home-defend-pro-logo.png';

export default function About() {
  return (
    <div className="min-h-screen bg-stone-50" data-testid="about-page">
      <header className="bg-white border-b border-stone-200 py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/">
            <img src={headerLogoImg} alt="Home Defend Pro" className="h-10 w-auto" />
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/booking" className="text-[#E69138] font-medium hover:underline">
              Order Now
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#3E2723] mb-4">
            About Home Defend Pro
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Protecting families across the Midwest with premium underground storm shelters since 2008.
          </p>
        </section>

        <section className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Home Defend Pro was founded with a simple mission: to provide 
              families with reliable, affordable protection against severe weather. 
              After witnessing the devastation caused by tornadoes in the heartland, 
              our founder committed to making high-quality storm shelters accessible to 
              every family.
            </p>
            <p className="text-gray-700 mb-4">
              Today, we've helped protect over 2 million families across the country. 
              Our concrete underground shelters are engineered to withstand EF5 tornadoes 
              and provide peace of mind when you need it most.
            </p>
            <p className="text-gray-700">
              Every shelter we deliver is built with the same care and attention we'd 
              want for our own families. That's the Home Defend Pro promise.
            </p>
          </div>
          <div className="bg-stone-100 rounded-xl p-8">
            <h3 className="text-xl font-bold text-[#3E2723] mb-6">Why Choose Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#E69138] mt-1 flex-shrink-0" />
                <span className="text-gray-700">FEMA-compliant concrete construction rated for EF5 tornadoes</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#E69138] mt-1 flex-shrink-0" />
                <span className="text-gray-700">Professional installation by certified technicians</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#E69138] mt-1 flex-shrink-0" />
                <span className="text-gray-700">Lifetime warranty on structural components</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#E69138] mt-1 flex-shrink-0" />
                <span className="text-gray-700">Flexible financing options available</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#E69138] mt-1 flex-shrink-0" />
                <span className="text-gray-700">150,000+ verified 5-star reviews</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center p-6">
            <CardContent className="pt-4">
              <Users className="w-10 h-10 text-[#E69138] mx-auto mb-3" />
              <p className="text-3xl font-bold text-[#3E2723]">2M+</p>
              <p className="text-sm text-gray-600">Happy Customers</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="pt-4">
              <Award className="w-10 h-10 text-[#E69138] mx-auto mb-3" />
              <p className="text-3xl font-bold text-[#3E2723]">150K+</p>
              <p className="text-sm text-gray-600">5-Star Reviews</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="pt-4">
              <Clock className="w-10 h-10 text-[#E69138] mx-auto mb-3" />
              <p className="text-3xl font-bold text-[#3E2723]">17+</p>
              <p className="text-sm text-gray-600">Years in Business</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="pt-4">
              <Shield className="w-10 h-10 text-[#E69138] mx-auto mb-3" />
              <p className="text-3xl font-bold text-[#3E2723]">EF5</p>
              <p className="text-sm text-gray-600">Tornado Rated</p>
            </CardContent>
          </Card>
        </section>

        <section className="bg-white rounded-xl p-8 md:p-12 mb-16">
          <h2 className="text-2xl font-bold text-[#3E2723] mb-8 text-center">Contact Us</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-[#E69138] flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Address</h3>
                <p className="text-gray-600">
                  Home Defend Pro<br />
                  312 W 2nd St, Unit #A1936<br />
                  Casper, WY 82601<br />
                  United States
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="w-6 h-6 text-[#E69138] flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Phone</h3>
                <p className="text-gray-600">
                  <a href="tel:+18339061077" className="hover:text-[#E69138]">
                    (833) 906-1077
                  </a>
                </p>
                <p className="text-sm text-gray-500">Mon-Fri 8am-6pm CST</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-[#E69138] flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Email</h3>
                <p className="text-gray-600">
                  <a href="mailto:info@homedefendpro.com" className="hover:text-[#E69138]">
                    info@homedefendpro.com
                  </a>
                </p>
                <p className="text-sm text-gray-500">Response within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Shield className="w-6 h-6 text-[#E69138] flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">D-U-N-S®</h3>
                <p className="text-gray-600">
                  243314493
                </p>
                <p className="text-sm text-gray-500">Verified Business</p>
              </div>
            </div>
          </div>
        </section>

        <section className="text-center mb-12">
          <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Ready to Protect Your Family?</h2>
          <p className="text-gray-600 mb-6">
            Reserve your storm shelter today with just a $500 deposit.
          </p>
          <Link href="/booking">
            <button className="bg-[#E69138] hover:bg-[#D4802F] text-white font-medium px-8 py-3 rounded-lg transition-colors" data-testid="cta-order-now">
              Order Your Shelter Now
            </button>
          </Link>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm mb-4">
            <Link href="/about" className="text-[#E69138] hover:underline">About Us</Link>
            <a href="https://assets-2-prod.whop.com/uploads/user_20314880/other/bots/2026-01-02/8155c636-5290-4808-838b-6e4560f35e6f.pdf" target="_blank" rel="noopener noreferrer" className="text-[#E69138] hover:underline">Refund Policy</a>
            <a href="https://assets-2-prod.whop.com/uploads/user_20314880/other/bots/2026-01-02/8155c636-5290-4808-838b-6e4560f35e6f.pdf" target="_blank" rel="noopener noreferrer" className="text-[#E69138] hover:underline">Shipping</a>
            <a href="https://assets-2-prod.whop.com/uploads/user_20314880/other/bots/2026-01-02/8155c636-5290-4808-838b-6e4560f35e6f.pdf" target="_blank" rel="noopener noreferrer" className="text-[#E69138] hover:underline">Privacy Policy</a>
            <a href="https://assets-2-prod.whop.com/uploads/user_20314880/other/bots/2026-01-02/8155c636-5290-4808-838b-6e4560f35e6f.pdf" target="_blank" rel="noopener noreferrer" className="text-[#E69138] hover:underline">Terms of Service</a>
          </div>
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Home Defend Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
