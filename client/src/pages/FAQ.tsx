import { Link } from 'wouter';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Layout from '@/components/layout/Layout';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "Product & Specifications",
    questions: [
      {
        q: "What are the dimensions of the storm shelter?",
        a: "The Home Defend Pro shelter measures 8' x 10' x 7' (L x W x H) interior dimensions, comfortably fitting 8-12 adults. The reinforced concrete walls are 6 inches thick throughout."
      },
      {
        q: "Is the shelter FEMA compliant?",
        a: "Yes, our shelters are 100% FEMA P-320 compliant and independently tested to withstand EF5 tornado conditions with wind speeds up to 250 mph and debris impact of 100 mph."
      },
      {
        q: "What is the shelter made of?",
        a: "Our shelters are constructed from reinforced concrete with steel rebar reinforcement. We do not use prefabricated steel or fiberglass—only solid concrete for maximum protection."
      },
      {
        q: "How long will the shelter last?",
        a: "With proper drainage and minimal maintenance, our concrete shelters are designed to last 50+ years. They come with a lifetime structural warranty."
      }
    ]
  },
  {
    category: "Ordering & Payment",
    questions: [
      {
        q: "How much is the deposit?",
        a: "We require a $500 refundable deposit to reserve your delivery slot. This deposit is fully refundable if you cancel at least 14 days before your scheduled delivery date."
      },
      {
        q: "When do I pay the remaining balance?",
        a: "The remaining balance (shelter price + shipping) is due before delivery. We'll send you an invoice approximately 7 days before your scheduled delivery date."
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept all major credit cards, debit cards, and ACH bank transfers. For the final balance, we can also accept certified checks."
      },
      {
        q: "Can I finance my purchase?",
        a: "We currently do not offer in-house financing. However, many customers use home equity lines of credit or personal loans. Contact us if you need documentation for financing applications."
      }
    ]
  },
  {
    category: "Delivery & Installation",
    questions: [
      {
        q: "How is shipping calculated?",
        a: "Shipping is calculated at $5.20 per mile from our facility in Grandview, Missouri to your delivery address. The exact mileage is calculated when you enter your address during checkout."
      },
      {
        q: "What equipment do you use for delivery?",
        a: "We deliver using a specialized flatbed truck with a crane. The shelter weighs approximately 12,000 lbs and requires crane placement into your prepared excavation."
      },
      {
        q: "Do you install the shelter?",
        a: "We deliver and place the shelter into your prepared excavation using our crane truck. You are responsible for the excavation and any finishing work (backfill, drainage, steps, etc.)."
      },
      {
        q: "What site preparation is required?",
        a: "You'll need an excavation approximately 10' x 12' x 8' deep, with proper drainage considerations. We recommend hiring a local excavation contractor. We can provide detailed specifications upon request."
      },
      {
        q: "How far do you deliver?",
        a: "We deliver throughout the continental United States. Most of our customers are within 500 miles of our Missouri facility, but we've delivered as far as Texas, Ohio, and Oklahoma."
      }
    ]
  },
  {
    category: "Warranty & Support",
    questions: [
      {
        q: "What does the warranty cover?",
        a: "Our lifetime structural warranty covers any defects in materials or workmanship that affect the structural integrity of the shelter. This includes cracking, water intrusion due to construction defects, and door mechanism failures."
      },
      {
        q: "What is NOT covered by the warranty?",
        a: "The warranty does not cover damage from improper installation, neglect, unauthorized modifications, or normal wear on consumable items like door seals and hinges."
      },
      {
        q: "How do I contact support after purchase?",
        a: "You can reach us at (833) 906-1077 or email info@homedefendpro.com. We're available Monday through Friday, 8:00 AM to 6:00 PM EST."
      }
    ]
  }
];

export default function FAQ() {
  return (
    <Layout>
      <div className="bg-white" data-testid="faq-page">
        <section className="pt-24 pb-12 md:pt-28 md:pb-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-[#E69138] font-medium text-sm tracking-wide uppercase mb-3">Support</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#3E2723] leading-tight tracking-tight mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Everything you need to know about our storm shelters, ordering process, 
              and delivery. Can't find what you're looking for? Contact us.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="max-w-3xl mx-auto px-6">
            {faqs.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-12">
                <h2 className="text-xl font-semibold text-[#3E2723] mb-6">{section.category}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {section.questions.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`${sectionIndex}-${index}`}
                      className="border-b border-stone-200"
                      data-testid={`faq-item-${sectionIndex}-${index}`}
                    >
                      <AccordionTrigger className="text-left text-[#3E2723] hover:text-[#E69138] py-4">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-stone-600 pb-4 leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 bg-stone-50">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-[#3E2723] mb-4">Still have questions?</h2>
            <p className="text-lg text-stone-600 mb-8">
              Our team is here to help. Reach out and we'll get back to you within 24 hours.
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
