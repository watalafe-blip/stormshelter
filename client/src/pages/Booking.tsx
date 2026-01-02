import { useState, useEffect, useRef } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, Truck, Loader2, ShieldCheck, Star, Lock, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'wouter';
import { format, addDays, isBefore, startOfDay } from 'date-fns';
import logoImg from '@assets/images-Photoroom_1766984801727.png';
import headerLogoImg from '@assets/home-defend-pro-logo.png';

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
  
  const [addressSuggestions, setAddressSuggestions] = useState<Array<{display: string, city: string, state: string, zip: string}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [mobileOrderOpen, setMobileOrderOpen] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: ''
  });

  const productPrice = 4599;
  const depositAmount = 500;
  const today = startOfDay(new Date());
  const minDate = addDays(today, 7);
  const checkoutContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load Whop checkout script
    const script = document.createElement('script');
    script.src = "https://js.whop.com/static/checkout/loader.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

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

  const billingValid = billingSameAsShipping || 
    (billingInfo.name && billingInfo.email && billingInfo.phone &&
     billingInfo.street && billingInfo.city && billingInfo.state && billingInfo.zip);
  
  const isFormValid = selectedDate && 
    address.street && address.city && address.state && address.zip && 
    customerInfo.name && customerInfo.email && customerInfo.phone &&
    shippingInfo &&
    billingValid;
  
  const effectiveBillingAddress = billingSameAsShipping 
    ? { ...address, name: customerInfo.name } 
    : { street: billingInfo.street, city: billingInfo.city, state: billingInfo.state, zip: billingInfo.zip, name: billingInfo.name };

  return (
    <div className="min-h-screen bg-stone-100" data-testid="booking-page">
      <header className="bg-white border-b border-stone-200 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/">
            <img src={headerLogoImg} alt="Home Defend Pro" className="h-10 w-auto cursor-pointer" />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-[#E69138] transition-colors">Home</Link>
            <Link href="/about" className="text-gray-600 hover:text-[#E69138] transition-colors">About Us</Link>
            <Link href="/contact" className="text-gray-600 hover:text-[#E69138] transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-2 text-sm text-stone-600">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-stone-200 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-center">
            <div className="flex items-center gap-2">
              <span className="text-lg md:text-xl font-bold text-gray-900">2,000,000+</span>
              <span className="text-xs md:text-sm text-gray-600">HAPPY CUSTOMERS</span>
            </div>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 fill-[#E69138] text-[#E69138]" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Order Summary - Collapsible */}
      <div className="md:hidden bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4">
          <button 
            onClick={() => setMobileOrderOpen(!mobileOrderOpen)}
            className="w-full flex items-center justify-between py-4"
            data-testid="mobile-order-toggle"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#E69138] font-medium">Order summary</span>
              {mobileOrderOpen ? (
                <ChevronUp className="w-4 h-4 text-[#E69138]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#E69138]" />
              )}
            </div>
            <span className="font-bold text-lg">${depositAmount.toLocaleString()}</span>
          </button>
          
          {mobileOrderOpen && (
            <div className="pb-4 space-y-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-stone-100 rounded-lg flex items-center justify-center">
                  <img 
                    src={logoImg} 
                    alt="Storm Shelter" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">Underground Storm Shelter</p>
                  <p className="text-xs text-gray-500">Stock #706900</p>
                  <p className="text-sm font-medium mt-1">${productPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2 text-sm">
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

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Due today (deposit)</span>
                  <span className="font-medium">${depositAmount}</span>
                </div>
                <p className="text-xs text-gray-500">
                  Remaining balance of ${(totalForFull - depositAmount).toLocaleString()} will be invoiced before delivery.
                </p>
              </div>

              {selectedDate && (
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Delivery date</span>
                    <span>{format(selectedDate, 'MMM d, yyyy')}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[1fr_400px] gap-8">
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
                <p className="text-xs text-gray-500 text-center mt-3">
                  You can update your delivery details anytime before your scheduled delivery date.
                </p>
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
                  <div className="flex justify-between items-center text-sm pt-2" data-testid="shipping-info">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">${shippingInfo.shippingFee.toLocaleString()}</span>
                  </div>
                )}

                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Checkbox 
                      id="billingSame" 
                      checked={billingSameAsShipping}
                      onCheckedChange={(checked) => setBillingSameAsShipping(checked === true)}
                      data-testid="checkbox-billing-same"
                    />
                    <label htmlFor="billingSame" className="text-sm text-gray-700 cursor-pointer">
                      Billing information same as shipping
                    </label>
                  </div>

                  {!billingSameAsShipping && (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="billingName">Full Name</Label>
                          <Input 
                            id="billingName"
                            placeholder="John Smith"
                            value={billingInfo.name}
                            onChange={(e) => setBillingInfo({ ...billingInfo, name: e.target.value })}
                            data-testid="input-billing-name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingCompany">Company (optional)</Label>
                          <Input 
                            id="billingCompany"
                            placeholder="Company name"
                            value={billingInfo.company}
                            onChange={(e) => setBillingInfo({ ...billingInfo, company: e.target.value })}
                            data-testid="input-billing-company"
                          />
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="billingEmail">Email</Label>
                          <Input 
                            id="billingEmail"
                            type="email"
                            placeholder="email@example.com"
                            value={billingInfo.email}
                            onChange={(e) => setBillingInfo({ ...billingInfo, email: e.target.value })}
                            data-testid="input-billing-email"
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingPhone">Phone</Label>
                          <Input 
                            id="billingPhone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={billingInfo.phone}
                            onChange={(e) => setBillingInfo({ ...billingInfo, phone: e.target.value })}
                            data-testid="input-billing-phone"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="billingStreet">Billing Address</Label>
                        <Input 
                          id="billingStreet"
                          placeholder="Street Address"
                          value={billingInfo.street}
                          onChange={(e) => setBillingInfo({ ...billingInfo, street: e.target.value })}
                          data-testid="input-billing-street"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <Input 
                          placeholder="City"
                          value={billingInfo.city}
                          onChange={(e) => setBillingInfo({ ...billingInfo, city: e.target.value })}
                          data-testid="input-billing-city"
                        />
                        <Input 
                          placeholder="State"
                          value={billingInfo.state}
                          onChange={(e) => setBillingInfo({ ...billingInfo, state: e.target.value })}
                          data-testid="input-billing-state"
                        />
                        <Input 
                          placeholder="ZIP"
                          value={billingInfo.zip}
                          onChange={(e) => setBillingInfo({ ...billingInfo, zip: e.target.value })}
                          data-testid="input-billing-zip"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Complete Your Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="min-h-[400px] w-full whop-checkout-container" ref={checkoutContainerRef}>
                  <div
                    key={customerInfo.email} // Re-render when email changes to update prefill in HTML embed
                    data-whop-checkout-plan-id="plan_0uXfZPdIAvES2"
                    data-whop-checkout-theme="light"
                    data-whop-checkout-theme-accent-color="orange"
                    data-whop-checkout-hide-email="true"
                    data-whop-checkout-hide-address="true"
                    data-whop-checkout-hide-tos="true"
                    data-whop-checkout-prefill-email={customerInfo.email}
                    data-whop-checkout-prefill-name={customerInfo.name}
                  ></div>
                </div>

                <p className="text-xs text-gray-500 text-center pb-4 border-b">
                  By clicking purchase, you agree to our <a href="https://assets-2-prod.whop.com/uploads/user_20314880/other/bots/2026-01-02/8155c636-5290-4808-838b-6e4560f35e6f.pdf" target="_blank" rel="noopener noreferrer" className="text-[#E69138] underline">Terms and Conditions</a> and acknowledge that the $500 deposit is non-refundable.
                </p>

                <div className="flex items-center justify-center gap-2 text-gray-500 text-sm pt-2">
                  <Lock className="w-4 h-4" />
                  <span>Secure and encrypted</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="hidden md:block md:sticky md:top-8 h-fit">
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

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Due today (deposit)</span>
                    <span className="font-medium">${depositAmount}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Remaining balance of ${(totalForFull - depositAmount).toLocaleString()} will be invoiced before delivery.
                  </p>
                </div>

                {selectedDate && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Delivery date</span>
                      <span>{format(selectedDate, 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm">
            <Link href="/about" className="text-[#E69138] hover:underline">About Us</Link>
            <a href="https://assets-2-prod.whop.com/uploads/user_20314880/other/bots/2026-01-02/8155c636-5290-4808-838b-6e4560f35e6f.pdf" target="_blank" rel="noopener noreferrer" className="text-[#E69138] hover:underline">Refund policy</a>
            <a href="https://assets-2-prod.whop.com/uploads/user_20314880/other/bots/2026-01-02/8155c636-5290-4808-838b-6e4560f35e6f.pdf" target="_blank" rel="noopener noreferrer" className="text-[#E69138] hover:underline">Shipping</a>
            <a href="https://assets-2-prod.whop.com/uploads/user_20314880/other/bots/2026-01-02/8155c636-5290-4808-838b-6e4560f35e6f.pdf" target="_blank" rel="noopener noreferrer" className="text-[#E69138] hover:underline">Privacy policy</a>
            <a href="https://assets-2-prod.whop.com/uploads/user_20314880/other/bots/2026-01-02/8155c636-5290-4808-838b-6e4560f35e6f.pdf" target="_blank" rel="noopener noreferrer" className="text-[#E69138] hover:underline">Terms of service</a>
            <a href="https://assets-2-prod.whop.com/uploads/user_20314880/other/bots/2026-01-02/8155c636-5290-4808-838b-6e4560f35e6f.pdf" target="_blank" rel="noopener noreferrer" className="text-[#E69138] hover:underline">Cancellations</a>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            By ordering, you agree to our <a href="https://assets-2-prod.whop.com/uploads/user_20314880/other/bots/2026-01-02/8155c636-5290-4808-838b-6e4560f35e6f.pdf" target="_blank" rel="noopener noreferrer" className="text-[#E69138] underline">Terms of Service</a> and acknowledge our <a href="https://assets-2-prod.whop.com/uploads/user_20314880/other/bots/2026-01-02/8155c636-5290-4808-838b-6e4560f35e6f.pdf" target="_blank" rel="noopener noreferrer" className="text-[#E69138] underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
