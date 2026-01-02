import { Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Layout from '@/components/layout/Layout';

export default function Contact() {
  return (
    <Layout>
      <div className="bg-white" data-testid="contact-page">
        <section className="pt-32 pb-16 md:pt-40 md:pb-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-[#E69138] font-medium text-sm tracking-wide uppercase mb-4">Contact</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight mb-6">
              Get in touch
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Have questions about our storm shelters? We're here to help.
            </p>
          </div>
        </section>

        <section className="pb-24 md:pb-32">
          <div className="max-w-5xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-16 md:gap-24">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-8">Send us a message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-slate-700">First name</Label>
                      <Input 
                        id="firstName" 
                        placeholder="John" 
                        data-testid="input-firstname" 
                        className="border-slate-200 focus:border-slate-400 focus:ring-0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-slate-700">Last name</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Smith" 
                        data-testid="input-lastname"
                        className="border-slate-200 focus:border-slate-400 focus:ring-0"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      data-testid="input-email"
                      className="border-slate-200 focus:border-slate-400 focus:ring-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-slate-700">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="How can we help?" 
                      className="min-h-[160px] border-slate-200 focus:border-slate-400 focus:ring-0 resize-none" 
                      data-testid="input-message"
                    />
                  </div>
                  <Button 
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 text-base font-medium"
                    data-testid="button-send"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send message
                  </Button>
                </form>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-8">Contact details</h2>
                <div className="space-y-8">
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Email</p>
                    <a href="mailto:info@homedefendpro.com" className="text-lg text-slate-900 hover:text-[#E69138] transition-colors">
                      info@homedefendpro.com
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Phone</p>
                    <a href="tel:+18339061077" className="text-lg text-slate-900 hover:text-[#E69138] transition-colors">
                      (833) 906-1077
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Address</p>
                    <p className="text-lg text-slate-900">
                      312 W 2nd St, Unit #A1936<br />
                      Casper, WY 82601
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-2">Hours</p>
                    <p className="text-lg text-slate-900">
                      Monday – Friday<br />
                      8:00 AM – 6:00 PM CST
                    </p>
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-100">
                  <p className="text-sm text-slate-500">
                    Home Defend Pro is a registered business entity.<br />
                    D-U-N-S® Number: 243314493
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
