import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Phone, Mail, ArrowRight, XCircle, Loader2 } from 'lucide-react';
import { Link, useSearch } from 'wouter';

export default function CheckoutComplete() {
  const searchParams = useSearch();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [bookingId, setBookingId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const whopStatus = params.get('status');
    const id = params.get('bookingId');
    
    setBookingId(id);

    if (whopStatus === 'success' && id) {
      updateBookingPayment(id);
    } else if (whopStatus === 'error') {
      setStatus('error');
    } else if (id) {
      setStatus('success');
    } else {
      setStatus('success');
    }
  }, [searchParams]);

  const updateBookingPayment = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}/payment-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' })
      });
      
      if (response.ok) {
        setStatus('success');
      } else {
        console.error('Failed to update payment status');
        setStatus('success');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      setStatus('success');
    }
  };

  if (status === 'loading') {
    return (
      <Layout>
        <div className="min-h-screen bg-stone-50 py-16 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#E69138] mx-auto mb-4" />
            <p className="text-lg text-stone-600">Processing your payment...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (status === 'error') {
    return (
      <Layout>
        <div className="min-h-screen bg-stone-50 py-16">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8 md:p-12">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-4" data-testid="error-title">
                Payment Failed
              </h1>
              
              <p className="text-lg text-stone-600 mb-8">
                There was an issue processing your payment. Please try again or contact support.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Link href="/booking">
                  <Button 
                    size="lg" 
                    className="bg-[#E69138] hover:bg-[#D4842F] text-white"
                    data-testid="try-again-btn"
                  >
                    Try Again <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              
              <div className="border-t border-stone-200 pt-6">
                <p className="text-sm text-stone-500 mb-3">Need help? Contact us:</p>
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

  return (
    <Layout>
      <div className="min-h-screen bg-stone-50 py-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-stone-200 p-8 md:p-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-[#3E2723] mb-4" data-testid="success-title">
              Payment Received!
            </h1>
            
            <p className="text-lg text-stone-600 mb-8">
              Thank you for your order. Your storm shelter production slot has been secured.
              {bookingId && <span className="block text-sm mt-2">Booking Reference: #{bookingId}</span>}
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
                  <span>We'll coordinate delivery based on your selected date</span>
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
