
import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ShoppingBag, Menu, X, Search, User, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isAdmin = location.startsWith('/admin');

  if (isAdmin) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        <aside className="w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground hidden md:block fixed h-full">
          <div className="p-6 border-b border-sidebar-border">
            <h2 className="text-2xl font-serif font-bold">LuxeAdmin</h2>
          </div>
          <nav className="p-4 space-y-2">
            <Link href="/admin">
              <div className={`p-3 rounded-md cursor-pointer hover:bg-sidebar-accent transition-colors ${location === '/admin' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''}`}>
                Dashboard
              </div>
            </Link>
            <Link href="/admin/products">
              <div className={`p-3 rounded-md cursor-pointer hover:bg-sidebar-accent transition-colors ${location === '/admin/products' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''}`}>
                Products
              </div>
            </Link>
            <Link href="/admin/orders">
              <div className={`p-3 rounded-md cursor-pointer hover:bg-sidebar-accent transition-colors ${location === '/admin/orders' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''}`}>
                Orders
              </div>
            </Link>
            <Link href="/admin/payments">
              <div className={`p-3 rounded-md cursor-pointer hover:bg-sidebar-accent transition-colors ${location === '/admin/payments' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''}`}>
                Payments
              </div>
            </Link>
            <Link href="/admin/pages">
              <div className={`p-3 rounded-md cursor-pointer hover:bg-sidebar-accent transition-colors ${location === '/admin/pages' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''}`}>
                Pages
              </div>
            </Link>
            <Link href="/admin/customers">
              <div className={`p-3 rounded-md cursor-pointer hover:bg-sidebar-accent transition-colors ${location === '/admin/customers' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''}`}>
                Customers
              </div>
            </Link>
            <div className="mt-8 pt-4 border-t border-sidebar-border">
              <Link href="/" className="p-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-2">
                  <LayoutDashboard size={16} /> Back to Store
              </Link>
            </div>
          </nav>
        </aside>
        <main className="flex-1 md:ml-64">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium">Home</Link>
                <Link href="/shop" className="text-lg font-medium">Shop</Link>
                <Link href="/about" className="text-lg font-medium">About</Link>
                <Link href="/contact" className="text-lg font-medium">Contact</Link>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="text-2xl font-serif font-bold tracking-tight">
            LuxeStore
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>
            
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="hidden sm:flex" title="Admin Demo">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">2</Badge>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Search Bar Expandable */}
        {isSearchOpen && (
          <div className="border-b border-border p-4 bg-background animate-in slide-in-from-top-5 fade-in duration-200">
            <div className="container mx-auto max-w-2xl flex gap-2">
              <Input placeholder="Search products..." className="flex-1" autoFocus />
              <Button variant="ghost" onClick={() => setIsSearchOpen(false)}>Close</Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-muted/30 border-t border-border py-12 md:py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold">LuxeStore</h3>
            <p className="text-sm text-muted-foreground">
              Premium curated goods for the modern lifestyle. Quality, design, and service.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/shop/new">New Arrivals</Link></li>
              <li><Link href="/shop/bestsellers">Best Sellers</Link></li>
              <li><Link href="/shop/home">Home</Link></li>
              <li><Link href="/shop/fashion">Fashion</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/faq">FAQs</Link></li>
              <li><Link href="/shipping">Shipping Info</Link></li>
              <li><Link href="/returns">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Newsletter</h4>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" className="bg-background" />
              <Button>Join</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} LuxeStore. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
