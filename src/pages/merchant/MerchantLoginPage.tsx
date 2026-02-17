import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, Store, UtensilsCrossed, ClipboardList } from 'lucide-react';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LogoFull } from '@/assets/logo';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function MerchantLoginPage() {
  const navigate = useNavigate();
  const { login } = useMerchantAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

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
      navigate('/merchant/orders', { replace: true });
    } catch {
      setError('Invalid email or password');
    }
  };

  const features = [
    { icon: ClipboardList, label: 'Real-time order management' },
    { icon: UtensilsCrossed, label: 'Full menu control' },
    { icon: Store, label: 'Shop analytics & insights' },
  ];

  return (
    <div className="relative min-h-screen flex">
      <div className="fixed inset-0 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand/15 via-transparent to-transparent" />
      </div>

      <div className="fixed top-4 right-4 z-50 flex items-center gap-1">
        <ThemeToggle />
      </div>

      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-12 xl:px-20"
      >
        <div className="mb-8">
          <Store className="h-16 w-16 text-brand/20" />
        </div>
        <h1 className="text-4xl xl:text-5xl font-extrabold font-montserrat text-foreground mb-4 leading-tight">
          Merchant Portal
        </h1>
        <p className="text-lg text-muted-foreground font-poppins mb-8 max-w-lg leading-relaxed">
          Manage your airport shop orders, menu, and promotions in one place.
        </p>
        <div className="flex flex-col gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10">
                <feature.icon className="h-5 w-5 text-brand" />
              </div>
              <span className="text-sm font-medium font-lexend text-foreground">{feature.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <Card className="border-border/50 shadow-lg backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex justify-center mb-8">
                <LogoFull size="lg" />
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
                    <Input id="merchant-email" type="email" placeholder="e.g. manager@skylounge.io" className="pl-10" {...register('email')} />
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

              {/* Demo credentials */}
              <div className="mt-6 rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase mb-2">Demo Credentials</p>
                <div className="space-y-1 text-xs text-muted-foreground font-mono">
                  <p>manager@skylounge.io / Manager@123</p>
                  <p>cashier@skylounge.io / Cashier@123</p>
                  <p>kitchen@skylounge.io / Kitchen@123</p>
                </div>
              </div>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                <button onClick={() => navigate('/login')} className="text-brand hover:underline">
                  Admin Portal &rarr;
                </button>
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
