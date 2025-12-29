import { motion } from 'framer-motion';
import { CreditCard, Calendar, Download, Truck, CheckCircle2 } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: CreditCard,
      title: "Pay Deposit",
      description: "Secure your production slot with a $500 refundable deposit."
    },
    {
      icon: Calendar,
      title: "Select Delivery Date",
      description: "Choose a delivery window that works for your schedule."
    },
    {
      icon: Download,
      title: "Download Guide",
      description: "Get the comprehensive site prep and installation manual immediately."
    },
    {
      icon: CheckCircle2,
      title: "Pay Balance",
      description: "Complete your payment prior to the scheduled shipping date."
    },
    {
      icon: Truck,
      title: "Receive Shelter",
      description: "Guaranteed delivery within 1 week of your scheduled date."
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-[#3E2723] mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground">
            Simple, transparent, and designed for your peace of mind.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-1 bg-stone-100 -z-10">
            <div className="h-full bg-[#E69138]/20 w-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-24 h-24 rounded-full bg-white border-4 border-[#E69138]/10 group-hover:border-[#E69138] flex items-center justify-center mb-6 shadow-lg transition-colors duration-300 relative z-10">
                  <step.icon size={32} className="text-[#E69138]" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#3E2723] text-white flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-[#3E2723] mb-3">{step.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed px-2">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
