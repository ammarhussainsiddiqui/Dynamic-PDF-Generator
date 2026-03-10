'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('success');
        setMessage('If an account with that email exists, we sent a password reset link.');
      } else {
        const data = await res.json();
        setStatus('error');
        setMessage(data.message || 'Failed to send reset email.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="bg-card w-full rounded-2xl shadow-xl border border-muted p-8 relative">
      <motion.div variants={fadeInUp} className="mb-6 text-center">
        <div className="flex justify-center mb-4"><Badge active>RECOVERY</Badge></div>
        <h1 className="font-heading text-4xl mb-2 text-foreground">Forgot <span className="text-gradient">Password?</span></h1>
        <p className="text-foreground/60 text-sm">Enter your email and we'll send you a reset link.</p>
      </motion.div>

      {status === 'success' ? (
        <motion.div variants={fadeInUp} className="text-center space-y-6">
          <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-green-700 font-medium text-sm">
            {message}
          </div>
          <Link href="/login" className="block w-full">
            <Button variant="secondary" className="w-full h-12">Return to Login</Button>
          </Link>
        </motion.div>
      ) : (
        <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-xs text-foreground/70 mb-2 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 bg-background border border-muted rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all" 
              placeholder="john@example.com" 
            />
          </div>

          {status === 'error' && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{message}</p>}

          <div className="pt-4">
             <Button type="submit" variant="primary" className="w-full h-12 text-md" isLoading={status === 'loading'} withArrow>
               Send Reset Link
             </Button>
          </div>
        </motion.form>
      )}

      <motion.div variants={fadeInUp} className="mt-8 text-center">
        <Link href="/login" className="text-sm text-foreground/60 hover:text-accent font-medium transition-colors">
          &larr; Back to login
        </Link>
      </motion.div>
    </motion.div>
  );
}
