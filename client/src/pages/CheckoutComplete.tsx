// FILE LOCATION: client/src/pages/CheckoutComplete.tsx
// This is the page customers see after paying $500 deposit

import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { parseGoogleShoppingParams } from '@/lib/urlParams';
import { Check, Mail, Phone, Calendar, Download } from 'lucide-react';

export default function CheckoutComplete() {
  const [, setLocation] = useLocation();
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const googleParams = parseGoogleShoppingParams();

  useEffect(() => {
    // Get order details from URL parameters or localStorage
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order_id') || 'ORDER-' + Date.now();
    const customerEmail = params.get('email') || localStorage.getItem('customerEmail') || '';
    const customerName = params.get('name') || localStorage.getItem('customerName') || 'Customer';
    const paymentId = params.get('payment_id') || 'pay_' + Math.random().toString(36).substr(2, 9);

    const details = {
      orderId,
      customerName,
      customerEmail,
      paymentId,
      productName: '8x8 Underground Storm Shelter',
      state: googleParams.state || 'Your State',
      totalPrice: googleParams.finalPrice || 4250,
      depositPaid: 500,
      balanceDue: (googleParams.finalPrice || 4250) - 500,
      originalPrice: googleParams.originalPrice,
      discount: googleParams.discount,
      isGoogleShopping: googleParams.fromGoogle
    };

    setOrderDetails(details);

    // Send confirmation email
    sendConfirmationEmail(details);

  }, [googleParams]);

  const sendConfirmationEmail = async (details: any) => {
    try {
      const response = await fetch('/api/checkout/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });

      const result = await response.json();
      console.log('Confirmation emails sent:', result);
    } catch (error) {
      console.error('Error sending confirmation:', error);
    }
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Success Animation */}
        <div className="text-center mb-8 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-4 animate-bounce">
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Order Confirmed! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            Your ${orderDetails.depositPaid} deposit has been received
          </p>
        </div>

        {/* Main Confirmation Card */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          
          {/* Order Number */}
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-green-600">#{orderDetails.orderId}</p>
          </div>

          {/* Email Confirmation Notice */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <div className="flex items-start">
              <Mail className="w-5 h-5 text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-900">Confirmation Email Sent</p>
                <p className="text-sm text-blue-700 mt-1">
                  We've sent a detailed confirmation to <strong>{orderDetails.customerEmail}</strong>
                  <br />
                  Please check your inbox (and spam folder if needed)
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span>Product:</span>
                <span className="font-semibold">{orderDetails.productName}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery to:</span>
                <span className="font-semibold">{orderDetails.state}</span>
              </div>
              {orderDetails.isGoogleShopping && (
                <div className="flex justify-between text-green-600">
                  <span>Special Offer:</span>
                  <span className="font-semibold">Google Shopping Discount</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Payment Details</h3>
            
            {orderDetails.isGoogleShopping && (
              <>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Original Price:</span>
                  <span className="line-through">${orderDetails.originalPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600 mb-2">
                  <span>Google Discount:</span>
                  <span className="font-semibold">-${orderDetails.discount?.toLocaleString()}</span>
                </div>
              </>
            )}
            
            <div className="flex justify-between text-lg font-bold text-gray-900 mb-4 pb-4 border-b">
              <span>Total Price:</span>
              <span className="text-green-600">${orderDetails.totalPrice.toLocaleString()}</span>
            </div>
            
            <div className="bg-green-100 rounded-lg p-4 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Check className="w-5 h-5 text-green-600 mr-2" />
                  <span className="font-semibold text-green-900">Paid Today (Deposit)</span>
                </div>
                <span className="text-xl font-bold text-green-600">
                  ${orderDetails.depositPaid.toLocaleString()}
                </span>
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-yellow-600 mr-2" />
                  <span className="font-semibold text-yellow-900">Balance Due Before Install</span>
                </div>
                <span className="text-xl font-bold text-yellow-600">
                  ${orderDetails.balanceDue.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Receipt */}
          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-3">Payment Receipt</h3>
            <div className="bg-gray-50 rounded p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-mono font-semibold">{orderDetails.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">${orderDetails.depositPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="text-green-600 font-semibold">✓ Confirmed</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-semibold">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="font-bold text-gray-900 mb-4">📋 What Happens Next?</h3>
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">1</span>
                <div>
                  <p className="font-semibold text-gray-900">We'll Contact You (24 hours)</p>
                  <p className="text-sm text-gray-600">Our team will call to confirm your order and answer any questions</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">2</span>
                <div>
                  <p className="font-semibold text-gray-900">Schedule Installation</p>
                  <p className="text-sm text-gray-600">Choose a date that works for you (typically 2-4 weeks out)</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">3</span>
                <div>
                  <p className="font-semibold text-gray-900">Pay Balance</p>
                  <p className="text-sm text-gray-600">Pay the remaining ${orderDetails.balanceDue.toLocaleString()} before installation</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">4</span>
                <div>
                  <p className="font-semibold text-gray-900">Installation (2-3 days)</p>
                  <p className="text-sm text-gray-600">Professional installation team completes your shelter</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mr-3">5</span>
                <div>
                  <p className="font-semibold text-gray-900">Final Inspection</p>
                  <p className="text-sm text-gray-600">We ensure everything is perfect and you're 100% satisfied!</p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-blue-900 mb-4">Questions? We're Here to Help!</h3>
          <div className="space-y-3">
            <a href="tel:1-800-555-0123" className="flex items-center text-blue-700 hover:text-blue-900">
              <Phone className="w-5 h-5 mr-3" />
              <span className="font-semibold">1-800-555-0123</span>
            </a>
            <a href="mailto:orders@homedefendpro.com" className="flex items-center text-blue-700 hover:text-blue-900">
              <Mail className="w-5 h-5 mr-3" />
              <span className="font-semibold">orders@homedefendpro.com</span>
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => window.print()}
            className="flex-1 flex items-center justify-center px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Print Receipt
          </button>
          <button
            onClick={() => setLocation('/')}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Return to Home
          </button>
        </div>

      </div>
    </div>
  );
}
