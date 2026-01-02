import { Link } from 'wouter';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Layout from '@/components/layout/Layout';

export default function Contact() {
  return (
    <Layout>
      <div className="bg-white" data-testid="contact-page">
        <main>
          <section className="bg-stone-50 border-b border-stone-200 py-16 md:py-24 text-center">
            <div className="max-w-4xl mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#3E2723]">Contact Us</h1>
              <p className="text-stone-600 text-lg md:text-xl">
                Have questions about our storm shelters? Our team in Casper, WY is here to help you 
                choose the best protection for your family.
              </p>
            </div>
          </section>

          <section className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid md:grid-cols-2 gap-12">
              <Card className="border border-stone-200 shadow-none">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-[#3E2723] mb-6">Send Us a Message</h2>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" data-testid="input-firstname" className="border-stone-200" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Smith" data-testid="input-lastname" className="border-stone-200" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john@example.com" data-testid="input-email" className="border-stone-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input id="subject" placeholder="General Inquiry" data-testid="input-subject" className="border-stone-200" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" placeholder="How can we help you?" className="min-h-[150px] border-stone-200" data-testid="input-message" />
                    </div>
                    <Button className="w-full bg-[#E69138] hover:bg-[#D4802F] text-white py-6 text-lg">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <div className="grid gap-6">
                  <div className="flex items-start gap-4 p-6 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="bg-[#E69138]/10 p-3 rounded-lg text-[#E69138]">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-[#3E2723]">Our Location</p>
                      <p className="text-stone-600 leading-relaxed">
                        Home Defend Pro<br />
                        312 W 2nd St, Unit #A1936<br />
                        Casper, WY 82601
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-6 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="bg-[#E69138]/10 p-3 rounded-lg text-[#E69138]">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-[#3E2723]">Phone Number</p>
                      <p className="text-stone-600">(833) 906-1077</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="bg-[#E69138]/10 p-3 rounded-lg text-[#E69138]">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-[#3E2723]">Email Address</p>
                      <p className="text-stone-600">info@homedefendpro.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="bg-[#E69138]/10 p-3 rounded-lg text-[#E69138]">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-[#3E2723]">Business Hours</p>
                      <p className="text-stone-600">Mon-Fri: 8:00 AM - 6:00 PM CST</p>
                      <p className="text-stone-600">Sat-Sun: Closed</p>
                    </div>
                  </div>
                </div>

                <Card className="bg-stone-50 border border-stone-200 shadow-none">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 text-[#3E2723] mb-4">
                      <ShieldCheck className="w-6 h-6 text-[#E69138]" />
                      <span className="font-bold text-lg">Verified Business</span>
                    </div>
                    <p className="text-stone-600 text-sm">
                      Home Defend Pro is a legally registered entity with a verified physical address. 
                      D-U-N-S® Number: 243314493. We prioritize transparency and security for all our customers.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  );
}
