import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      text: "We lived in tornado alley for years without peace of mind. The Home Defend shelter changed everything. When that warning siren went off last spring, we knew exactly where to go and our family was 100% safe.",
      author: "Sarah Mitchell",
      location: "Oklahoma",
      rating: 5
    },
    {
      text: "The quality of construction is unbelievable. Every detail—from the steel reinforcement to the handrails—shows they built this to actually protect people, not just sell a product. Worth every penny.",
      author: "James Rodriguez",
      location: "Missouri",
      rating: 5
    },
    {
      text: "Installation was straightforward, and the team was professional throughout. Now our family sleeps better at night knowing we have a real, tested solution in our backyard.",
      author: "Jennifer Chen",
      location: "Kansas",
      rating: 5
    }
  ];

  return (
    <section className="py-24 bg-[#fdfaf5]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-sans font-bold text-[#3E2723] mb-4">
            Real Peace of Mind
          </h2>
          <p className="text-lg text-muted-foreground">
            From families who trusted Home Defend to protect what matters most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-xl shadow-sm border border-[#3E2723]/5 hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array(testimonial.rating).fill(0).map((_, i) => (
                  <Star key={i} size={18} className="fill-[#FFD700] text-[#FFD700]" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="border-t border-stone-200 pt-4">
                <h4 className="font-bold text-[#3E2723]">{testimonial.author}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}