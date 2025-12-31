import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Ruler, Hammer, Download, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

          {/* Installation Process */}
          <div>
            <h3 className="text-2xl font-bold text-[#3E2723] mb-6 flex items-center gap-2">
              <Hammer className="text-[#E69138]" /> Installation
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4 text-stone-700">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#3E2723] text-white flex items-center justify-center font-bold shrink-0 text-sm">1</div>
                  <p><strong>Excavate</strong> to 52" depth (111" x 87")</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#3E2723] text-white flex items-center justify-center font-bold shrink-0 text-sm">2</div>
                  <p>Install <strong>drain tile</strong> around base</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#3E2723] text-white flex items-center justify-center font-bold shrink-0 text-sm">3</div>
                  <p>Set shelter on 6" gravel base</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#3E2723] text-white flex items-center justify-center font-bold shrink-0 text-sm">4</div>
                  <p>Backfill and slope soil away</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm space-y-4">
                <h4 className="font-bold text-[#3E2723] text-lg">Resources</h4>
                <Button variant="outline" className="w-full justify-start gap-3 h-11 text-stone-700 border-stone-300 hover:bg-stone-50 hover:text-[#E69138]">
                  <Download size={18} /> Installation Guide
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-11 text-stone-700 border-stone-300 hover:bg-stone-50 hover:text-[#E69138]">
                  <Download size={18} /> Product Catalog
                </Button>
                
                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <Button 
                    className="w-full bg-[#E69138] text-[#3E2723] hover:bg-[#D4842F] font-bold h-11 text-lg"
                    onClick={() => document.getElementById('purchase')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Secure Your Spot
                  </Button>
                  
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
