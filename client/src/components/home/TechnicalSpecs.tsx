import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Ruler, Hammer, Download, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TechnicalSpecs() {
  return (
    <section className="py-20 bg-stone-50" id="technical-specs">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-16">
          
          {/* Main Description */}
          <div className="space-y-6 text-lg text-stone-700 leading-relaxed">
            <h2 className="text-3xl font-bold text-[#3E2723] mb-6">Detailed Construction Specifications</h2>
            <p>
              Home Defend continues its commitment to manufacture the highest quality precast concrete products and provide concrete solutions with our concrete underground storm shelters.
            </p>
            <p>
              Our storm shelters are manufactured with <strong>5,000 PSI concrete</strong> and reinforced with <strong>1/2” rebar on 12” centers</strong> combined with 10 gauge steel wire mesh.
            </p>
            <p>
              Steel stairs and railing are powder coated and an electrical port is provided for wiring. The reinforced steel door is constructed of <strong>12 gauge steel</strong>, is powder coated, and has a custom-designed, three-point latching system with a locking device that allows the door to be opened from the inside, even if the door is damaged or locked, providing a sense of security to you and your family.
            </p>
            
            <div className="bg-[#E69138]/10 border-l-4 border-[#E69138] p-6 rounded-r-lg my-8">
              <div className="flex gap-4">
                <ShieldCheck className="text-[#E69138] shrink-0" size={32} />
                <div>
                  <h3 className="font-bold text-[#3E2723] text-xl mb-2">FEMA Certified Safety</h3>
                  <p>
                    Home Defend Precast Concrete storm shelters meet the rigid standards of the Federal Emergency Management Agency (FEMA) and also passed the stringent testing of the Wind Institute at Texas Tech University.
                  </p>
                </div>
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
                      <TableHead className="text-white font-bold h-12">Stock Number</TableHead>
                      <TableHead className="text-white font-bold h-12">Weight (lbs)</TableHead>
                      <TableHead className="text-white font-bold h-12">Measurement</TableHead>
                      <TableHead className="text-white font-bold h-12">Inside Dimensions</TableHead>
                      <TableHead className="text-white font-bold h-12">Outside Dimensions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="bg-white hover:bg-stone-50 text-base">
                      <TableCell className="font-medium text-[#3E2723]">706900</TableCell>
                      <TableCell>15,000</TableCell>
                      <TableCell className="font-bold text-stone-500">Length</TableCell>
                      <TableCell>92″</TableCell>
                      <TableCell>104″</TableCell>
                    </TableRow>
                    <TableRow className="bg-stone-50 hover:bg-stone-100 text-base">
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell className="font-bold text-stone-500">Width</TableCell>
                      <TableCell>65″</TableCell>
                      <TableCell>80″</TableCell>
                    </TableRow>
                    <TableRow className="bg-white hover:bg-stone-50 text-base">
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell className="font-bold text-stone-500">Height</TableCell>
                      <TableCell>75″</TableCell>
                      <TableCell>85″</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Installation Process */}
          <div>
            <h3 className="text-2xl font-bold text-[#3E2723] mb-6 flex items-center gap-2">
              <Hammer className="text-[#E69138]" /> Installation Process
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6 text-stone-700">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#3E2723] text-white flex items-center justify-center font-bold shrink-0">1</div>
                  <p>
                    <strong>Excavate</strong> to a depth of fifty-two inches (52”) with a length of one hundred eleven inches (111”) and a width of eighty seven inches (87”). This allows for a six inch (6”) base of gravel and a three inch (3”) exposure of the base above ground.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#3E2723] text-white flex items-center justify-center font-bold shrink-0">2</div>
                  <p>
                    We recommend installing <strong>drain tile</strong> around the base of the shelter and running it to daylight to ensure proper drainage.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#3E2723] text-white flex items-center justify-center font-bold shrink-0">3</div>
                  <p>
                    If daylight is not an option, in good draining soil, excavate an additional drainage pit and fill with free-draining aggregate. Compact soil before setting base.
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#3E2723] text-white flex items-center justify-center font-bold shrink-0">4</div>
                  <p>
                    After shelter is set, slope soil away from the storm shelter.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-6">
                <div className="space-y-4">
                  <h4 className="font-bold text-[#3E2723] text-lg">Additional Resources</h4>
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 text-stone-700 border-stone-300 hover:bg-stone-50 hover:text-[#E69138]">
                    <Download size={20} /> Download Installation Guide
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 h-12 text-stone-700 border-stone-300 hover:bg-stone-50 hover:text-[#E69138]">
                    <Download size={20} /> Download Product Catalog
                  </Button>
                </div>
                
                <div className="pt-6 border-t border-stone-100 space-y-4">
                  <Button 
                    className="w-full bg-[#E69138] text-[#3E2723] hover:bg-[#D4842F] font-bold h-12 text-lg"
                    onClick={() => document.getElementById('purchase')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Secure Your Spot
                  </Button>
                  
                  <div>
                    <p className="text-sm text-stone-500 mb-2">Need help? Check availability in your area:</p>
                    <a href="tel:888-262-7383" className="flex items-center gap-2 text-xl font-bold text-[#E69138] hover:underline">
                      <Phone size={24} /> 888-262-7383
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
