import React from 'react';
import { Link } from 'wouter';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Ruler, Hammer, Download, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import excavateImg from '@assets/generated_images/excavation_pit_for_shelter.png';
import drainTileImg from '@assets/generated_images/drain_tile_installation.png';
import setShelterImg from '@assets/generated_images/ai_enhanced_shelter_install_photo.png';
import backfillImg from '@assets/generated_images/installed_buried_storm_shelter.png';

const installationSteps = [
  { step: 1, title: "Excavate", description: "Dig to 49\" depth (111\" x 87\")", image: excavateImg },
  { step: 2, title: "Drain Tile", description: "Install drainage around base", image: drainTileImg },
  { step: 3, title: "Set Shelter", description: "Place on 6\" gravel base", image: setShelterImg },
  { step: 4, title: "Backfill", description: "Grade soil away from shelter", image: backfillImg },
];

export default function TechnicalSpecs() {
  return (
    <section className="py-20 bg-stone-50" id="technical-specs">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          
          {/* Main Description */}
          <div className="space-y-4 text-lg text-stone-700 leading-relaxed">
            <h2 className="text-3xl font-bold text-[#3E2723] mb-4">Construction Specs</h2>
            <p>
              Built with <strong>5,000 PSI concrete</strong>, reinforced with <strong>1/2" rebar</strong> and 10 gauge steel wire mesh. Features <strong>12 gauge steel door</strong> with three-point locking system.
            </p>
            
            <div className="bg-[#E69138]/10 border-l-4 border-[#E69138] p-4 rounded-r-lg">
              <div className="flex gap-3 items-center">
                <ShieldCheck className="text-[#E69138] shrink-0" size={28} />
                <p className="font-bold text-[#3E2723]">FEMA Certified | Texas Tech Tested</p>
              </div>
            </div>
          </div>

          {/* Dimensions Table */}
          <div>
            <h3 className="text-2xl font-bold text-[#3E2723] mb-6 flex items-center gap-2">
              <Ruler className="text-[#E69138]" /> Dimensions & Weight
            </h3>
            <Card className="overflow-hidden border-stone-200 shadow-md">
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-[#3E2723] text-white hover:bg-[#3E2723]">
                    <TableRow className="hover:bg-[#3E2723]">
                      <TableHead className="text-white font-bold h-12">Stock #</TableHead>
                      <TableHead className="text-white font-bold h-12">Weight</TableHead>
                      <TableHead className="text-white font-bold h-12">Dimension</TableHead>
                      <TableHead className="text-white font-bold h-12">Inside</TableHead>
                      <TableHead className="text-white font-bold h-12">Outside</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-white hover:bg-stone-50 text-base">
                      <TableCell className="font-medium text-[#3E2723]">706900</TableCell>
                      <TableCell>15,000 lbs</TableCell>
                      <TableCell className="font-bold text-stone-500">Length</TableCell>
                      <TableCell>92"</TableCell>
                      <TableCell>104"</TableCell>
                    </TableRow>
                    <TableRow className="bg-stone-50 hover:bg-stone-100 text-base">
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell className="font-bold text-stone-500">Width</TableCell>
                      <TableCell>65"</TableCell>
                      <TableCell>80"</TableCell>
                    </TableRow>
                    <TableRow className="bg-white hover:bg-stone-50 text-base">
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell className="font-bold text-stone-500">Height</TableCell>
                      <TableCell>75"</TableCell>
                      <TableCell>85"</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Installation Process with Images */}
          <div>
            <h3 className="text-2xl font-bold text-[#3E2723] mb-6 flex items-center gap-2">
              <Hammer className="text-[#E69138]" /> Installation
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {installationSteps.map((item) => (
                <div key={item.step} className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-sm">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                      data-testid={`img-installation-step-${item.step}`}
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded-full bg-[#3E2723] text-white flex items-center justify-center font-bold text-xs">
                        {item.step}
                      </div>
                      <span className="font-bold text-[#3E2723]">{item.title}</span>
                    </div>
                    <p className="text-sm text-stone-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold text-[#3E2723] text-lg">Resources</h4>
                  <Button variant="outline" className="w-full justify-start gap-3 h-11 text-stone-700 border-stone-300 hover:bg-stone-50 hover:text-[#E69138]">
                    <Download size={18} /> Installation Guide
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 h-11 text-stone-700 border-stone-300 hover:bg-stone-50 hover:text-[#E69138]">
                    <Download size={18} /> Product Catalog
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <Link href="/booking">
                    <Button 
                      className="w-full bg-[#E69138] text-[#3E2723] hover:bg-[#D4842F] font-bold h-12 text-lg"
                    >
                      Secure Your Spot
                    </Button>
                  </Link>
                  
                  <a href="tel:888-262-7383" className="flex items-center justify-center gap-2 text-lg font-bold text-[#E69138] hover:underline">
                    <Phone size={20} /> 888-262-7383
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
