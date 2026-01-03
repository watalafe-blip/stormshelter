import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/authContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Loader2 } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const success = await login(username, password);
    
    if (success) {
      setLocation('/admin/bookings');
    } else {
      setError('Invalid username or password');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4" data-testid="admin-login-page">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-[#3E2723] rounded-2xl flex items-center justify-center mx-auto">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#3E2723]">Admin Login</h1>
            <p className="text-stone-500 text-sm">Home Defend Pro Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#3E2723]">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="h-12"
                data-testid="input-username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#3E2723]">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="h-12"
                data-testid="input-password"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm text-center" data-testid="text-error">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#E69138] hover:bg-[#D4802F] text-white font-semibold"
              data-testid="button-login"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <button
              type="button"
              onClick={async () => {
                const email = prompt('Enter your admin email to request a password reset:');
                if (email) {
                  const res = await fetch('/api/admin/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: email })
                  });
                  if (res.ok) {
                    alert('Password reset request sent to info@homedefendpro.com');
                  } else {
                    alert('Failed to send reset request');
                  }
                }
              }}
              className="w-full text-center text-sm text-stone-500 hover:text-[#E69138] transition-colors"
              data-testid="link-forgot-password"
            >
              Forgot password?
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
