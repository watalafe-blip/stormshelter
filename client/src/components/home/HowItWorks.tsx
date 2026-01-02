import { motion } from 'framer-motion';
import { CreditCard, Calendar, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HowItWorks() {
  const steps = [
    {
      icon: CreditCard,
      title: "1. Secure Your Spot",
      description: "Non-refundable $500 deposit locks your delivery slot."
    },
    {
      icon: Calendar,
      title: "2. Schedule Delivery",
      description: "Choose a delivery window that works for you."
    },
    {
      icon: CheckCircle2,
      title: "3. Finalize Payment",
      description: "Balance due prior to shipping."
    },
    {
      icon: Truck,
      title: "4. Delivery Day",
      description: "Your shelter arrives within 1 week of scheduled date."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-sans font-bold text-[#3E2723] mb-4">
            Simple 4-Step Process
          </h2>
          <p className="text-lg text-stone-600">
            From booking to delivery, we make it easy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-stone-50 border border-stone-100 hover:shadow-md transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-white border-2 border-[#E69138]/20 flex items-center justify-center mb-6 shadow-sm">
                <step.icon size={28} className="text-[#E69138]" />
              </div>
              
              <h3 className="font-bold text-[#3E2723] mb-3 text-lg">{step.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
           <Button 
              className="bg-[#E69138] text-[#3E2723] hover:bg-[#D4842F] font-bold px-8 h-12"
              onClick={() => document.getElementById('purchase')?.scrollIntoView({ behavior: 'smooth' })}
           >
             Start The Process <ArrowRight className="ml-2 w-4 h-4" />
           </Button>
        </div>
      </div>
    </section>
  );
}
