
import { Link, useRoute } from 'wouter';
import { Package, ShoppingCart, Users, DollarSign, Settings, Search, Plus, Filter, MoreHorizontal, Trash, Edit, Loader2, Save, FileText, CreditCard, RefreshCw, XCircle, CheckCircle, Palette, Mail, LayoutTemplate, Image as ImageIcon, CalendarDays, MapPin, Phone, Clock } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useStore } from '@/lib/storeContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

interface Booking {
  id: string;
  slotId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryZip: string;
  milesFromHq: string;
  shippingFee: string;
  productPrice: string;
  totalDue: string;
  paymentOption: 'deposit' | 'full';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  bookingStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  whopCheckoutId: string | null;
  notes: string | null;
  createdAt: string;
}

interface DeliverySlot {
  id: string;
  date: string;
  capacity: number;
  reservedCount: number;
  isEnabled: number;
}

function BookingsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [slotCapacity, setSlotCapacity] = useState<number>(3);
  const [isUpdatingSlot, setIsUpdatingSlot] = useState(false);

  const { data: bookings = [], isLoading } = useQuery<Booking[]>({
    queryKey: ['/api/bookings'],
    queryFn: async () => {
      const res = await fetch('/api/bookings');
      return res.json();
    }
  });

  const { data: slots = [] } = useQuery<DeliverySlot[]>({
    queryKey: ['/api/availability'],
    queryFn: async () => {
      const res = await fetch('/api/availability');
      return res.json();
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      toast({ title: "Status Updated", description: "Booking status has been changed." });
      setSelectedBooking(null);
    }
  });

  const updatePaymentMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const res = await fetch(`/api/bookings/${id}/payment-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bookings'] });
      toast({ title: "Payment Updated", description: "Payment status has been changed." });
    }
  });

  const updateSlotCapacity = async () => {
    if (!selectedDate) return;
    setIsUpdatingSlot(true);
    try {
      await fetch('/api/slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          date: format(selectedDate, 'yyyy-MM-dd'),
          capacity: slotCapacity
        })
      });
      queryClient.invalidateQueries({ queryKey: ['/api/availability'] });
      toast({ title: "Capacity Updated", description: `Set ${slotCapacity} slots for ${format(selectedDate, 'MMM d, yyyy')}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update capacity", variant: "destructive" });
    }
    setIsUpdatingSlot(false);
  };

  const getSlotForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return slots.find(s => s.date === dateStr);
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  const getPaymentBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'refunded': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Delivery Bookings</h1>
          <p className="text-muted-foreground">Manage storm shelter delivery reservations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              Slot Management
            </CardTitle>
            <CardDescription>Set delivery capacity per day</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                booked: slots.filter(s => s.reservedCount > 0).map(s => new Date(s.date + 'T12:00:00'))
              }}
              modifiersStyles={{
                booked: { backgroundColor: '#fef3c7', color: '#92400e' }
              }}
            />
            
            {selectedDate && (
              <div className="p-4 bg-stone-50 rounded-lg space-y-3">
                <p className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                {(() => {
                  const slot = getSlotForDate(selectedDate);
                  return (
                    <div className="text-sm text-muted-foreground">
                      {slot ? (
                        <span>{slot.reservedCount} of {slot.capacity} booked</span>
                      ) : (
                        <span>No reservations yet</span>
                      )}
                    </div>
                  );
                })()}
                <div className="flex items-center gap-2">
                  <Label htmlFor="capacity" className="whitespace-nowrap">Max Capacity:</Label>
                  <Input 
                    id="capacity"
                    type="number" 
                    min={1} 
                    max={10}
                    value={slotCapacity}
                    onChange={(e) => setSlotCapacity(parseInt(e.target.value) || 3)}
                    className="w-20"
                  />
                  <Button 
                    size="sm" 
                    onClick={updateSlotCapacity}
                    disabled={isUpdatingSlot}
                  >
                    {isUpdatingSlot ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>{bookings.length} total reservations</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No bookings yet. Customers can book at /booking
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Miles</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div className="font-medium">{booking.customerName}</div>
                        <div className="text-xs text-muted-foreground">{booking.customerEmail}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{booking.deliveryCity}, {booking.deliveryState}</div>
                      </TableCell>
                      <TableCell>{parseFloat(booking.milesFromHq).toFixed(0)} mi</TableCell>
                      <TableCell>
                        <Badge variant={getPaymentBadgeVariant(booking.paymentStatus)} className="capitalize">
                          {booking.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(booking.bookingStatus)} className="capitalize">
                          {booking.bookingStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">${parseFloat(booking.totalDue).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedBooking(booking)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Sheet open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Booking Details</SheetTitle>
            <SheetDescription>
              Created {selectedBooking && format(new Date(selectedBooking.createdAt), 'MMM d, yyyy h:mm a')}
            </SheetDescription>
          </SheetHeader>
          
          {selectedBooking && (
            <div className="space-y-6 py-4">
              <div className="flex gap-2">
                <Badge variant={getStatusBadgeVariant(selectedBooking.bookingStatus)} className="capitalize">
                  {selectedBooking.bookingStatus}
                </Badge>
                <Badge variant={getPaymentBadgeVariant(selectedBooking.paymentStatus)} className="capitalize">
                  Payment: {selectedBooking.paymentStatus}
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">Customer</h3>
                  <div className="space-y-2">
                    <p className="font-medium">{selectedBooking.customerName}</p>
                    <p className="text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4" /> {selectedBooking.customerEmail}
                    </p>
                    <p className="text-sm flex items-center gap-2">
                      <Phone className="w-4 h-4" /> {selectedBooking.customerPhone}
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">Delivery</h3>
                  <div className="space-y-2">
                    <p className="text-sm flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      <span>
                        {selectedBooking.deliveryAddress}<br />
                        {selectedBooking.deliveryCity}, {selectedBooking.deliveryState} {selectedBooking.deliveryZip}
                      </span>
                    </p>
                    <p className="text-sm">
                      <strong>{parseFloat(selectedBooking.milesFromHq).toFixed(0)}</strong> miles from Grandview, MO
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider mb-3">Payment</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Product</span>
                      <span>${parseFloat(selectedBooking.productPrice).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>${parseFloat(selectedBooking.shippingFee).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-bold">
                      <span>{selectedBooking.paymentOption === 'deposit' ? 'Deposit Due' : 'Total Due'}</span>
                      <span>${parseFloat(selectedBooking.totalDue).toLocaleString()}</span>
                    </div>
                    {selectedBooking.paymentOption === 'deposit' && (
                      <p className="text-muted-foreground text-xs pt-2">
                        Remaining balance: ${(parseFloat(selectedBooking.productPrice) + parseFloat(selectedBooking.shippingFee) - parseFloat(selectedBooking.totalDue)).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label>Update Payment Status</Label>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={selectedBooking.paymentStatus === 'paid' ? 'default' : 'outline'}
                    onClick={() => updatePaymentMutation.mutate({ id: selectedBooking.id, status: 'paid' })}
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Paid
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedBooking.paymentStatus === 'pending' ? 'secondary' : 'outline'}
                    onClick={() => updatePaymentMutation.mutate({ id: selectedBooking.id, status: 'pending' })}
                  >
                    <Clock className="w-4 h-4 mr-1" /> Pending
                  </Button>
                  <Button 
                    size="sm" 
                    variant={selectedBooking.paymentStatus === 'refunded' ? 'outline' : 'outline'}
                    onClick={() => updatePaymentMutation.mutate({ id: selectedBooking.id, status: 'refunded' })}
                  >
                    <RefreshCw className="w-4 h-4 mr-1" /> Refunded
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Update Booking Status</Label>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    size="sm"
                    onClick={() => updateStatusMutation.mutate({ id: selectedBooking.id, status: 'confirmed' })}
                    disabled={selectedBooking.bookingStatus === 'confirmed'}
                  >
                    Confirm
                  </Button>
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatusMutation.mutate({ id: selectedBooking.id, status: 'completed' })}
                    disabled={selectedBooking.bookingStatus === 'completed'}
                  >
                    Mark Complete
                  </Button>
                  <Button 
                    size="sm"
                    variant="destructive"
                    onClick={() => updateStatusMutation.mutate({ id: selectedBooking.id, status: 'cancelled' })}
                    disabled={selectedBooking.bookingStatus === 'cancelled'}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function AdminDashboard() {
  const [, params] = useRoute('/admin/:page?');
  const page = params?.page || 'dashboard';
  const { 
    products, addProduct, updateProduct, deleteProduct, 
    orders, addOrder, updateOrder, 
    theme, updateTheme, 
    pages, addPage, updatePage, deletePage,
    shippingProfiles, addShippingProfile, updateShippingProfile,
    notifications
  } = useStore();
  const { toast } = useToast();

  // Local State for Editing
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Navigation State
  const [activeTab, setActiveTab] = useState('theme');

  // Handlers
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const productData = {
      name: formData.get('name') as string,
      price: parseFloat(formData.get('price') as string),
      compareAtPrice: formData.get('compareAtPrice') ? parseFloat(formData.get('compareAtPrice') as string) : undefined,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      image: (formData.get('image') as string) || products[0].image, // Fallback for new product
      inventory: parseInt(formData.get('inventory') as string) || 0,
      status: 'active' as const,
    };

    if (editingProduct) {
      updateProduct(editingProduct, productData);
      toast({ title: "Product Updated", description: "Changes saved successfully." });
    } else {
      addProduct({
        id: `prod-${Date.now()}`,
        ...productData
      });
      toast({ title: "Product Created", description: "New product added to catalog." });
    }

    await new Promise(r => setTimeout(r, 800)); // Simulate delay
    setIsSaving(false);
    setEditingProduct(null);
    setIsAddingProduct(false);
  };
  
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    addOrder({
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      customer: formData.get('customer') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      paymentStatus: 'unpaid',
      total: parseFloat(formData.get('total') as string) || 0,
      shippingCost: parseFloat(formData.get('shippingCost') as string) || 0,
      items: 1, // Simplified for manual creation
    });
    
    await new Promise(r => setTimeout(r, 500));
    setIsSaving(false);
    setIsCreatingOrder(false);
    toast({ title: "Order Created", description: "Manual order has been created." });
  };


  const handleOrderAction = async (action: string) => {
    if (!selectedOrder) return;
    setIsSaving(true);
    
    let status = 'fulfilled';
    if (action === 'Cancelled') status = 'cancelled';
    // In a real app, we'd handle refund logic separately
    
    updateOrder(selectedOrder, { status: status as any });

    await new Promise(r => setTimeout(r, 800));
    setIsSaving(false);
    setSelectedOrder(null);
    toast({ title: `Order ${action}`, description: `Order status has been updated.` });
  };

  const handleThemeUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    updateTheme({
      storeName: formData.get('storeName') as string,
      primaryColor: formData.get('primaryColor') as string,
      announcementBar: formData.get('announcementBar') as string,
    });

    await new Promise(r => setTimeout(r, 800));
    setIsSaving(false);
    toast({ title: "Theme Updated", description: "Storefront appearance has been updated." });
  };

  const currentProduct = products.find(p => p.id === editingProduct);
  const currentOrder = orders.find(o => o.id === selectedOrder);

  // --- RENDER CONTENT BASED ON PAGE ---

  if (page === 'products') {
    return (
       <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog.</p>
          </div>
          <Button onClick={() => setIsAddingProduct(true)}><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
               <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products..." className="pl-8" />
              </div>
              <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Inventory</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted border border-border/50">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.compareAtPrice && product.compareAtPrice > product.price ? <span className="text-destructive text-sm line-through">${product.compareAtPrice.toFixed(2)}</span> : '-'}</TableCell>
                    <TableCell>{product.inventory} in stock</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 capitalize">
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setEditingProduct(product.id)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => deleteProduct(product.id)}>
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit/Add Product Sheet */}
        <Sheet open={!!editingProduct || isAddingProduct} onOpenChange={(open) => {
          if (!open) {
            setEditingProduct(null);
            setIsAddingProduct(false);
          }
        }}>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</SheetTitle>
              <SheetDescription>
                {editingProduct ? 'Update product details.' : 'Add a new product to your catalog.'}
              </SheetDescription>
            </SheetHeader>
            {/* If adding, we use empty defaults. If editing, we use currentProduct */}
            {(editingProduct ? currentProduct : true) && (
              <form id="product-form" onSubmit={handleSaveProduct} className="grid gap-4 py-4">
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted mb-4 relative group cursor-pointer">
                   <img src={editingProduct && currentProduct ? currentProduct.image : "https://placehold.co/600x400"} className="h-full w-full object-cover" alt="Product preview" />
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white font-medium flex items-center gap-2"><ImageIcon size={16}/> Change Image</span>
                   </div>
                   <input type="hidden" name="image" value={editingProduct && currentProduct ? currentProduct.image : ""} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input name="name" id="name" defaultValue={editingProduct && currentProduct ? currentProduct.name : ''} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input name="price" id="price" defaultValue={editingProduct && currentProduct ? currentProduct.price : ''} type="number" step="0.01" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="compareAtPrice">Compare At Price (Discount)</Label>
                    <Input name="compareAtPrice" id="compareAtPrice" defaultValue={editingProduct && currentProduct ? currentProduct.compareAtPrice : ''} type="number" step="0.01" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input name="category" id="category" defaultValue={editingProduct && currentProduct ? currentProduct.category : ''} required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="inventory">Inventory</Label>
                    <Input name="inventory" id="inventory" defaultValue={editingProduct && currentProduct ? currentProduct.inventory : 10} type="number" />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea name="description" id="description" defaultValue={editingProduct && currentProduct ? currentProduct.description : ''} rows={5} />
                </div>
              </form>
            )}
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button type="submit" form="product-form" disabled={isSaving}>
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Product</>}
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
       </div>
    );
  }


  if (page === 'orders') {
    return (
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold">Orders</h1>
            <p className="text-muted-foreground">Manage and fulfill customer orders.</p>
          </div>
          <Button onClick={() => setIsCreatingOrder(true)}><Plus className="mr-2 h-4 w-4" /> Create Order</Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>{order.customer}</div>
                      <div className="text-xs text-muted-foreground">{order.email}</div>
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge variant={
                        order.status === 'fulfilled' ? 'default' : 
                        order.status === 'pending' ? 'secondary' : 
                        order.status === 'cancelled' ? 'destructive' : 'outline'
                      } className="capitalize">
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="capitalize">{order.paymentStatus}</Badge></TableCell>
                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order.id)}>Manage</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Create Manual Order Sheet */}
        <Sheet open={isCreatingOrder} onOpenChange={setIsCreatingOrder}>
          <SheetContent className="sm:max-w-md">
             <SheetHeader className="mb-6">
               <SheetTitle>Create Manual Order</SheetTitle>
               <SheetDescription>Enter details for a manual order.</SheetDescription>
             </SheetHeader>
             <form id="create-order-form" onSubmit={handleCreateOrder} className="space-y-4">
                <div className="grid gap-2">
                   <Label>Customer Name</Label>
                   <Input name="customer" required placeholder="John Doe" />
                </div>
                <div className="grid gap-2">
                   <Label>Email</Label>
                   <Input name="email" type="email" required placeholder="john@example.com" />
                </div>
                <div className="grid gap-2">
                   <Label>Phone</Label>
                   <Input name="phone" type="tel" placeholder="+1 555-0000" />
                </div>
                <div className="grid gap-2">
                   <Label>Shipping Address</Label>
                   <Textarea name="address" placeholder="123 Main St, City, State, ZIP" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="grid gap-2">
                      <Label>Order Total ($)</Label>
                      <Input name="total" type="number" step="0.01" required placeholder="0.00" />
                   </div>
                   <div className="grid gap-2">
                      <Label>Shipping Cost ($)</Label>
                      <Input name="shippingCost" type="number" step="0.01" placeholder="0.00" />
                   </div>
                </div>
             </form>
             <SheetFooter className="mt-6">
                <Button type="submit" form="create-order-form" disabled={isSaving}>
                   {isSaving ? 'Creating...' : 'Create Order'}
                </Button>
             </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Order Details Sheet */}
        <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader className="mb-6">
              <div className="flex items-center justify-between">
                 <SheetTitle>Order {selectedOrder}</SheetTitle>
                 <Badge variant={currentOrder?.status === 'fulfilled' ? 'default' : 'outline'} className="capitalize">
                   {currentOrder?.status}
                 </Badge>
              </div>
              <SheetDescription>
                Placed on {currentOrder?.date}
              </SheetDescription>
            </SheetHeader>
            
            {currentOrder && (
            <div className="space-y-6">
               <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Customer</h3>
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Users size={20} />
                     </div>
                     <div>
                        <p className="font-medium">{currentOrder.customer}</p>
                        <p className="text-sm text-muted-foreground">{currentOrder.email}</p>
                        {currentOrder.phone && <p className="text-sm text-muted-foreground">{currentOrder.phone}</p>}
                     </div>
                  </div>
                  {currentOrder.address && (
                     <div className="pt-2 border-t mt-2">
                        <p className="text-xs text-muted-foreground uppercase mb-1">Shipping Address</p>
                        <p className="text-sm">{currentOrder.address}</p>
                     </div>
                  )}
               </div>

               <div className="space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Items ({currentOrder.items})</h3>
                  {/* Simulation of items based on count */}
                  <div className="flex justify-between items-center py-2 border-b">
                    <div className="flex gap-3">
                       <div className="h-12 w-12 bg-muted rounded overflow-hidden">
                          <img src={products[0].image} className="h-full w-full object-cover" />
                       </div>
                       <div>
                          <p className="font-medium text-sm">{products[0].name}</p>
                          <p className="text-xs text-muted-foreground">Qty: 1</p>
                       </div>
                    </div>
                    <p className="text-sm font-medium">${products[0].price}</p>
                  </div>
                  
                  <div className="space-y-2 pt-2 mt-4">
                     <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${(currentOrder.total - (currentOrder.shippingCost || 0)).toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>${(currentOrder.shippingCost || 0).toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between font-bold border-t border-dashed pt-2">
                        <span>Total</span>
                        <span>${currentOrder.total.toFixed(2)}</span>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-3 pt-4">
                  <Button variant="outline" className="w-full text-destructive hover:text-destructive" onClick={() => handleOrderAction('Cancelled')}>
                     <XCircle className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => handleOrderAction('Refunded')}>
                     <RefreshCw className="mr-2 h-4 w-4" /> Refund
                  </Button>
                  <Button className="w-full col-span-2" onClick={() => handleOrderAction('Fulfilled')}>
                     <CheckCircle className="mr-2 h-4 w-4" /> Mark as Fulfilled
                  </Button>
               </div>
            </div>
            )}
          </SheetContent>
        </Sheet>
      </div>
    );
  }


  if (page === 'pages') {
    return (
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
         <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold">Online Store</h1>
            <p className="text-muted-foreground">Manage theme, content, and navigation.</p>
          </div>
        </div>

        <Tabs defaultValue="theme">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
             <TabsTrigger value="theme">Theme</TabsTrigger>
             <TabsTrigger value="content">Pages</TabsTrigger>
             <TabsTrigger value="navigation">Navigation</TabsTrigger>
             <TabsTrigger value="homepage">Home Page</TabsTrigger>
          </TabsList>
          
          <TabsContent value="theme" className="mt-6 space-y-6">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Preview Card */}
                <Card className="bg-muted/30 border-dashed">
                   <CardHeader>
                      <CardTitle>Live Preview</CardTitle>
                      <CardDescription>Real-time preview of your storefront settings.</CardDescription>
                   </CardHeader>
                   <CardContent>
                      <div className="border rounded-lg bg-background shadow-sm overflow-hidden">
                         <div className="h-12 border-b flex items-center px-4 justify-between" style={{ background: '#fff' }}>
                            <span className={`font-bold text-lg ${theme.typography.heading === 'serif' ? 'font-serif' : 'font-sans'}`}>{theme.storeName}</span>
                            <div className="flex gap-2">
                               <div className="w-4 h-4 rounded-full bg-muted"></div>
                               <div className="w-4 h-4 rounded-full bg-muted"></div>
                            </div>
                         </div>
                         <div className="p-8 text-center space-y-4">
                            <h3 className={`text-2xl ${theme.typography.heading === 'serif' ? 'font-serif' : 'font-sans'}`}>Hero Title</h3>
                            <Button style={{ backgroundColor: `hsl(${theme.primaryColor})`, color: 'white' }}>Shop Now</Button>
                         </div>
                         <div className="h-8 bg-black text-white text-xs flex items-center justify-center">
                            {theme.announcementBar}
                         </div>
                      </div>
                   </CardContent>
                </Card>

                {/* Settings Form */}
                <Card>
                   <CardHeader>
                      <CardTitle>Theme Customization</CardTitle>
                      <CardDescription>Update your store's look and feel.</CardDescription>
                   </CardHeader>
                   <CardContent>
                      <form onSubmit={handleThemeUpdate} className="space-y-4">
                         <div className="space-y-2">
                            <Label>Store Name</Label>
                            <Input name="storeName" defaultValue={theme.storeName} />
                         </div>
                         <div className="space-y-2">
                            <Label>Primary Color (HSL)</Label>
                            <div className="flex gap-2">
                               <Input name="primaryColor" defaultValue={theme.primaryColor} />
                               <div className="w-10 h-10 rounded border shrink-0" style={{ backgroundColor: `hsl(${theme.primaryColor})` }}></div>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <Label>Announcement Bar</Label>
                            <Input name="announcementBar" defaultValue={theme.announcementBar} />
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="space-y-2">
                               <Label>Headings Font</Label>
                               <div className="flex items-center gap-2 border p-2 rounded-md">
                                  <Switch 
                                    checked={theme.typography.heading === 'serif'} 
                                    onCheckedChange={(checked) => updateTheme({ typography: { ...theme.typography, heading: checked ? 'serif' : 'sans' } })} 
                                  />
                                  <span className="text-sm">{theme.typography.heading === 'serif' ? 'Serif (Classic)' : 'Sans (Modern)'}</span>
                               </div>
                            </div>
                            <div className="space-y-2">
                               <Label>Body Font</Label>
                               <div className="flex items-center gap-2 border p-2 rounded-md">
                                  <Switch 
                                    checked={theme.typography.body === 'serif'} 
                                    onCheckedChange={(checked) => updateTheme({ typography: { ...theme.typography, body: checked ? 'serif' : 'sans' } })} 
                                  />
                                  <span className="text-sm">{theme.typography.body === 'serif' ? 'Serif' : 'Sans'}</span>
                               </div>
                            </div>
                         </div>

                         <div className="space-y-2">
                            <Label>Logo</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer">
                               <ImageIcon className="h-8 w-8 mb-2" />
                               <span className="text-sm">Click to upload logo</span>
                            </div>
                         </div>
                         <Button type="submit" disabled={isSaving} className="w-full">
                           {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Save Theme Settings'}
                         </Button>
                      </form>
                   </CardContent>
                </Card>
             </div>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                   <div>
                     <CardTitle>Pages</CardTitle>
                     <CardDescription>Manage static pages like About Us, Contact, etc.</CardDescription>
                   </div>
                   <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Page</Button>
                </CardHeader>
                <CardContent>
                   <Table>
                      <TableHeader>
                         <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                         </TableRow>
                      </TableHeader>
                      <TableBody>
                         {pages.map(p => (
                           <TableRow key={p.id}>
                              <TableCell className="font-medium">{p.title}</TableCell>
                              <TableCell className="text-muted-foreground">{p.slug}</TableCell>
                              <TableCell><Badge variant="outline">{p.status}</Badge></TableCell>
                              <TableCell className="text-right"><Button variant="ghost" size="sm">Edit</Button></TableCell>
                           </TableRow>
                         ))}
                      </TableBody>
                   </Table>
                </CardContent>
             </Card>
          </TabsContent>
          
          <TabsContent value="navigation" className="mt-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card>
                  <CardHeader>
                     <CardTitle>Header Menu</CardTitle>
                     <CardDescription>Links shown in the top navigation bar.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {theme.headerMenu.map((link, idx) => (
                        <div key={link.id} className="flex items-center gap-2 p-2 border rounded bg-background">
                           <div className="text-muted-foreground font-mono text-xs w-6">{idx + 1}</div>
                           <Input defaultValue={link.label} className="h-8" />
                           <Input defaultValue={link.url} className="h-8 flex-1 font-mono text-xs" />
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash size={14} /></Button>
                        </div>
                     ))}
                     <Button variant="outline" className="w-full border-dashed"><Plus className="mr-2 h-4 w-4" /> Add Menu Item</Button>
                  </CardContent>
               </Card>
               <Card>
                  <CardHeader>
                     <CardTitle>Footer Menu</CardTitle>
                     <CardDescription>Links shown in the page footer.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     {theme.footerMenu.map((link, idx) => (
                        <div key={link.id} className="flex items-center gap-2 p-2 border rounded bg-background">
                           <div className="text-muted-foreground font-mono text-xs w-6">{idx + 1}</div>
                           <Input defaultValue={link.label} className="h-8" />
                           <Input defaultValue={link.url} className="h-8 flex-1 font-mono text-xs" />
                           <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash size={14} /></Button>
                        </div>
                     ))}
                     <Button variant="outline" className="w-full border-dashed"><Plus className="mr-2 h-4 w-4" /> Add Menu Item</Button>
                  </CardContent>
               </Card>
             </div>
          </TabsContent>

          <TabsContent value="homepage" className="mt-6">
             <Card>
                <CardHeader>
                   <CardTitle>Home Page Layout</CardTitle>
                   <CardDescription>Drag and drop sections to reorder your home page.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   {theme.homeLayout.map((section, idx) => (
                      <div key={section.id} className="flex items-center justify-between p-4 border rounded-lg bg-background shadow-sm">
                         <div className="flex items-center gap-4">
                            <div className="p-2 bg-muted rounded cursor-move"><LayoutTemplate size={16} /></div>
                            <div>
                               <div className="font-medium capitalize">{section.type.replace('-', ' ')}</div>
                               {section.title && <div className="text-xs text-muted-foreground">Title: {section.title}</div>}
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                               <Switch checked={section.enabled} onCheckedChange={(c) => {
                                  // Update logic would go here
                                  const newLayout = [...theme.homeLayout];
                                  newLayout[idx].enabled = c;
                                  updateTheme({ homeLayout: newLayout });
                               }} />
                               <span className="text-xs text-muted-foreground">{section.enabled ? 'Visible' : 'Hidden'}</span>
                            </div>
                            <Button variant="ghost" size="sm">Edit</Button>
                         </div>
                      </div>
                   ))}
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }


  if (page === 'settings') {
     return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
           <div className="flex items-center justify-between">
             <div>
               <h1 className="text-3xl font-serif font-bold">Settings</h1>
               <p className="text-muted-foreground">Manage global store settings.</p>
             </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-1">
                 <h3 className="font-medium">Notifications</h3>
                 <p className="text-sm text-muted-foreground">Manage email templates sent to customers.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                 {notifications.map((notif: any) => (
                    <Card key={notif.id}>
                       <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3">
                                <div className="p-2 bg-muted rounded-full"><Mail size={16} /></div>
                                <div>
                                   <CardTitle className="text-base">{notif.name}</CardTitle>
                                   <CardDescription className="text-xs">{notif.subject}</CardDescription>
                                </div>
                             </div>
                             <Button variant="outline" size="sm">Edit Template</Button>
                          </div>
                       </CardHeader>
                    </Card>
                 ))}
              </div>
           </div>

           <Separator />

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-1">
                 <h3 className="font-medium">Shipping & Delivery</h3>
                 <p className="text-sm text-muted-foreground">Manage shipping rates and zones.</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                 <Card>
                    <CardHeader>
                       <div className="flex items-center justify-between">
                          <CardTitle>Shipping Profiles</CardTitle>
                          <Button size="sm">Add Profile</Button>
                       </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       {shippingProfiles.map(profile => (
                          <div key={profile.id} className="flex items-center justify-between p-4 border rounded-lg">
                             <div>
                                <h4 className="font-medium">{profile.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                   {profile.type === 'flat' ? `Flat Rate: $${profile.rate.toFixed(2)}` : `Distance Based: $${profile.rate.toFixed(2)}/mile from ${profile.originState}`}
                                </p>
                             </div>
                             <div className="flex gap-2">
                                <Button variant="ghost" size="sm">Edit</Button>
                                <Button variant="ghost" size="icon" className="text-destructive"><Trash size={14}/></Button>
                             </div>
                          </div>
                       ))}
                    </CardContent>
                 </Card>
              </div>
           </div>

           <Separator />

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-1">
                 <h3 className="font-medium">Payments</h3>
                 <p className="text-sm text-muted-foreground">Manage payment providers and payouts.</p>
              </div>
              <div className="md:col-span-2">
                 <Card>
                    <CardContent className="p-6 space-y-4">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <CreditCard className="text-muted-foreground" />
                             <span className="font-medium">Stripe (Test Mode)</span>
                          </div>
                          <Badge variant="default" className="bg-green-600">Active</Badge>
                       </div>
                       <div className="text-sm text-muted-foreground">
                          Accepting Visa, Mastercard, Amex. Payouts scheduled daily.
                       </div>
                       <Button variant="outline">Manage Provider</Button>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </div>
     )
  }


  if (page === 'payments') {
    return (
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold">Payments</h1>
            <p className="text-muted-foreground">Manage payment providers and payouts.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="md:col-span-2 space-y-6">
              <Card>
                 <CardHeader>
                    <div className="flex items-center justify-between">
                       <CardTitle>Payment Providers</CardTitle>
                       <Button variant="outline" size="sm">Add Provider</Button>
                    </div>
                    <CardDescription>Accept payments from customers.</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-blue-600 rounded flex items-center justify-center text-white font-bold">S</div>
                          <div>
                             <h4 className="font-medium">Stripe Payments</h4>
                             <p className="text-sm text-muted-foreground">Accept Visa, Mastercard, Amex, Apple Pay</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700">Active</Badge>
                          <Button variant="ghost" size="sm">Manage</Button>
                       </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-yellow-400 rounded flex items-center justify-center text-blue-900 font-bold">P</div>
                          <div>
                             <h4 className="font-medium">PayPal</h4>
                             <p className="text-sm text-muted-foreground">Express Checkout</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm">Activate</Button>
                       </div>
                    </div>
                 </CardContent>
              </Card>

              <Card>
                 <CardHeader>
                    <CardTitle>Payment Capture</CardTitle>
                    <CardDescription>Automatically capture payments for orders.</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="flex items-center justify-between">
                       <div className="space-y-0.5">
                          <Label className="text-base">Automatic Capture</Label>
                          <p className="text-sm text-muted-foreground">Payments are captured as soon as the order is placed.</p>
                       </div>
                       <Switch checked={true} />
                    </div>
                 </CardContent>
              </Card>
           </div>

           <div className="space-y-6">
              <Card>
                 <CardHeader>
                    <CardTitle>Payout Schedule</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                       <span className="text-muted-foreground">Next Payout</span>
                       <span className="font-medium">Tomorrow</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-muted-foreground">Amount</span>
                       <span className="font-medium">$1,240.50</span>
                    </div>
                    <Button variant="outline" className="w-full">View Payouts</Button>
                 </CardContent>
              </Card>
           </div>
        </div>
      </div>
    );
  }

  if (page === 'customers') {
     // Derive customers from orders for this view
     const uniqueCustomers = Array.from(new Set(orders.map(o => o.email))).map(email => {
       const customerOrders = orders.filter(o => o.email === email);
       const totalSpent = customerOrders.reduce((sum, o) => sum + o.total, 0);
       const lastOrder = customerOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
       return {
         id: email,
         name: customerOrders[0].customer,
         email: email,
         ordersCount: customerOrders.length,
         totalSpent: totalSpent,
         lastOrderDate: lastOrder.date,
         status: 'Active'
       };
     });

     return (
        <div className="p-8 space-y-8 animate-in fade-in duration-500">
           <div className="flex items-center justify-between">
             <div>
               <h1 className="text-3xl font-serif font-bold">Customers</h1>
               <p className="text-muted-foreground">View and manage customer details.</p>
             </div>
             <Button>Import Customers</Button>
           </div>

           <Card>
              <CardHeader className="pb-3">
                 <div className="flex items-center justify-between">
                    <div className="relative w-64">
                       <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                       <Input placeholder="Search customers..." className="pl-8" />
                    </div>
                    <Button variant="outline" size="sm"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                 </div>
              </CardHeader>
              <CardContent>
                 <Table>
                    <TableHeader>
                       <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Orders</TableHead>
                          <TableHead>Total Spent</TableHead>
                          <TableHead>Last Order</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {uniqueCustomers.length > 0 ? uniqueCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                             <TableCell>
                                <div className="font-medium">{customer.name}</div>
                                <div className="text-xs text-muted-foreground">{customer.email}</div>
                             </TableCell>
                             <TableCell><Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{customer.status}</Badge></TableCell>
                             <TableCell>{customer.ordersCount} orders</TableCell>
                             <TableCell>${customer.totalSpent.toFixed(2)}</TableCell>
                             <TableCell>{customer.lastOrderDate}</TableCell>
                          </TableRow>
                       )) : (
                          <TableRow>
                             <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No customers found. Place some orders to see them here.
                             </TableCell>
                          </TableRow>
                       )}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>
        </div>
     );
  }

  if (page === 'bookings') {
    return <BookingsPage />;
  }

  // Default Dashboard View
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your store's performance.</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline">Export Report</Button>
           <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{orders.length}</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products In Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">12 Low Stock Alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+573</div>
            <p className="text-xs text-muted-foreground">+201 since last hour</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card className="col-span-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search orders..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.slice(0, 5).map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === 'fulfilled' ? 'default' : 
                      order.status === 'pending' ? 'secondary' : 
                      order.status === 'cancelled' ? 'destructive' : 'outline'
                    } className="capitalize">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order.id)}>Manage</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
       {/* Shared Order Details Sheet for Dashboard View too */}
        <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <SheetContent className="sm:max-w-md">
             {/* Same sheet content as above - simplifying by not duplicating code in this prompt, 
                 in real app would be component */}
             <SheetHeader className="mb-6">
               <SheetTitle>Order Details</SheetTitle>
               <SheetDescription>Manage this order.</SheetDescription>
             </SheetHeader>
             <div className="space-y-4">
                <p>Order ID: {selectedOrder}</p>
                <div className="flex flex-col gap-2">
                   <Button onClick={() => handleOrderAction('Fulfilled')}>Mark Fulfilled</Button>
                   <Button variant="outline" onClick={() => handleOrderAction('Cancelled')}>Cancel Order</Button>
                </div>
             </div>
          </SheetContent>
        </Sheet>
    </div>
  );
}
