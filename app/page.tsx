'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { motion } from 'framer-motion';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid credentials');
      setIsLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
      {/* Decorative radial glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent opacity-5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-accent opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="flex-grow flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="w-full max-w-md"
        >
          <motion.div variants={fadeInUp} className="text-center mb-10">
            <h1 className="font-heading text-5xl mb-4 text-foreground">
              Fast <span className="text-gradient">PDF</span>
            </h1>
            <p className="text-foreground/70 font-sans">
              Self-hosted minimalist document generation
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="p-8">
              {error && (
                <div className="p-3 mb-6 text-sm rounded-xl bg-red-50 text-red-600 border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all font-sans"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl border border-muted bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all font-sans"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isLoading}
                  withArrow
                >
                  Sign In / Register
                </Button>
              </form>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
