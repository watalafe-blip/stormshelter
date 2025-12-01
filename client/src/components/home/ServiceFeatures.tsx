
import { Package, Truck, RotateCcw, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: "Free, Safe Shipping",
    description: "Available for all local deliveries. We use only trusted shipping carriers to ensure safe, speedy delivery."
  },
  {
    icon: Package,
    title: "In Stock & Ready to ship",
    description: "All orders are shipped within 1-2 business days."
  },
  {
    icon: RotateCcw,
    title: "Hassle Free Returns",
    description: "Free hassle returns within 30 days."
  },
  {
    icon: HeadphonesIcon,
    title: "Amazing Customer Service",
    description: "We pride ourselves on our excellent customer service. Questions? Call Us! (833) 906-1077"
  }
];

export default function ServiceFeatures() {
  return (
    <div className="bg-muted/30 py-16 border-y border-border/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4 p-4">
              <div className="p-4 rounded-full bg-background border border-border shadow-sm text-primary">
                <feature.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="font-serif font-semibold text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
