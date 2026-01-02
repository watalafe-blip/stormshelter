import { Link } from 'wouter';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import headerLogoImg from '@assets/home-defend-pro-logo.png';

export default function Contact() {
  return (
    <div className="min-h-screen bg-stone-50" data-testid="contact-page">
      <header className="bg-white border-b border-stone-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/">
            <img src={headerLogoImg} alt="Home Defend Pro" className="h-10 w-auto cursor-pointer" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-[#E69138] transition-colors">Home</Link>
            <Link href="/about" className="text-gray-600 hover:text-[#E69138] transition-colors">About Us</Link>
            <Link href="/contact" className="text-[#E69138] font-medium border-b-2 border-[#E69138]">Contact</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/booking">
              <Button className="bg-[#E69138] hover:bg-[#D4802F] text-white">Order Now</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="bg-[#3E2723] text-white py-16 md:py-24 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-stone-300 text-lg md:text-xl">
              Have questions about our storm shelters? Our team in Casper, WY is here to help you 
              choose the best protection for your family.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-12 -mt-12">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg border-0">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-[#3E2723] mb-6">Send Us a Message</h2>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" data-testid="input-firstname" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Smith" data-testid="input-lastname" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@example.com" data-testid="input-email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="General Inquiry" data-testid="input-subject" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px]" data-testid="input-message" />
                  </div>
                  <Button className="w-full bg-[#E69138] hover:bg-[#D4802F] text-white py-6 text-lg">
                    <Send className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="bg-[#E69138] text-white border-0 shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                  <div className="space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-3 rounded-lg">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Our Location</p>
                        <p className="text-white/80 leading-relaxed">
                          Home Defend Pro<br />
                          312 W 2nd St, Unit #A1936<br />
                          Casper, WY 82601
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-3 rounded-lg">
                        <Phone className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Phone Number</p>
                        <p className="text-white/80">(833) 906-1077</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-3 rounded-lg">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Email Address</p>
                        <p className="text-white/80">info@homedefendpro.com</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-3 rounded-lg">
                        <Clock className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">Business Hours</p>
                        <p className="text-white/80">Mon-Fri: 8:00 AM - 6:00 PM CST</p>
                        <p className="text-white/80">Sat-Sun: Closed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-stone-100 border-0">
                <CardContent className="p-8">
                  <div className="flex items-center gap-3 text-[#3E2723] mb-4">
                    <ShieldCheck className="w-6 h-6 text-[#E69138]" />
                    <span className="font-bold text-lg">Verified Business</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Home Defend Pro is a legally registered entity with a verified physical address. 
                    D-U-N-S® Number: 243314493. We prioritize transparency and security for all our customers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-stone-200 bg-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm mb-6">
            <Link href="/" className="text-gray-600 hover:text-[#E69138]">Home</Link>
            <Link href="/about" className="text-gray-600 hover:text-[#E69138]">About Us</Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#E69138]">Contact</Link>
            <Link href="/booking" className="text-gray-600 hover:text-[#E69138]">Order Now</Link>
            <a href="https://assets-2-prod.whop.com/uploads/user_20314880/other/bots/2026-01-02/8155c636-5290-4808-838b-6e4560f35e6f.pdf" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-[#E69138]">Privacy Policy</a>
          </div>
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Home Defend Pro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
