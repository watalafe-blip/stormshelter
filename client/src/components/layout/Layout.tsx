
import { Link, useLocation } from 'wouter';
import { ShoppingBag, Menu, X, Search, User, LayoutDashboard, Box, FileText, CreditCard, Settings, Users, Phone, Shield, Calculator, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useStore } from '@/lib/storeContext';
import { useState, useEffect } from 'react';
import logoImg from '@assets/images-Photoroom_1766984801727.png';
import PurchaseNotification from '@/components/home/PurchaseNotification';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useStore();

  const isAdmin = location.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const AdminSidebarLinks = () => (
    <>
      <Link href="/admin">
        <div className={`p-3 rounded-md cursor-pointer hover:bg-sidebar-accent transition-colors flex items-center gap-3 ${location === '/admin' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''}`}>
          <LayoutDashboard size={20} />
          Dashboard
        </div>
      </Link>
      <Link href="/admin/products">
        <div className={`p-3 rounded-md cursor-pointer hover:bg-sidebar-accent transition-colors flex items-center gap-3 ${location === '/admin/products' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''}`}>
          <Box size={20} />
          Products
        </div>
      </Link>
      <Link href="/admin/orders">
        <div className={`p-3 rounded-md cursor-pointer hover:bg-sidebar-accent transition-colors flex items-center gap-3 ${location === '/admin/orders' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''}`}>
          <ShoppingBag size={20} />
          Orders
        </div>
      </Link>
      <Link href="/admin/bookings">
        <div className={`p-3 rounded-md cursor-pointer hover:bg-sidebar-accent transition-colors flex items-center gap-3 ${location === '/admin/bookings' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''}`}>
          <CalendarDays size={20} />
          Bookings
        </div>
      </Link>
      <Link href="/admin/payments">
        <div className={`p-3 rounded-md cursor-pointer hover:bg-sidebar-accent transition-colors flex items-center gap-3 ${location === '/admin/payments' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''}`}>
          <CreditCard size={20} />
          Payments
        </div>
      </Link>
      <Link href="/admin/pages">
        <div className={`p-3 rounded-md cursor-pointer hover:bg-sidebar-accent transition-colors flex items-center gap-3 ${location === '/admin/pages' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''}`}>
          <FileText size={20} />
          Pages
        </div>
      </Link>
      <Link href="/admin/customers">
        <div className={`p-3 rounded-md cursor-pointer hover:bg-sidebar-accent transition-colors flex items-center gap-3 ${location === '/admin/customers' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''}`}>
          <Users size={20} />
          Customers
        </div>
      </Link>
      <Link href="/admin/settings">
        <div className={`p-3 rounded-md cursor-pointer hover:bg-sidebar-accent transition-colors flex items-center gap-3 ${location === '/admin/settings' ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' : ''}`}>
          <Settings size={20} />
          Settings
        </div>
      </Link>
    </>
  );

  if (isAdmin) {
    return (
      <div className="min-h-screen flex bg-gray-50">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-sidebar border-r border-sidebar-border text-sidebar-foreground hidden md:block fixed h-full overflow-y-auto">
          <div className="p-6 border-b border-sidebar-border">
            <h2 className="text-2xl font-serif font-bold">LuxeAdmin</h2>
          </div>
          <nav className="p-4 space-y-1">
            <AdminSidebarLinks />
            <div className="mt-8 pt-4 border-t border-sidebar-border">
              <Link href="/">
                <div className="p-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-3">
                  <LayoutDashboard size={20} /> Back to Store
                </div>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Mobile Header for Admin */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border p-4 flex items-center justify-between">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-6 border-b">
                <h2 className="text-xl font-serif font-bold">LuxeAdmin</h2>
              </div>
              <nav className="p-4 space-y-1">
                <AdminSidebarLinks />
                <div className="mt-8 pt-4 border-t border-border">
                   <Link href="/">
                    <div className="p-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-3">
                      <LayoutDashboard size={20} /> Back to Store
                    </div>
                  </Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <span className="font-serif font-bold">LuxeAdmin</span>
          <div className="w-10"></div> {/* Spacer */}
        </div>

        <main className="flex-1 md:ml-64 pt-16 md:pt-0">
          {children}
        </main>
      </div>
    );
  }

  const headerBgClass = isScrolled 
    ? "bg-white shadow-md text-[#3E2723]" 
    : location === '/' 
      ? "bg-transparent text-white border-transparent" 
      : "bg-white border-b border-stone-200 text-[#3E2723]";

  const navLinkClass = isScrolled || location !== '/'
    ? "hover:text-[#E69138] text-[#3E2723]"
    : "hover:text-[#E69138] text-white";

  const outlineButtonClass = isScrolled || location !== '/'
    ? "border-[#3E2723] text-[#3E2723] hover:bg-[#3E2723] hover:text-white"
    : "border-white text-white hover:bg-white hover:text-[#E69138]";

  const isSticky = location === '/';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PurchaseNotification />
      <header className={`${isSticky ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${headerBgClass}`}>
        <div className="container mx-auto px-4 h-24 flex items-center justify-between">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={`md:hidden ${isScrolled ? '' : 'text-white hover:bg-white/10'}`}>
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium">Home</Link>
                <Link href="/shop" className="text-lg font-medium">Shop</Link>
                <Link href="/about" className="text-lg font-medium">About</Link>
                <Link href="/contact" className="text-lg font-medium">Contact</Link>
                <div className="pt-4 border-t border-border mt-4">
                   <Link href="/admin" className="text-lg font-medium text-primary flex items-center gap-2"><Settings size={18} /> Admin Dashboard</Link>
                </div>
              </nav>
            </SheetContent>
          </Sheet>

          {/* Left: Nav Links */}
          <nav className="hidden md:flex flex-1 items-center gap-8 text-sm font-bold uppercase tracking-wide">
             {theme.headerMenu.map(link => (
                <Link key={link.id} href={link.url} className={`transition-colors hover:underline decoration-2 decoration-[#3E2723] underline-offset-4 ${navLinkClass}`}>
                   {link.label}
                </Link>
             ))}
          </nav>

          {/* Center: Logo */}
          <Link href="/" className={`text-2xl font-bold tracking-tight flex items-center justify-center gap-2 ${theme.typography.heading === 'serif' ? 'font-serif' : 'font-sans'}`}>
              <div className={`p-2 transition-all duration-300 transform ${isScrolled ? 'scale-90' : 'scale-110'}`}>
                <img 
                  src={logoImg} 
                  alt="Home Defend Logo" 
                  className={`h-20 w-auto transition-all`} 
                />
              </div>
          </Link>

          {/* Right: Actions */}
          <div className="flex-1 flex items-center justify-end gap-6">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                className={`hidden lg:flex font-bold transition-all ${outlineButtonClass}`}
                onClick={() => document.getElementById('purchase')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Calculate Shipping
              </Button>

              <Link href="/booking">
                <Button 
                  className={`hidden lg:flex font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 ${isScrolled ? 'bg-[#E69138] text-[#3E2723] hover:bg-[#D4842F]' : 'bg-[#E69138] text-[#3E2723] hover:bg-[#D4842F] border-none'}`}
                >
                  Secure My Shelter
                </Button>
              </Link>
            </div>
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

      <footer className="bg-[#3E2723] text-white border-t border-[#E69138]/20 py-12 md:py-16">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <img src={logoImg} alt="Home Defend Logo" className="h-8 w-auto brightness-0 invert" />
              Home Defend
            </h3>
            <p className="text-sm text-stone-300 max-w-xs">
              Protecting families with FEMA-certified concrete storm shelters. Built to survive the worst, so you can too.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-[#E69138] mb-4 uppercase tracking-wider text-sm">Navigation</h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop Shelters</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#E69138] mb-4 uppercase tracking-wider text-sm">Customer Support</h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping & Delivery</Link></li>
              <li><Link href="/returns" className="hover:text-white transition-colors">Returns & Warranty</Link></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-[#E69138]/20 text-center text-sm text-stone-400 flex flex-col md:flex-row justify-between items-center gap-4">
          <span>&copy; {new Date().getFullYear()} Home Defend. All rights reserved.</span>
          <Link href="/admin" className="text-xs text-stone-500 hover:text-[#E69138] transition-colors">
            Admin Login
          </Link>
        </div>
      </footer>
    </div>
  );
}

