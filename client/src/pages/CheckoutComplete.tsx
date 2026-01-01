import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Phone, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

export default function CheckoutComplete() {
  return (
    <Layout>
      <div className="min-h-screen bg-stone-50 py-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8 md:p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-4" data-testid="success-title">
              Deposit Received!
            </h1>
            
            <p className="text-lg text-stone-600 mb-8">
              Thank you for your order. Your storm shelter production slot has been secured.
            </p>
            
            <div className="bg-stone-50 rounded-xl p-6 mb-8 text-left">
              <h3 className="font-bold text-[#3E2723] mb-4">What happens next?</h3>
              <ol className="space-y-3 text-stone-600">
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#E69138] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">1</span>
                  <span>You'll receive a confirmation email with your order details</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#E69138] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">2</span>
                  <span>Our team will contact you within 24-48 hours to confirm delivery details</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#E69138] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">3</span>
                  <span>Remaining balance is due before shipping (we'll send an invoice)</span>
                </li>
              </ol>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link href="/">
                <Button 
                  size="lg" 
                  className="bg-[#E69138] hover:bg-[#D4842F] text-white"
                  data-testid="return-home-btn"
                >
                  Return Home <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            
            <div className="border-t border-stone-200 pt-6">
              <p className="text-sm text-stone-500 mb-3">Questions? Contact us:</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <a href="tel:+1-800-555-0123" className="flex items-center gap-2 text-[#3E2723] hover:text-[#E69138]">
                  <Phone className="w-4 h-4" /> 1-800-555-0123
                </a>
                <a href="mailto:orders@homedefend.com" className="flex items-center gap-2 text-[#3E2723] hover:text-[#E69138]">
                  <Mail className="w-4 h-4" /> orders@homedefend.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
