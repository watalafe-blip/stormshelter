import { motion } from 'framer-motion';
import { CreditCard, Calendar, Download, Truck, CheckCircle2, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HowItWorks() {
  const steps = [
    {
      icon: CreditCard,
      title: "Secure Your Spot",
      description: "A fully refundable $500 deposit locks in your production slot. No risk, just peace of mind."
    },
    {
      icon: Calendar,
      title: "Schedule Delivery",
      description: "Choose a delivery window that fits your life. We work around your schedule, not ours."
    },
    {
      icon: Download,
      title: "Prep Your Site",
      description: "Download our comprehensive site prep guide. It covers everything your contractor needs to know."
    },
    {
      icon: CheckCircle2,
      title: "Finalize Payment",
      description: "Complete your balance payment prior to shipping. We accept all major secure payment methods."
    },
    {
      icon: Truck,
      title: "Delivery Day",
      description: "Your shelter arrives within 1 week of your date. You handle offloading, we handle the timing."
    }
  ];

  return (
    <section className="py-24 bg-stone-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #E69138 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[#E69138]/30 bg-[#E69138]/10 text-[#E69138] text-sm font-bold tracking-wider uppercase mb-6">
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-white mb-6">
            From Order to Safety in <span className="text-[#E69138]">5 Steps</span>
          </h2>
          <p className="text-xl text-stone-400">
            We've streamlined the process to get you protected as fast as possible.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-stone-700 -translate-x-1/2 hidden md:block"></div>
          <div className="absolute left-8 top-0 bottom-0 w-px bg-stone-700 md:hidden"></div>

          <div className="space-y-12 md:space-y-0">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.1 }}
                className={`flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-0 relative ${idx % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
              >
                {/* Content Side */}
                <div className={`flex-1 ${idx % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'} pl-20 md:pl-0`}>
                  <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-stone-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Center Icon */}
                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-stone-800 border-4 border-stone-900 shadow-[0_0_0_4px_#292524] flex items-center justify-center relative z-10 group">
                    <div className="absolute inset-0 rounded-full border border-[#E69138]/30 group-hover:border-[#E69138] transition-colors"></div>
                    <step.icon size={24} className="text-[#E69138]" />
                    <div className="absolute -right-2 -top-2 w-6 h-6 rounded-full bg-[#E69138] text-[#3E2723] flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </div>
                  </div>
                </div>

                {/* Empty Side for Balance */}
                <div className="flex-1 hidden md:block"></div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-20">
             <Button 
                size="lg" 
                className="bg-[#E69138] text-[#3E2723] hover:bg-[#D4842F] font-bold text-lg px-10 h-14 rounded-full"
                onClick={() => document.getElementById('purchase')?.scrollIntoView({ behavior: 'smooth' })}
             >
               Start The Process <ArrowDown className="ml-2 w-5 h-5" />
             </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
