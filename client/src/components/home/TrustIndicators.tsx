import { Shield, Users, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const indicators = [
  {
    icon: Clock,
    value: '15+',
    label: 'Years in Business',
    description: 'Trusted since 2010'
  },
  {
    icon: Users,
    value: 'Family',
    label: 'Owned & Operated',
    description: 'Midwest values, built to last'
  },
  {
    icon: Shield,
    value: 'Lifetime',
    label: 'Warranty',
    description: 'We stand behind every shelter'
  },
  {
    icon: Award,
    value: 'FEMA',
    label: 'Certified',
    description: 'Meets 320 & ICC 500 standards'
  }
];

export default function TrustIndicators() {
  return (
    <section className="py-16 bg-[#3E2723]" data-testid="trust-indicators-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Families Trust Us
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            We're not just a company — we're your neighbors, committed to protecting families across the heartland.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {indicators.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-xl bg-white/5 border border-white/10"
              data-testid={`trust-indicator-${index}`}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#E69138]/20 flex items-center justify-center">
                <item.icon className="w-7 h-7 text-[#E69138]" />
              </div>
              <div className="text-3xl md:text-4xl font-black text-white mb-1">
                {item.value}
              </div>
              <div className="text-[#E69138] font-semibold text-sm uppercase tracking-wider mb-2">
                {item.label}
              </div>
              <p className="text-white/60 text-sm">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
