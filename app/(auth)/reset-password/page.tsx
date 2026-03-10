'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing password reset token.');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage('Your password has been reset successfully.');
      } else {
        const data = await res.json();
        setStatus('error');
        setMessage(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="bg-card w-full rounded-2xl shadow-xl border border-muted p-8 relative">
      <motion.div variants={fadeInUp} className="mb-6 text-center">
        <div className="flex justify-center mb-4"><Badge active>SECURITY</Badge></div>
        <h1 className="font-heading text-4xl mb-2 text-foreground">New <span className="text-gradient">Password</span></h1>
        <p className="text-foreground/60 text-sm">Enter your new secure password below.</p>
      </motion.div>

      {status === 'success' ? (
        <motion.div variants={fadeInUp} className="text-center space-y-6">
          <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 font-medium text-sm">
            {message}
          </div>
          <Link href="/login" className="block w-full">
            <Button variant="primary" className="w-full h-12" withArrow>Proceed to Login</Button>
          </Link>
        </motion.div>
      ) : (
        <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-xs text-foreground/70 mb-2 uppercase tracking-wider">New Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 bg-background border border-muted rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all" 
              placeholder="••••••••" 
              minLength={8}
            />
          </div>
          <div>
            <label className="block font-mono text-xs text-foreground/70 mb-2 uppercase tracking-wider">Confirm Password</label>
            <input 
              type="password" 
              required 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 bg-background border border-muted rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all" 
              placeholder="••••••••" 
              minLength={8}
            />
          </div>

          {status === 'error' && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{message}</p>}

          <div className="pt-4">
             <Button type="submit" variant="primary" className="w-full h-12 text-md" isLoading={status === 'loading'} disabled={!token} withArrow>
               Reset Password
             </Button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-foreground/50 text-sm text-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
