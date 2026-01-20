import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/lib/storeContext";
import { AuthProvider } from "@/lib/authContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Confirmation from "@/pages/Confirmation";
import CheckoutComplete from "@/pages/CheckoutComplete";
import Booking from "@/pages/Booking";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminLogin from "@/pages/admin/AdminLogin";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import ReturnPolicy from "@/pages/ReturnPolicy";
import ShippingPolicy from "@/pages/ShippingPolicy";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Terms from "@/pages/Terms";
import Blog from "@/pages/Blog"; // New import
import BlogPost from "@/pages/BlogPost"; // New import
import Layout from "@/components/layout/Layout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/shop/:category" component={Shop} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/checkout/complete" component={CheckoutComplete} />
      <Route path="/booking" component={Booking} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={FAQ} />
      <Route path="/returns" component={ReturnPolicy} />
      <Route path="/shipping" component={ShippingPolicy} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={Terms} />
      <Route path="/confirmation" component={Confirmation} />
      <Route path="/blog" component={Blog} /> {/* New route */}
      <Route path="/blog/:slug" component={BlogPost} /> {/* New route */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin">
        <Layout>
          <AdminDashboard />
        </Layout>
      </Route>
      <Route path="/admin/:page">
        <Layout>
          <AdminDashboard />
        </Layout>
      </Route>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <StoreProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <Analytics />
          </TooltipProvider>
        </StoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;