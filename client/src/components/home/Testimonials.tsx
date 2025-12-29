import { motion } from 'framer-motion';
import { Star, Play } from 'lucide-react';
import interviewVideo from '@assets/generated_videos/reporter_interviewing_family.mp4';

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
      text: "The delivery coordination was flawless, and the team provided excellent guidance for our contractor. Now our family sleeps better at night knowing we have a real, tested solution in our backyard.",
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

        {/* Featured Video Story */}
        <div className="mb-20 max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white aspect-video bg-black group cursor-pointer">
            <video 
              src={interviewVideo} 
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E69138] text-[#3E2723] text-sm font-bold tracking-wider uppercase mb-3">
                Featured Story
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">The Johnson Family's Story</h3>
              <p className="text-stone-200 max-w-2xl">
                "We never thought a tornado would hit our street. Having the shelter right there made the difference between panic and a plan."
              </p>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 pointer-events-none">
               <div className="w-16 h-16 bg-[#E69138] rounded-full flex items-center justify-center pl-1 shadow-lg">
                 <Play className="fill-[#3E2723] text-[#3E2723]" size={32} />
               </div>
            </div>
          </div>
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
                  <Star key={i} size={18} className="fill-[#E69138] text-[#E69138]" />
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