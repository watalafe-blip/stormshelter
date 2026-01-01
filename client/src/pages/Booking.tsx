import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, CreditCard, Truck, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import logoImg from '@assets/images-Photoroom_1766984801727.png';
import { WhopCheckoutEmbed } from "@whop/checkout/react";

type Step = 'date' | 'address' | 'payment';

interface ShippingInfo {
  miles: number;
  shippingFee: number;
}

export default function Booking() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>('date');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [slotInfo, setSlotInfo] = useState<{ available: number; total: number } | null>(null);
  const [isLoadingSlot, setIsLoadingSlot] = useState(false);
  
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: ''
  });
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  
  const [paymentOption, setPaymentOption] = useState<'deposit' | 'full'>('deposit');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedRefund, setAgreedRefund] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<Array<{display: string, city: string, state: string, zip: string}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);

  const productPrice = 4999;
  const depositAmount = 500;
  const today = startOfDay(new Date());
  const minDate = addDays(today, 7);

  useEffect(() => {
    if (selectedDate) {
      fetchSlotInfo(selectedDate);
    }
  }, [selectedDate]);

  const fetchSlotInfo = async (date: Date) => {
    setIsLoadingSlot(true);
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      const response = await fetch(`/api/slots/${dateStr}`);
      if (response.ok) {
        const slot = await response.json();
        setSlotInfo({
          available: slot.capacity - slot.reservedCount,
          total: slot.capacity
        });
      }
    } catch (error) {
      console.error('Error fetching slot:', error);
    }
    setIsLoadingSlot(false);
  };

  const calculateShipping = async () => {
    if (!address.zip || address.zip.length < 5) return;
    
    setIsCalculating(true);
    try {
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${address.zip}&country=US&format=json`
      );
      const geocodeData = await geocodeResponse.json();
      
      if (geocodeData && geocodeData.length > 0) {
        const { lat, lon } = geocodeData[0];
        const response = await fetch('/api/calculate-shipping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lon) })
        });
        
        if (response.ok) {
          const data = await response.json();
          setShippingInfo(data);
        }
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
    }
    setIsCalculating(false);
  };

  useEffect(() => {
    if (address.zip && address.zip.length >= 5) {
      const timer = setTimeout(calculateShipping, 500);
      return () => clearTimeout(timer);
    }
  }, [address.zip]);

  const handleProceedToCheckout = async () => {
    if (!selectedDate || !shippingInfo) return;
    
    setIsSubmitting(true);
    try {
      const bookingData = {
        selectedDate: format(selectedDate, 'yyyy-MM-dd'),
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        deliveryAddress: address.street,
        deliveryCity: address.city,
        deliveryState: address.state,
        deliveryZip: address.zip,
        milesFromHq: shippingInfo.miles,
        paymentOption,
        notes: null
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        const booking = await response.json();
        setBookingId(booking.id);
        setShowCheckout(true);
      } else {
        const errorData = await response.json();
        console.error('Booking failed:', errorData);
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
    setIsSubmitting(false);
  };

  const getReturnUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/checkout/complete?bookingId=${bookingId}`;
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(date, minDate);
  };

  const canProceedFromDate = selectedDate && slotInfo && slotInfo.available > 0;
  const canProceedFromAddress = address.street && address.city && address.state && address.zip && shippingInfo;
  const canSubmit = customerInfo.name && customerInfo.email && customerInfo.phone && agreedTerms && agreedRefund;

  const totalForFull = shippingInfo ? productPrice + shippingInfo.shippingFee : productPrice;
  const amountDueNow = paymentOption === 'deposit' ? depositAmount : totalForFull;

  const searchAddress = async (query: string) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=us&format=json&addressdetails=1&limit=5`
      );
      const data = await response.json();
      const suggestions = data.map((item: any) => ({
        display: item.display_name,
        city: item.address?.city || item.address?.town || item.address?.village || '',
        state: item.address?.state || '',
        zip: item.address?.postcode || ''
      })).filter((s: any) => s.city && s.state);
      setAddressSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching address:', error);
    }
  };

  const selectSuggestion = (suggestion: {display: string, city: string, state: string, zip: string}) => {
    const streetPart = suggestion.display.split(',')[0];
    setAddress({
      street: streetPart,
      city: suggestion.city,
      state: suggestion.state,
      zip: suggestion.zip
    });
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white" data-testid="booking-page">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900" data-testid="back-home">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </button>
          </Link>
          <Link href="/">
            <img src={logoImg} alt="Home Defend" className="h-16 w-auto" />
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Schedule Your Delivery</h1>
          <p className="text-gray-600">Book your storm shelter installation in 3 easy steps</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[
              { id: 'date', label: 'Date', icon: CalendarDays },
              { id: 'address', label: 'Address', icon: MapPin },
              { id: 'payment', label: 'Payment', icon: CreditCard }
            ].map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                  step === s.id 
                    ? 'bg-[#E69138] text-white' 
                    : i < ['date', 'address', 'payment'].indexOf(step)
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                }`}>
                  {i < ['date', 'address', 'payment'].indexOf(step) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <s.icon className="w-4 h-4" />
                  )}
                  <span className="font-medium text-sm">{s.label}</span>
                </div>
                {i < 2 && <div className="w-12 h-0.5 bg-gray-200 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {step === 'date' && (
          <Card className="max-w-2xl mx-auto" data-testid="step-date">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-xl">
                <CalendarDays className="w-6 h-6 text-[#E69138]" />
                Select Delivery Date
              </CardTitle>
              <CardDescription className="text-base">
                Choose your preferred installation date (minimum 7 days from today)
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  if (date) {
                    setTimeout(() => setStep('address'), 300);
                  }
                }}
                disabled={isDateDisabled}
                className="w-full rounded-md border p-6 [&_table]:w-full [&_td]:p-3 [&_th]:p-3 [&_button]:w-full [&_button]:h-12 [&_button]:text-base"
                data-testid="calendar"
              />
              
              {selectedDate && (
                <div className="mt-8 p-4 bg-stone-50 rounded-lg w-full text-center" data-testid="slot-info">
                  <p className="font-medium text-gray-900 text-lg">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                  {isLoadingSlot ? (
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-2 mt-1">
                      <Loader2 className="w-4 h-4 animate-spin" /> Checking availability...
                    </p>
                  ) : slotInfo ? (
                    <p className={`text-sm mt-1 ${slotInfo.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {slotInfo.available > 0 
                        ? `${slotInfo.available} of ${slotInfo.total} slots available`
                        : 'No slots available - please select another date'}
                    </p>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 'address' && (
          <Card className="max-w-lg mx-auto" data-testid="step-address">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#E69138]" />
                Delivery Address
              </CardTitle>
              <CardDescription>
                Enter where you want the storm shelter installed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Label htmlFor="street">Street Address</Label>
                <Input 
                  id="street"
                  placeholder="Start typing your address..."
                  value={address.street}
                  onChange={(e) => {
                    setAddress({ ...address, street: e.target.value });
                    searchAddress(e.target.value);
                  }}
                  onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  data-testid="input-street"
                />
                {showSuggestions && addressSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {addressSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 border-b border-gray-100 last:border-0"
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        {suggestion.display}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city"
                    placeholder="Kansas City"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    data-testid="input-city"
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input 
                    id="state"
                    placeholder="MO"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    data-testid="input-state"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input 
                  id="zip"
                  placeholder="64030"
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  data-testid="input-zip"
                />
              </div>

              {isCalculating && (
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Calculating shipping...
                </div>
              )}

              {shippingInfo && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100" data-testid="shipping-info">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Shipping Estimate</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Distance from Grandview, MO: <strong>{shippingInfo.miles.toFixed(0)} miles</strong>
                  </p>
                  <p className="text-lg font-bold text-blue-900 mt-1">
                    Shipping: ${shippingInfo.shippingFee.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Calculated at $5.20/mile</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('date')}
                  data-testid="btn-back-date"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button 
                  className="flex-1 bg-[#E69138] hover:bg-[#d4812f]"
                  disabled={!canProceedFromAddress}
                  onClick={() => setStep('payment')}
                  data-testid="btn-next-payment"
                >
                  Continue <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 'payment' && (
          <Card className="max-w-lg mx-auto" data-testid="step-payment">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#E69138]" />
                Secure Your Shelter
              </CardTitle>
              <CardDescription>
                Pay your $500 deposit to reserve your production slot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-[#E69138]/10 border border-[#E69138] rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-lg text-[#3E2723]">$500 Deposit (Non-Refundable)</p>
                    <p className="text-sm text-gray-600">Reserve your slot - remaining balance will be invoiced before delivery</p>
                  </div>
                  <span className="font-bold text-2xl text-[#E69138]">$500</span>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-lg">
                <h3 className="font-medium mb-2">Order Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Storm Shelter #706900</span>
                    <span>${productPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping ({shippingInfo?.miles.toFixed(0)} mi)</span>
                    <span>${shippingInfo?.shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t mt-2">
                    <span>Order Total</span>
                    <span>${totalForFull.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2 text-[#E69138]">
                    <span>Due Now (Deposit)</span>
                    <span>${depositAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 text-xs">
                    <span>Remaining balance invoiced before delivery</span>
                    <span>${(totalForFull - depositAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  <strong>Important:</strong> The $500 deposit is non-refundable. It secures your production slot and raw materials. You will receive an invoice for the remaining balance (product + shipping) before delivery.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="font-medium">Contact Information</h3>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name"
                    placeholder="John Smith"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div className="pt-6 border-t" data-testid="whop-checkout-container">
                <h3 className="font-medium mb-4">Complete Your Payment</h3>
                <div className="rounded-lg overflow-hidden border border-gray-200 min-h-[500px]">
                  <WhopCheckoutEmbed
                    planId="plan_0uXfZPdIAvES2"
                    returnUrl={`${window.location.origin}/checkout/complete`}
                    theme="light"
                    prefill={{
                      email: customerInfo.email,
                      address: {
                        name: customerInfo.name,
                        country: "US",
                        line1: address.street,
                        city: address.city,
                        state: address.state,
                        postalCode: address.zip
                      }
                    }}
                    fallback={
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-[#E69138]" />
                        <span className="ml-2 text-gray-600">Loading checkout...</span>
                      </div>
                    }
                  />
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="terms" 
                    checked={agreedTerms}
                    onCheckedChange={(checked) => setAgreedTerms(checked === true)}
                    data-testid="checkbox-terms"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 leading-tight cursor-pointer">
                    I agree to the <a href="#" className="text-[#E69138] underline">Terms and Conditions</a> including the delivery requirements and customer unloading responsibility.
                  </label>
                </div>
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="refund" 
                    checked={agreedRefund}
                    onCheckedChange={(checked) => setAgreedRefund(checked === true)}
                    data-testid="checkbox-refund"
                  />
                  <label htmlFor="refund" className="text-sm text-gray-600 leading-tight cursor-pointer">
                    I understand and accept the <a href="#" className="text-[#E69138] underline">Return Policy</a>. The $500 deposit is non-refundable once the order is placed.
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('address')}
                  data-testid="btn-back-address"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Delivery scheduled for: {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : '—'}</p>
          <p>Shipping from Grandview, MO</p>
        </div>
      </div>
    </div>
  );
}
