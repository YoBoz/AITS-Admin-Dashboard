import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ShoppingCart, BarChart3, BrainCircuit } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { LogoFull } from '@/assets/logo';
import { ROUTES } from '@/lib/constants';

const loginSchema = z.object({
  email: z.string().min(1, 'login.emailRequired').email('login.emailInvalid'),
  password: z.string().min(6, 'login.passwordMin'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as { from?: string })?.from || ROUTES.DASHBOARD;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError('');
      await login(data.email, data.password);
      navigate(from, { replace: true });
    } catch {
      setError(t('login.invalidCredentials'));
    }
  };

  const features = [
    { icon: ShoppingCart, label: t('login.featureTrolley') },
    { icon: BarChart3, label: t('login.featureAnalytics') },
    { icon: BrainCircuit, label: t('login.featureIntelligence') },
  ];

  return (
    <div className="relative min-h-screen flex">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand/15 via-transparent to-transparent" />
      </div>

      {/* Top right controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      {/* Left Panel - visible on lg+ */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-1/2 relative z-10 flex-col justify-center px-12 xl:px-20"
      >
        {/* Airport terminal illustration */}
        <div className="mb-10">
          <svg
            viewBox="0 0 400 200"
            className="w-full max-w-md opacity-20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Terminal building silhouette */}
            <rect x="20" y="80" width="360" height="100" rx="4" className="fill-brand" />
            <rect x="40" y="60" width="320" height="30" rx="2" className="fill-brand" />
            <rect x="60" y="45" width="280" height="20" rx="2" className="fill-brand" />
            {/* Control tower */}
            <rect x="180" y="10" width="40" height="40" rx="2" className="fill-brand" />
            <rect x="170" y="5" width="60" height="10" rx="4" className="fill-brand" />
            {/* Windows */}
            <rect x="60" y="100" width="25" height="35" rx="2" fill="currentColor" className="text-background" opacity="0.3" />
            <rect x="100" y="100" width="25" height="35" rx="2" fill="currentColor" className="text-background" opacity="0.3" />
            <rect x="140" y="100" width="25" height="35" rx="2" fill="currentColor" className="text-background" opacity="0.3" />
            <rect x="235" y="100" width="25" height="35" rx="2" fill="currentColor" className="text-background" opacity="0.3" />
            <rect x="275" y="100" width="25" height="35" rx="2" fill="currentColor" className="text-background" opacity="0.3" />
            <rect x="315" y="100" width="25" height="35" rx="2" fill="currentColor" className="text-background" opacity="0.3" />
            {/* Main entrance */}
            <rect x="170" y="95" width="60" height="55" rx="3" fill="currentColor" className="text-background" opacity="0.3" />
            {/* Ground line */}
            <line x1="0" y1="180" x2="400" y2="180" className="stroke-brand" strokeWidth="2" />
            {/* Trolleys */}
            <circle cx="80" cy="175" r="4" className="fill-brand" />
            <rect x="75" y="165" width="10" height="8" rx="1" className="fill-brand" />
            <circle cx="320" cy="175" r="4" className="fill-brand" />
            <rect x="315" y="165" width="10" height="8" rx="1" className="fill-brand" />
          </svg>
        </div>

        <h1 className="text-4xl xl:text-5xl font-extrabold font-montserrat text-foreground mb-4 leading-tight">
          {t('login.tagline')}
        </h1>
        <p className="text-lg text-muted-foreground font-poppins mb-8 max-w-lg leading-relaxed">
          {t('login.description')}
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
              <span className="text-sm font-medium font-lexend text-foreground">
                {feature.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <Card className="border-border/50 shadow-lg backdrop-blur-sm">
            <CardContent className="p-8">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <LogoFull size="lg" />
              </div>

              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold font-montserrat text-foreground">
                  {t('login.welcomeBack')}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground font-lexend">
                  {t('login.signInSubtext')}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">{t('login.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('login.emailPlaceholder')}
                      className="pl-10"
                      {...register('email')}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive font-lexend">
                      {t(errors.email.message!)}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">{t('login.password')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('login.passwordPlaceholder')}
                      className="pl-10 pr-10"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive font-lexend">
                      {t(errors.password.message!)}
                    </p>
                  )}
                </div>

                {/* Remember me & Forgot password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-border text-brand focus:ring-brand"
                    />
                    <span className="text-sm text-muted-foreground font-lexend">
                      {t('login.rememberMe')}
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-brand hover:text-brand-dark font-medium font-lexend transition-colors"
                  >
                    {t('login.forgotPassword')}
                  </button>
                </div>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-md bg-destructive/10 p-3 text-sm text-destructive text-center font-lexend"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  className="w-full h-11 font-semibold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('login.signingIn')}
                    </>
                  ) : (
                    t('login.signIn')
                  )}
                </Button>
              </form>

              {/* Footer */}
              <p className="mt-8 text-center text-xs text-muted-foreground font-roboto">
                {t('login.securedAccess')}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
