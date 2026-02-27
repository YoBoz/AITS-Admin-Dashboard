import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card, CardContent } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
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
  const { theme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

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
      // Trigger exit animation instead of immediate navigate
      setLoginSuccess(true);
    } catch {
      setError(t('login.invalidCredentials'));
    }
  };

  // Navigate after watermark finishes sweeping left
  const handleAnimationComplete = useCallback(() => {
    if (loginSuccess) {
      setTimeout(() => navigate(from, { replace: true }), 500);
    }
  }, [loginSuccess, navigate, from]);

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-background">
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
          filter: theme === 'tron'
            ? 'invert(65%) sepia(100%) saturate(500%) hue-rotate(85deg) brightness(110%) drop-shadow(0 0 20px rgba(0,255,102,0.4))'
            : theme === 'eclipse'
            ? 'invert(45%) sepia(80%) saturate(800%) hue-rotate(230deg) brightness(95%)'
            : theme === 'dark'
            ? 'invert(30%) sepia(70%) saturate(1500%) hue-rotate(330deg) brightness(90%)'
            : undefined
        }}
        initial={{ x: '50vw', y: '-50%', opacity: 0 }}
        animate={loginSuccess
          ? { x: '-110vw', y: '-50%', opacity: [0.08, 0.15, 0.08, 0], transition: { duration: 1.6, ease: [0.4, 0, 0.2, 1] } }
          : { x: 0, y: '-50%', opacity: theme === 'tron' ? 0.15 : theme === 'eclipse' ? 0.12 : theme === 'dark' ? 0.1 : 0.04, transition: { duration: 1.2, ease: [0, 0, 0.2, 1] } }
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

      {/* Top right controls */}
      <motion.div
        className="fixed top-4 right-4 z-50 flex items-center gap-1"
        animate={loginSuccess ? { opacity: 0, x: 20 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <LanguageSwitcher />
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
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src={theme === 'tron' ? '/images/AITS - Tron.svg' : theme === 'eclipse' ? '/images/AITS - Eclipse.svg' : theme === 'dark' ? '/images/AiTS_White.svg' : '/images/AiTS.svg'} 
                alt="Ai-TS" 
                className={`h-16 w-auto object-contain ${theme === 'tron' ? 'tron-logo-glow' : ''}`}
              />
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

            {/* Demo Credentials */}
            <div className="mt-6 pt-4 border-t border-border/30">
              <p className="text-xs text-center text-muted-foreground font-lexend mb-2">Demo Credentials</p>
              <div className="bg-muted/50 rounded-md p-3 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="text-foreground">admin@aits.io</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-muted-foreground">Password:</span>
                  <span className="text-foreground">Admin@123</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
