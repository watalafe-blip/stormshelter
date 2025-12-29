
import { Package, Truck, RotateCcw, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: "Installation & Delivery",
    description: "We deliver directly to your site. You arrange the offloading (forklift/crane). Comprehensive installation guide included for your contractor."
  },
  {
    icon: Package,
    title: "Production Priority",
    description: "Your deposit secures your spot in our manufacturing queue."
  },
  {
    icon: RotateCcw,
    title: "Lifetime Support",
    description: "We stand by our shelters forever. Any questions, any time."
  },
  {
    icon: HeadphonesIcon,
    title: "Expert Guidance",
    description: "Need help planning your site prep? Call our engineering team directly. (833) 906-1077"
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
