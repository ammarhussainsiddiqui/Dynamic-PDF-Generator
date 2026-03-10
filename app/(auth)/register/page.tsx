'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

type Step = 'EMAIL' | 'OTP' | 'PASSWORD';

export default function RegisterPage() {
  const router = useRouter();
  
  // Wizard State
  const [step, setStep] = useState<Step>('EMAIL');

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI State
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStep('OTP');
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Pre-validate OTP format
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code.');
      setLoading(false);
      return;
    }

    // Move to password step without firing backend request yet (backend validates everything at the end)
    setStep('PASSWORD');
    setLoading(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/verify-and-set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, otp, password }),
      });

      if (res.ok) {
        setSuccessMsg('Account created! Redirecting to login...');
        setTimeout(() => {
          router.push('/login?registered=true');
        }, 3000);
      } else {
        const data = await res.json();
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="bg-card w-full rounded-2xl shadow-xl border border-muted p-8 relative overflow-hidden min-h-[500px] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: EMAIL */}
        {step === 'EMAIL' && (
          <motion.div 
            key="step-email"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 text-center">
              <div className="flex justify-center mb-4"><Badge active>STEP 1 OF 3</Badge></div>
              <h1 className="font-heading text-4xl mb-2 text-foreground">Create <span className="text-gradient">Account</span></h1>
              <p className="text-foreground/60 text-sm">Join the platform and start generating PDFs.</p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-foreground/70 mb-2 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 bg-background border border-muted rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all" 
                  placeholder="john@example.com" 
                />
              </div>

              {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

              <div className="pt-4">
                 <Button type="submit" variant="primary" className="w-full h-12 text-md" isLoading={loading} withArrow>
                   Continue
                 </Button>
              </div>
            </form>

            <p className="mt-8 text-center text-sm text-foreground/60">
              Already have an account? <Link href="/login" className="text-accent font-semibold hover:underline decoration-accent/50 transition-all">Log in</Link>
            </p>
          </motion.div>
        )}

        {/* STEP 2: OTP */}
        {step === 'OTP' && (
          <motion.div 
            key="step-otp"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 text-center">
              <div className="flex justify-center mb-4"><Badge active>STEP 2 OF 3</Badge></div>
              <h1 className="font-heading text-4xl mb-2 text-foreground">Verify <span className="text-gradient">Email</span></h1>
              <p className="text-foreground/60 text-sm">We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span></p>
            </div>

            <form onSubmit={handleOtpSubmit} className="space-y-4">
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

              <div className="pt-4 flex gap-3">
                 <Button type="button" variant="ghost" onClick={() => setStep('EMAIL')} className="h-12 border border-muted">
                   Back
                 </Button>
                 <Button type="submit" variant="primary" className="w-full h-12 text-md" isLoading={loading} withArrow>
                   Proceed
                 </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 3: PASSWORD */}
        {step === 'PASSWORD' && (
          <motion.div 
            key="step-password"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6 text-center">
              <div className="flex justify-center mb-4"><Badge active>STEP 3 OF 3</Badge></div>
              <h1 className="font-heading text-4xl mb-2 text-foreground">Set <span className="text-gradient">Password</span></h1>
              <p className="text-foreground/60 text-sm">Secure your account to complete registration.</p>
            </div>

            {successMsg ? (
               <div className="text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                <h3 className="font-heading text-2xl text-foreground mb-2">Verified & Ready!</h3>
                <p className="text-foreground/60">{successMsg}</p>
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block font-mono text-xs text-foreground/70 mb-2 uppercase tracking-wider">Full Name (Optional)</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 bg-background border border-muted rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all" 
                    placeholder="John Doe" 
                  />
                </div>
                <div>
                  <label className="block font-mono text-xs text-foreground/70 mb-2 uppercase tracking-wider">Password</label>
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

                {error && <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="ghost" onClick={() => setStep('OTP')} className="h-12 border border-muted">
                    Back
                  </Button>
                  <Button type="submit" variant="primary" className="w-full h-12 text-md" isLoading={loading} withArrow>
                    Create Account
                  </Button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
