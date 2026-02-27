import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/common/ThemeToggle';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function MerchantLoginPage() {
  const navigate = useNavigate();
  const { login } = useMerchantAuth();
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError('');
      await login(data.email, data.password);
      setLoginSuccess(true);
    } catch {
      setError('Invalid email or password');
    }
  };

  const handleAnimationComplete = useCallback(() => {
    if (loginSuccess) {
      setTimeout(() => navigate('/merchant/orders', { replace: true }), 500);
    }
  }, [loginSuccess, navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background */}
      <div className="fixed inset-0 bg-background z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand/15 via-transparent to-transparent" />
      </div>

      {/* Trolly watermark — slides in from right on load, sweeps left on login */}
      <motion.img
        src="/images/Trolly.svg"
        alt=""
        aria-hidden="true"
        className="fixed top-1/2 w-[900px] h-[900px] pointer-events-none select-none"
        style={{
          right: '-200px',
          filter: theme === 'eclipse'
            ? 'invert(45%) sepia(80%) saturate(800%) hue-rotate(230deg) brightness(95%)'
            : theme === 'dark'
            ? 'invert(30%) sepia(70%) saturate(1500%) hue-rotate(330deg) brightness(90%)'
            : undefined
        }}
        initial={{ x: '50vw', y: '-50%', opacity: 0 }}
        animate={loginSuccess
          ? { x: '-110vw', y: '-50%', opacity: [0.08, 0.15, 0.08, 0], transition: { duration: 1.6, ease: [0.4, 0, 0.2, 1] } }
          : { x: 0, y: '-50%', opacity: theme === 'eclipse' ? 0.12 : theme === 'dark' ? 0.1 : 0.04, transition: { duration: 1.2, ease: [0, 0, 0.2, 1] } }
        }
      />

      {/* Top left back button */}
      <motion.button
        onClick={() => navigate('/')}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
        aria-label="Back to home"
        animate={loginSuccess ? { opacity: 0, x: -20 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowLeft className="h-5 w-5" />
      </motion.button>

      <motion.div
        className="fixed top-4 right-4 z-50 flex items-center gap-1"
        animate={loginSuccess ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ThemeToggle />
      </motion.div>

      {/* Centered Login Card — fades out smoothly on success */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={loginSuccess
          ? { opacity: 0, scale: 0.95, y: -10, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } }
          : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md px-4 relative z-10"
        onAnimationComplete={handleAnimationComplete}
      >
        <Card className="border-border/30 shadow-lg backdrop-blur-sm bg-transparent">
          <CardContent className="p-8">
            <div className="flex justify-center mb-8">
              <img src={theme === 'tron' ? '/images/AITS - Tron.svg' : theme === 'eclipse' ? '/images/AITS - Eclipse.svg' : theme === 'dark' ? '/images/AiTS_White.svg' : '/images/AiTS.svg'} alt="Ai-TS" className={`h-16 w-auto object-contain ${theme === 'tron' ? 'tron-logo-glow' : ''}`} />
            </div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold font-montserrat text-foreground">Merchant Sign In</h2>
              <p className="mt-2 text-sm text-muted-foreground font-lexend">Access your shop dashboard</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="merchant-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="merchant-email" type="email" placeholder="e.g. manager@demo.ai-ts" className="pl-10" {...register('email')} />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="merchant-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="merchant-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    className="pl-10 pr-10"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-md bg-destructive/10 p-3 text-sm text-destructive text-center"
                >
                  {error}
                </motion.div>
              )}

              <Button type="submit" className="w-full h-11 font-semibold" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-4 border-t border-border/30">
              <p className="text-xs text-center text-muted-foreground font-lexend mb-2">Demo Credentials</p>
              <div className="bg-muted/50 rounded-md p-3 text-xs font-mono space-y-2">
                <div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Manager:</span>
                    <span className="text-foreground">manager@demo.ai-ts</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cashier:</span>
                    <span className="text-foreground">cashier@demo.ai-ts</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kitchen:</span>
                    <span className="text-foreground">kitchen@demo.ai-ts</span>
                  </div>
                </div>
                <div className="pt-1 border-t border-border/30">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Password (all):</span>
                    <span className="text-foreground">Password123</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
