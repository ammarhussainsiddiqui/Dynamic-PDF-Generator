'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

function VerifyEmailForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login?verified=true');
        }, 3000);
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="bg-card w-full rounded-2xl shadow-xl border border-muted p-8 relative">
      <motion.div variants={fadeInUp} className="mb-6 text-center">
        <div className="flex justify-center mb-4"><Badge active>VERIFY EMAIL</Badge></div>
        <h1 className="font-heading text-4xl mb-2 text-foreground">Enter <span className="text-gradient">Code</span></h1>
        <p className="text-foreground/60 text-sm">We sent a 6-digit code to your email.</p>
      </motion.div>

      {success ? (
        <motion.div variants={fadeInUp} className="text-center py-8">
           <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
           <h3 className="font-heading text-2xl text-foreground mb-2">Verified!</h3>
           <p className="text-foreground/60">Redirecting you to login...</p>
        </motion.div>
      ) : (
        <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="space-y-4">
          {!emailParam && (
             <div>
              <label className="block font-mono text-xs text-foreground/70 mb-2 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-background border border-muted rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent" 
                placeholder="john@example.com"
              />
            </div>
          )}
          
          <div>
            <label className="block font-mono text-xs text-foreground/70 mb-2 uppercase tracking-wider">Verification Code</label>
            <input 
              type="text" 
              required 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full h-16 bg-background border border-muted rounded-xl px-4 text-center text-3xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-accent" 
              placeholder="000000" 
              maxLength={6}
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

          <div className="pt-4">
            <Button type="submit" variant="primary" className="w-full h-12 text-md" isLoading={loading} withArrow>
              Verify Now
            </Button>
          </div>
        </motion.form>
      )}

      <motion.p variants={fadeInUp} className="mt-8 text-center text-sm text-foreground/60">
        Back to <Link href="/login" className="text-accent font-semibold hover:underline">Login</Link>
      </motion.p>
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-center text-foreground/50">Loading form...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
