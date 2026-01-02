import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CalendarDays, Truck, Loader2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Link } from 'wouter';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import logoImg from '@assets/images-Photoroom_1766984801727.png';
import { WhopCheckoutEmbed } from "@whop/checkout/react";

interface ShippingInfo {
  miles: number;
  shippingFee: number;
}

export default function Booking() {
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
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedRefund, setAgreedRefund] = useState(false);
  const [addressSuggestions, setAddressSuggestions] = useState<Array<{display: string, city: string, state: string, zip: string}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  const isDateDisabled = (date: Date) => {
    return isBefore(date, minDate);
  };

  const totalForFull = shippingInfo ? productPrice + shippingInfo.shippingFee : productPrice;

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

  const isFormValid = selectedDate && 
    address.street && address.city && address.state && address.zip && 
    customerInfo.name && customerInfo.email && customerInfo.phone &&
    shippingInfo &&
    agreedTerms && agreedRefund;

  return (
    <div className="min-h-screen bg-stone-100" data-testid="booking-page">
      <div className="bg-white border-b border-stone-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/">
            <img src={logoImg} alt="Home Defend" className="h-12 w-auto" />
          </Link>
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr,400px] gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarDays className="w-5 h-5 text-[#E69138]" />
                  Delivery Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={isDateDisabled}
                  className="rounded-md border w-full [&_table]:w-full [&_td]:p-2 [&_th]:p-2 [&_button]:w-full [&_button]:h-10"
                  data-testid="calendar"
                />
                {selectedDate && (
                  <div className="mt-4 p-3 bg-stone-50 rounded-lg text-center" data-testid="slot-info">
                    <p className="font-medium text-gray-900">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                    {isLoadingSlot ? (
                      <p className="text-sm text-gray-500 flex items-center justify-center gap-2 mt-1">
                        <Loader2 className="w-4 h-4 animate-spin" /> Checking availability...
                      </p>
                    ) : slotInfo ? (
                      <p className={`text-sm mt-1 ${slotInfo.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {slotInfo.available > 0 
                          ? `${slotInfo.available} slots available`
                          : 'No slots available - please select another date'}
                      </p>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Truck className="w-5 h-5 text-[#E69138]" />
                  Delivery & Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
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

                <div className="pt-4 border-t">
                  <Label className="text-base font-medium mb-3 block">Delivery Address</Label>
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
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city"
                        placeholder="City"
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
                    <div>
                      <Label htmlFor="zip">ZIP</Label>
                      <Input 
                        id="zip"
                        placeholder="64030"
                        value={address.zip}
                        onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                        data-testid="input-zip"
                      />
                    </div>
                  </div>
                </div>

                {isCalculating && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm p-3 bg-stone-50 rounded-lg">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Calculating shipping...
                  </div>
                )}

                {shippingInfo && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100" data-testid="shipping-info">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-blue-700">
                        Delivery from Grandview, MO ({shippingInfo.miles.toFixed(0)} mi)
                      </span>
                      <span className="font-bold text-blue-900">
                        ${shippingInfo.shippingFee.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Complete Your Payment</CardTitle>
                <p className="text-sm text-gray-500 mt-1">Billing address will be collected during payment</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 pb-4 border-b">
                  <div className="flex items-start space-x-3">
                    <Checkbox 
                      id="terms" 
                      checked={agreedTerms}
                      onCheckedChange={(checked) => setAgreedTerms(checked === true)}
                      data-testid="checkbox-terms"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-600 leading-tight cursor-pointer">
                      I agree to the <a href="#" className="text-[#E69138] underline">Terms and Conditions</a> including the delivery requirements.
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
                      I understand the $500 deposit is non-refundable once the order is placed.
                    </label>
                  </div>
                </div>

                {!isFormValid ? (
                  <div className="p-6 bg-stone-50 rounded-lg border border-stone-200 text-center">
                    <p className="text-gray-600 mb-3">Please complete the following to proceed:</p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      {!selectedDate && <li>Select a delivery date</li>}
                      {!customerInfo.name && <li>Enter your full name</li>}
                      {!customerInfo.email && <li>Enter your email address</li>}
                      {!customerInfo.phone && <li>Enter your phone number</li>}
                      {(!address.street || !address.city || !address.state || !address.zip) && <li>Enter your delivery address</li>}
                      {!shippingInfo && address.zip && <li>Wait for shipping calculation</li>}
                      {!agreedTerms && <li>Agree to Terms and Conditions</li>}
                      {!agreedRefund && <li>Acknowledge the refund policy</li>}
                    </ul>
                  </div>
                ) : (
                  <div className="rounded-lg overflow-hidden border border-gray-200 min-h-[400px]">
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
                          <span className="ml-2 text-gray-600">Loading payment form...</span>
                        </div>
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="lg:hidden">
              <Link href="/">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:sticky lg:top-8 h-fit">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-20 h-20 bg-stone-100 rounded-lg flex items-center justify-center">
                    <img 
                      src={logoImg} 
                      alt="Storm Shelter" 
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Underground Storm Shelter</p>
                    <p className="text-sm text-gray-500">Stock #706900</p>
                    <p className="text-sm font-medium mt-1">${productPrice.toLocaleString()}</p>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${productPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Shipping {shippingInfo ? `(${shippingInfo.miles.toFixed(0)} mi)` : ''}
                    </span>
                    <span>
                      {shippingInfo ? `$${shippingInfo.shippingFee.toLocaleString()}` : 'Enter address'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t font-medium">
                    <span>Total</span>
                    <span>${totalForFull.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-[#E69138]/10 border border-[#E69138] rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-[#3E2723]">Due Today</p>
                      <p className="text-xs text-gray-600">Non-refundable deposit</p>
                    </div>
                    <span className="font-bold text-2xl text-[#E69138]">${depositAmount}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800">
                    Remaining balance of ${(totalForFull - depositAmount).toLocaleString()} will be invoiced before delivery.
                  </p>
                </div>

                {selectedDate && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Delivery:</strong> {format(selectedDate, 'MMMM d, yyyy')}
                    </p>
                  </div>
                )}

                <div className="hidden lg:block pt-4">
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
