'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', { redirect: false, email, password });
    if (res?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="bg-card w-full rounded-2xl shadow-xl border border-muted p-8 relative">
      <motion.div variants={fadeInUp} className="mb-8 text-center">
        <div className="flex justify-center mb-4"><Badge active>AUTH</Badge></div>
        <h1 className="font-heading text-4xl mb-2 text-foreground">Welcome <span className="text-gradient">Back</span></h1>
        <p className="text-foreground/60 text-sm">Enter your credentials to access your workspace.</p>
      </motion.div>

      <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="space-y-5">
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
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block font-mono text-xs text-foreground/70 uppercase tracking-wider">Password</label>
            <Link href="/forgot-password" className="text-xs text-accent hover:underline decoration-accent/50 transition-all font-medium">Forgot Password?</Link>
          </div>
          <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 bg-background border border-muted rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all" 
            placeholder="••••••••" 
          />
        </div>

        {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

        <div className="pt-2">
           <Button type="submit" variant="primary" className="w-full h-12 text-md" isLoading={loading} withArrow>
             Sign In
           </Button>
        </div>
      </motion.form>

      <motion.p variants={fadeInUp} className="mt-8 text-center text-sm text-foreground/60">
        Don't have an account? <Link href="/register" className="text-accent font-semibold hover:underline decoration-accent/50 transition-all">Create one</Link>
      </motion.p>
    </motion.div>
  );
}
