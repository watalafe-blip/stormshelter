import { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, CreditCard, Truck, CheckCircle, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { format, addDays, isBefore, startOfDay } from 'date-fns';

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

  const handleSubmit = async () => {
    if (!selectedDate || !shippingInfo) return;
    
    setIsSubmitting(true);
    try {
      const bookingData = {
        selectedDate: format(selectedDate, 'yyyy-MM-dd'),
        slotId: '',
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        deliveryAddress: address.street,
        deliveryCity: address.city,
        deliveryState: address.state,
        deliveryZip: address.zip,
        milesFromHq: shippingInfo.miles.toString(),
        shippingFee: shippingInfo.shippingFee.toString(),
        productPrice: productPrice.toString(),
        totalDue: paymentOption === 'full' 
          ? (productPrice + shippingInfo.shippingFee).toString()
          : depositAmount.toString(),
        paymentOption,
        notes: null
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        setLocation('/checkout');
      } else {
        console.error('Booking failed');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
    setIsSubmitting(false);
  };

  const isDateDisabled = (date: Date) => {
    return isBefore(date, minDate);
  };

  const canProceedFromDate = selectedDate && slotInfo && slotInfo.available > 0;
  const canProceedFromAddress = address.street && address.city && address.state && address.zip && shippingInfo;
  const canSubmit = customerInfo.name && customerInfo.email && customerInfo.phone;

  const totalForFull = shippingInfo ? productPrice + shippingInfo.shippingFee : productPrice;

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white" data-testid="booking-page">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8" data-testid="back-home">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </Link>

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
          <Card className="max-w-md mx-auto" data-testid="step-date">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#E69138]" />
                Select Delivery Date
              </CardTitle>
              <CardDescription>
                Choose your preferred installation date (minimum 7 days from today)
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={isDateDisabled}
                className="rounded-md border"
                data-testid="calendar"
              />
              
              {selectedDate && (
                <div className="mt-4 p-4 bg-stone-50 rounded-lg w-full" data-testid="slot-info">
                  <p className="font-medium text-gray-900">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                  {isLoadingSlot ? (
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Checking availability...
                    </p>
                  ) : slotInfo ? (
                    <p className={`text-sm ${slotInfo.available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {slotInfo.available > 0 
                        ? `${slotInfo.available} of ${slotInfo.total} slots available`
                        : 'No slots available - please select another date'}
                    </p>
                  ) : null}
                </div>
              )}

              <Button 
                className="w-full mt-6 bg-[#E69138] hover:bg-[#d4812f]"
                disabled={!canProceedFromDate}
                onClick={() => setStep('address')}
                data-testid="btn-next-address"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
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
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input 
                  id="street"
                  placeholder="123 Main Street"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  data-testid="input-street"
                />
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
                  <p className="text-xs text-blue-600 mt-1">Calculated at $6/mile</p>
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
                Payment Options
              </CardTitle>
              <CardDescription>
                Choose how you'd like to pay
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                  <div className="flex justify-between font-bold pt-2 border-t mt-2">
                    <span>Total</span>
                    <span>${totalForFull.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Payment Option</Label>
                <RadioGroup 
                  value={paymentOption} 
                  onValueChange={(v) => setPaymentOption(v as 'deposit' | 'full')}
                  className="mt-3 space-y-3"
                >
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentOption === 'deposit' ? 'border-[#E69138] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <RadioGroupItem value="deposit" id="deposit" className="mr-3" />
                    <div className="flex-1">
                      <p className="font-medium">$500 Deposit</p>
                      <p className="text-sm text-gray-500">Reserve your slot, pay the rest before delivery</p>
                    </div>
                    <span className="font-bold text-lg">$500</span>
                  </label>
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    paymentOption === 'full' ? 'border-[#E69138] bg-orange-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <RadioGroupItem value="full" id="full" className="mr-3" />
                    <div className="flex-1">
                      <p className="font-medium">Pay in Full</p>
                      <p className="text-sm text-gray-500">Complete payment now, includes shipping</p>
                    </div>
                    <span className="font-bold text-lg">${totalForFull.toLocaleString()}</span>
                  </label>
                </RadioGroup>
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

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setStep('address')}
                  data-testid="btn-back-address"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
                <Button 
                  className="flex-1 bg-[#E69138] hover:bg-[#d4812f]"
                  disabled={!canSubmit || isSubmitting}
                  onClick={handleSubmit}
                  data-testid="btn-proceed-checkout"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
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
