
import { Link, useRoute } from 'wouter';
import { categories, products } from '@/lib/mockData';
import { Package, ShoppingCart, Users, DollarSign, Settings, Search, Plus, Filter, MoreHorizontal, Trash, Edit, Loader2, Save, FileText, CreditCard, RefreshCw, XCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
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
  DropdownMenuSeparator,
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

export default function AdminDashboard() {
  const [, params] = useRoute('/admin/:page?');
  const page = params?.page || 'dashboard';
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleEditClick = (productId: string) => {
    setEditingProduct(productId);
  };

  const handleSaveProduct = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setEditingProduct(null);
      toast({ title: "Product Saved", description: "Your changes have been updated successfully." });
    }, 1000);
  };

  const handleSavePage = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setEditingPage(null);
      toast({ title: "Page Updated", description: "Content has been published." });
    }, 1000);
  };

  const handleOrderAction = (action: string) => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSelectedOrder(null);
      toast({ title: `Order ${action}`, description: `Order status has been updated to ${action}.` });
    }, 1000);
  };

  const currentProduct = products.find(p => p.id === editingProduct);
  
  // Mock Pages Data
  const pages = [
    { id: 'home', title: 'Home Page', status: 'Published', lastUpdated: '2 mins ago' },
    { id: 'about', title: 'About Us', status: 'Published', lastUpdated: '2 days ago' },
    { id: 'contact', title: 'Contact', status: 'Published', lastUpdated: '1 week ago' },
    { id: 'terms', title: 'Terms & Conditions', status: 'Draft', lastUpdated: '3 weeks ago' },
  ];

  // Mock Orders Data
  const orders = [
    { id: "ORD-001", customer: "Alice Freeman", status: "Fulfilled", date: "2023-10-21", amount: 250.00, payment: "Credit Card", items: 3 },
    { id: "ORD-002", customer: "Bob Smith", status: "Pending", date: "2023-10-21", amount: 120.50, payment: "PayPal", items: 1 },
    { id: "ORD-003", customer: "Charlie Brown", status: "Cancelled", date: "2023-10-20", amount: 45.00, payment: "Credit Card", items: 1 },
    { id: "ORD-004", customer: "Diana Prince", status: "Fulfilled", date: "2023-10-19", amount: 850.00, payment: "Credit Card", items: 5 },
    { id: "ORD-005", customer: "Evan Wright", status: "Processing", date: "2023-10-19", amount: 65.99, payment: "Debit Card", items: 2 },
  ];

  if (page === 'products') {
    return (
       <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog.</p>
          </div>
          <Button><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
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
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>${product.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
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
                          <DropdownMenuItem onClick={() => handleEditClick(product.id)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive"><Trash className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Edit Product Sheet */}
        <Sheet open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Edit Product</SheetTitle>
              <SheetDescription>
                Make changes to your product here. Click save when you're done.
              </SheetDescription>
            </SheetHeader>
            {currentProduct && (
              <div className="grid gap-4 py-4">
                <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted mb-4">
                   <img src={currentProduct.image} className="h-full w-full object-cover" alt="Product preview" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={currentProduct.name} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price</Label>
                    <Input id="price" defaultValue={currentProduct.price} type="number" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input id="category" defaultValue={currentProduct.category} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" defaultValue={currentProduct.description} rows={4} />
                </div>
              </div>
            )}
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button onClick={handleSaveProduct} disabled={isSaving}>
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
              </Button>
            </SheetFooter>
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
            <h1 className="text-3xl font-serif font-bold">Pages</h1>
            <p className="text-muted-foreground">Manage content for your store pages.</p>
          </div>
          <Button><Plus className="mr-2 h-4 w-4" /> Create Page</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((p) => (
            <Card key={p.id} className="hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => setEditingPage(p.id)}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-muted rounded-md group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <FileText className="h-6 w-6" />
                  </div>
                  <Badge variant={p.status === 'Published' ? 'default' : 'secondary'}>{p.status}</Badge>
                </div>
                <CardTitle className="mt-4">{p.title}</CardTitle>
                <CardDescription>Last updated {p.lastUpdated}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Edit Page Sheet */}
        <Sheet open={!!editingPage} onOpenChange={(open) => !open && setEditingPage(null)}>
          <SheetContent className="sm:max-w-lg w-full">
            <SheetHeader>
              <SheetTitle>Edit Page Content</SheetTitle>
              <SheetDescription>
                Update the content for this page.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="page-title">Page Title</Label>
                <Input id="page-title" defaultValue={pages.find(p => p.id === editingPage)?.title} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="page-content">Content (Markdown)</Label>
                <Textarea id="page-content" className="min-h-[300px] font-mono text-sm" defaultValue="# Welcome to our store\n\nWe believe in quality above all else..." />
              </div>
              <div className="grid gap-2">
                 <Label>SEO Settings</Label>
                 <Input placeholder="Meta Title" />
                 <Input placeholder="Meta Description" />
              </div>
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">Cancel</Button>
              </SheetClose>
              <Button onClick={handleSavePage} disabled={isSaving}>
                {isSaving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</> : 'Publish Changes'}
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
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>
                      <Badge variant={
                        order.status === 'Fulfilled' ? 'default' : 
                        order.status === 'Pending' ? 'secondary' : 
                        order.status === 'Cancelled' ? 'destructive' : 'outline'
                      }>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.payment}</TableCell>
                    <TableCell className="text-right">${order.amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order.id)}>Manage</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Order Details Sheet */}
        <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader className="mb-6">
              <div className="flex items-center justify-between">
                 <SheetTitle>Order {selectedOrder}</SheetTitle>
                 <Badge>Fulfilled</Badge>
              </div>
              <SheetDescription>
                Placed on October 21, 2023 at 4:32 PM
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-6">
               <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Customer</h3>
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Users size={20} />
                     </div>
                     <div>
                        <p className="font-medium">Alice Freeman</p>
                        <p className="text-sm text-muted-foreground">alice@example.com</p>
                     </div>
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Items</h3>
                  {[1, 2].map(i => (
                     <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div className="flex gap-3">
                           <div className="h-12 w-12 bg-muted rounded overflow-hidden">
                              <img src={products[i-1].image} className="h-full w-full object-cover" />
                           </div>
                           <div>
                              <p className="font-medium text-sm">{products[i-1].name}</p>
                              <p className="text-xs text-muted-foreground">Qty: 1</p>
                           </div>
                        </div>
                        <p className="text-sm font-medium">${products[i-1].price}</p>
                     </div>
                  ))}
                  <div className="flex justify-between pt-2 font-bold">
                     <span>Total</span>
                     <span>$429.50</span>
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
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  if (page === 'payments') {
    return (
       <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold">Payments</h1>
            <p className="text-muted-foreground">View and manage transaction history.</p>
          </div>
          <Button variant="outline">Export CSV</Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
           <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Gross Volume</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">$45,231.89</div></CardContent>
           </Card>
           <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Net Volume</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold">$42,100.50</div></CardContent>
           </Card>
           <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Refunds</CardTitle></CardHeader>
              <CardContent><div className="text-2xl font-bold text-destructive">$1,240.00</div></CardContent>
           </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                 {[1,2,3,4,5].map((i) => (
                    <TableRow key={i}>
                       <TableCell className="text-muted-foreground">Oct 21, 2023</TableCell>
                       <TableCell className="font-medium">Payment from Alice Freeman</TableCell>
                       <TableCell><Link href="#" className="underline decoration-dotted">#ORD-00{i}</Link></TableCell>
                       <TableCell><div className="flex items-center gap-2"><CreditCard size={14} /> Visa •••• 4242</div></TableCell>
                       <TableCell className="text-right font-medium">+$250.00</TableCell>
                       <TableCell className="text-right"><Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Succeeded</Badge></TableCell>
                    </TableRow>
                 ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
       </div>
    )
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
            <div className="text-2xl font-bold">+2350</div>
            <p className="text-xs text-muted-foreground">+180.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products In Stock</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,203</div>
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
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    <Badge variant={
                      order.status === 'Fulfilled' ? 'default' : 
                      order.status === 'Pending' ? 'secondary' : 
                      order.status === 'Cancelled' ? 'destructive' : 'outline'
                    }>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell className="text-right">${order.amount.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Manage</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
