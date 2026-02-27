import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plane,
  QrCode,
  MapPin,
  ShoppingBag,
  Clock,
  Package,
  Truck,
  Shield,
  CheckCircle2,
  ArrowRight,
  Users,
  Store,
  Smartphone,
  LayoutDashboard,
  Radio,
  Bell,
  Target,
  Gift,
  Battery,
  Wrench,
  Navigation,
  BarChart3,
  Globe,
  Lock,
  Zap,
  Timer,
  AlertTriangle,
  RefreshCw,
  Utensils,
  ChefHat,
  ClipboardList,
  Settings,
  Eye,
  Activity,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ROUTES } from '@/lib/constants';
import { useTheme } from '@/hooks/useTheme';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const coreOutcomes = [
  {
    icon: Radio,
    title: 'Real-time Device Tracking',
    description: 'Floor-aware location tracking with confidence scoring for precise passenger engagement',
  },
  {
    icon: Bell,
    title: 'Contextual Engagement',
    description: 'Personalized suggestions, offers, coupons, and alerts based on movement, gate, and time',
  },
  {
    icon: Utensils,
    title: 'F&B Marketplace',
    description: 'Deliver-to-gate ordering with intelligent auto-refusal when timings don\'t work',
  },
  {
    icon: Wrench,
    title: 'Operational Tooling',
    description: 'Low-battery alerts, health monitoring, remote management, and usage analytics',
  },
  {
    icon: Target,
    title: 'Advertiser Toolkit',
    description: 'Advanced targeting with impression-to-redemption attribution tracking',
  },
  {
    icon: Globe,
    title: 'Multi-tenant Ready',
    description: 'Cross-airport operations support with destination-based rules and controls',
  },
];

const workflowSteps = [
  {
    icon: QrCode,
    title: 'Scan Boarding Pass',
    description: 'Passenger scans their boarding pass to link their session with flight details',
  },
  {
    icon: Plane,
    title: 'Auto-Detect Flight',
    description: 'System automatically detects gate location, departure time, and flight status',
  },
  {
    icon: MapPin,
    title: 'Contextual Suggestions',
    description: 'AI-powered restaurant recommendations based on location, time, and preferences',
  },
  {
    icon: Clock,
    title: 'Gate Safety Check',
    description: 'Continuous calculation ensures every order can be delivered before boarding',
  },
  {
    icon: ShoppingBag,
    title: 'Order & Pay',
    description: 'Secure on-device ordering with multiple payment options and instant confirmation',
  },
  {
    icon: ChefHat,
    title: 'Merchant Prepares',
    description: 'Order routes to kitchen display system; prep time tracked against SLA',
  },
  {
    icon: Truck,
    title: 'Runner Delivers',
    description: 'Optimized runner assignment with real-time tracking to your gate',
  },
  {
    icon: CheckCircle2,
    title: 'Handoff Proof',
    description: 'QR scan or signature confirms delivery; full audit trail maintained',
  },
];

const scenarios = [
  {
    icon: QrCode,
    title: 'Scan & Engage',
    description: 'Boarding pass links session; gate-safe suggestions appear; coupons issued and redeemed seamlessly',
  },
  {
    icon: Gift,
    title: 'Smart Campaigns',
    description: 'Scheduled push offers with geo-targeting, movement direction, time windows, and frequency caps',
  },
  {
    icon: Activity,
    title: 'Capacity-Aware Throttle',
    description: 'Kitchen marks "Busy" and campaign engine auto-throttles; orders continue with updated ETAs',
  },
  {
    icon: AlertTriangle,
    title: 'Auto-Refusal',
    description: 'When prep + walk + queue + buffer exceeds time-to-gate, order auto-refuses with alternatives',
  },
  {
    icon: RefreshCw,
    title: 'Gate Change Alerts',
    description: 'Flight status updates trigger instant notifications to affected passengers and devices',
  },
  {
    icon: Battery,
    title: 'Device Ops',
    description: 'Low battery or offline alerts; technician locates device; biometric login for maintenance',
  },
];

const stakeholders = [
  {
    icon: Users,
    title: 'Passengers',
    description: 'Scan, browse, order, pay, and receive deliveries at gate with full flight awareness',
  },
  {
    icon: Store,
    title: 'Restaurant Managers',
    description: 'Manage menus, capacity, campaigns; view live orders; push targeted alerts and coupons',
  },
  {
    icon: ChefHat,
    title: 'Kitchen Staff',
    description: 'Receive orders on KDS or printer; prepare and hand off to runners with SLA visibility',
  },
  {
    icon: Settings,
    title: 'Operations',
    description: 'Monitor devices, batteries, zones; enforce policies; resolve incidents in real-time',
  },
  {
    icon: Target,
    title: 'Advertisers',
    description: 'Configure creatives and targeting rules; view impression-to-conversion attribution',
  },
  {
    icon: Wrench,
    title: 'Field Technicians',
    description: 'Biometric login; wheel-lock control; diagnostics and maintenance mode access',
  },
];

const priorities = [
  {
    icon: Plane,
    title: 'Flight Timing First',
    description: 'Every decision respects departure schedules and boarding windows',
  },
  {
    icon: CheckCircle2,
    title: 'Delivery Feasibility',
    description: 'Orders only accepted when on-time delivery is guaranteed',
  },
  {
    icon: Package,
    title: 'Deterministic States',
    description: 'Clear, predictable order progression with full state machine tracking',
  },
  {
    icon: Shield,
    title: 'Full Auditability',
    description: 'Every action logged and traceable for compliance and analytics',
  },
];

const applications = [
  {
    icon: Smartphone,
    title: 'Passenger Trolley App',
    description: 'POS-equipped trolleys and kiosks with QR scanning, contextual suggestions, dynamic offers, gate-safe alerts, on-the-move ordering, and secure payments',
    features: ['Boarding pass scan', 'Language selection', 'Gate-aware browsing', 'Secure payments', 'Order tracking'],
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Navigation,
    title: 'Runner App',
    description: 'Efficient delivery routing with real-time assignment, turn-by-turn navigation through terminals, handoff verification, and delivery proof capture',
    features: ['Smart assignment', 'Route optimization', 'Handoff verification', 'Performance tracking'],
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Store,
    title: 'Merchant Dashboard',
    description: 'Complete restaurant management with live order queue, menu management, capacity controls, local campaigns, SLA monitoring, and performance analytics',
    features: ['Live order management', 'Menu & pricing', 'Capacity controls', 'Campaign management', 'Analytics'],
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: LayoutDashboard,
    title: 'Admin / Ops Dashboard',
    description: 'Comprehensive operations center with fleet monitoring, device health, zone management, incident resolution, SLA tracking, and reporting tools',
    features: ['Fleet monitoring', 'Device management', 'Incident resolution', 'SLA dashboards', 'Audit logs'],
    color: 'from-purple-500 to-pink-500',
  },
];

const fleetFeatures = [
  {
    icon: Radio,
    title: 'Real-time Tracking',
    description: 'Location-aware tracking with floor detection and movement intelligence',
  },
  {
    icon: Battery,
    title: 'Battery Management',
    description: 'SoC monitoring, low-battery alerts, and charging station health tracking',
  },
  {
    icon: Lock,
    title: 'Wheel-Lock Control',
    description: 'Policy-based locking with biometric override and full audit trail',
  },
  {
    icon: Zap,
    title: 'Remote Management',
    description: 'OTA updates, remote reboot/lock, and zero-touch enrollment',
  },
];

const merchantFeatures = [
  {
    icon: ClipboardList,
    title: 'Live Orders',
    description: 'Accept, prepare, ready, and track deliveries with SLA timers',
  },
  {
    icon: Timer,
    title: 'Capacity Control',
    description: 'Set Busy/Closed status and prep times; auto-throttles recommendations',
  },
  {
    icon: Gift,
    title: 'Campaigns Lite',
    description: 'Local promos with geo/time targeting and language variants',
  },
  {
    icon: BarChart3,
    title: 'Performance Analytics',
    description: 'Order volume, SLA compliance, and redemption tracking',
  },
];

const opsFeatures = [
  {
    icon: Eye,
    title: 'Fleet Map',
    description: 'Device status, battery, location, firmware versions at a glance',
  },
  {
    icon: Settings,
    title: 'Command Center',
    description: 'Lock/unlock, reboot, update, and configure with bulk actions',
  },
  {
    icon: Activity,
    title: 'Health Alerts',
    description: 'Offline, low-battery, zone breach, and sensor fault notifications',
  },
  {
    icon: Shield,
    title: 'Audit & Compliance',
    description: 'Immutable logs for all admin actions and wheel-lock overrides',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={theme === 'tron' ? '/images/AITS - Tron.svg' : theme === 'eclipse' ? '/images/AITS - Eclipse.svg' : theme === 'dark' ? '/images/AiTS_White.svg' : '/images/AiTS.svg'} alt="Ai-TS" className={`h-10 w-auto ${theme === 'tron' ? 'tron-logo-glow' : ''}`} />
              <span className="hidden sm:block text-sm text-muted-foreground font-lexend">
                Airport Intelligent Trolley System
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/merchant/login')}
              >
                Merchant Login
              </Button>
              <Button size="sm" onClick={() => navigate(ROUTES.LOGIN)}>
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent" />
        
        {/* Animated flowing lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="flowGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--brand))" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(var(--brand))" stopOpacity="0.15" />
                <stop offset="100%" stopColor="hsl(var(--brand))" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="flowGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0" />
                <stop offset="50%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0.08" />
                <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Flow line 1 */}
            <motion.path
              d="M-100,200 Q300,150 600,250 T1200,200 T1800,180 T2400,220"
              fill="none"
              stroke="url(#flowGradient1)"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, times: [0, 0.6, 1] }}
            />
            {/* Flow line 2 */}
            <motion.path
              d="M-100,400 Q400,350 700,420 T1300,380 T1900,400 T2500,360"
              fill="none"
              stroke="url(#flowGradient2)"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 5, ease: "easeInOut", delay: 1, repeat: Infinity, times: [0, 0.6, 1] }}
            />
            {/* Flow line 3 */}
            <motion.path
              d="M-100,600 Q350,550 650,620 T1250,580 T1850,620 T2450,580"
              fill="none"
              stroke="url(#flowGradient1)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
              transition={{ duration: 4.5, ease: "easeInOut", delay: 2, repeat: Infinity, times: [0, 0.6, 1] }}
            />
          </svg>
          

          
          {/* Airport Skyline Silhouette */}
          <div className="absolute bottom-0 left-0 right-0 opacity-[0.06] pointer-events-none">
            <svg 
              viewBox="0 0 1440 200" 
              className="w-full h-auto text-foreground" 
              fill="currentColor"
              preserveAspectRatio="xMidYMax slice"
            >
              {/* Ground/Runway */}
              <rect x="0" y="190" width="1440" height="10" />
              
              {/* Runway lights */}
              {[...Array(20)].map((_, i) => (
                <circle key={i} cx={72 * i + 36} cy="195" r="2" className="fill-brand" fillOpacity="0.5" />
              ))}
              
              {/* Left Terminal Building */}
              <rect x="50" y="120" width="200" height="70" />
              <rect x="60" y="100" width="180" height="25" />
              <rect x="80" y="85" width="140" height="20" />
              {/* Terminal windows */}
              {[...Array(8)].map((_, i) => (
                <rect key={`lw${i}`} x={70 + i * 22} y="130" width="15" height="20" fillOpacity="0.3" className="fill-background" />
              ))}
              
              {/* Left Control Tower */}
              <rect x="280" y="60" width="25" height="130" />
              <rect x="270" y="40" width="45" height="25" />
              <ellipse cx="292" cy="35" rx="30" ry="10" />
              <rect x="288" y="5" width="8" height="30" />
              <circle cx="292" cy="3" r="5" className="fill-brand" fillOpacity="0.3" />
              
              {/* Center Main Terminal */}
              <rect x="500" y="100" width="440" height="90" />
              <rect x="520" y="70" width="400" height="35" />
              <rect x="560" y="50" width="320" height="25" />
              {/* Curved roof */}
              <ellipse cx="720" cy="50" rx="180" ry="20" />
              {/* Large windows */}
              {[...Array(12)].map((_, i) => (
                <rect key={`cw${i}`} x={520 + i * 35} y="110" width="25" height="40" fillOpacity="0.3" className="fill-background" />
              ))}
              {/* Terminal entrance */}
              <rect x="680" y="150" width="80" height="40" fillOpacity="0.2" className="fill-background" />
              
              {/* Right Terminal Building */}
              <rect x="1000" y="110" width="250" height="80" />
              <rect x="1020" y="90" width="210" height="25" />
              <rect x="1050" y="75" width="150" height="20" />
              {/* Terminal windows */}
              {[...Array(10)].map((_, i) => (
                <rect key={`rw${i}`} x={1015 + i * 23} y="125" width="15" height="25" fillOpacity="0.3" className="fill-background" />
              ))}
              
              {/* Right Control Tower */}
              <rect x="1280" y="50" width="30" height="140" />
              <rect x="1268" y="25" width="54" height="30" />
              <ellipse cx="1295" cy="20" rx="35" ry="12" />
              <rect x="1290" y="-15" width="10" height="35" />
              <circle cx="1295" cy="-18" r="6" className="fill-brand" fillOpacity="0.3" />
              
              {/* Hangars on far right */}
              <path d="M1350,190 L1350,140 Q1380,120 1410,140 L1410,190 Z" />
              <path d="M1380,190 L1380,150 Q1400,135 1420,150 L1420,190 Z" />
              
              {/* Jet bridge connectors */}
              <rect x="250" y="135" width="30" height="8" />
              <rect x="940" y="125" width="60" height="10" />
              <rect x="1250" y="130" width="30" height="8" />
              
              {/* Parked aircraft silhouettes */}
              <g transform="translate(350, 160)">
                <ellipse cx="0" cy="0" rx="35" ry="8" />
                <polygon points="-20,-5 -45,15 -45,20 -20,5" />
                <polygon points="20,-5 45,15 45,20 20,5" />
                <polygon points="0,-8 -8,5 8,5" />
              </g>
              <g transform="translate(1150, 155)">
                <ellipse cx="0" cy="0" rx="30" ry="7" />
                <polygon points="-17,-4 -38,12 -38,16 -17,4" />
                <polygon points="17,-4 38,12 38,16 17,4" />
                <polygon points="0,-7 -7,4 7,4" />
              </g>
            </svg>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-medium mb-6">
              <Radio className="h-4 w-4" />
              Location-Aware Retail & Engagement Platform
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-montserrat text-foreground leading-tight">
              Smart Commerce for{' '}
              <span className="text-brand">Modern Airports</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground font-lexend max-w-3xl mx-auto">
              POS-equipped trolleys and kiosks engage passengers with contextual restaurant suggestions, 
              dynamic offers, and gate-safe alerts. Scan-to-link via boarding pass, on-the-move ordering, 
              and deliver-to-gate logistics — all powered by real-time location intelligence.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate(ROUTES.LOGIN)} className="gap-2">
                Admin Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/merchant/login')}>
                Merchant Portal
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ opacity: { delay: 1 }, y: { duration: 1.5, repeat: Infinity } }}
        >
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <span className="text-xs font-lexend">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
              <motion.div 
                className="w-1.5 h-1.5 bg-brand rounded-full"
                animate={{ y: [0, 16, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Core Outcomes */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-foreground">
              Core Outcomes
            </h2>
            <p className="mt-4 text-muted-foreground font-lexend max-w-2xl mx-auto">
              Transforming airport retail with intelligent, location-aware technology
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {coreOutcomes.map((outcome) => (
              <motion.div key={outcome.title} variants={fadeInUp}>
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-brand/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand/10 text-brand mb-4">
                      <outcome.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold font-montserrat text-foreground mb-2">
                      {outcome.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-lexend">
                      {outcome.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Passenger Journey */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-foreground">
              The Passenger Journey
            </h2>
            <p className="mt-4 text-muted-foreground font-lexend max-w-2xl mx-auto">
              From boarding pass scan to gate delivery in eight seamless steps
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {workflowSteps.map((step, index) => (
              <motion.div key={step.title} variants={fadeInUp}>
                <Card className="relative h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-brand/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand/10 text-brand">
                        <step.icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground font-mono">
                        STEP {index + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold font-montserrat text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-lexend">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Key Scenarios */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-foreground">
              Intelligent Scenarios
            </h2>
            <p className="mt-4 text-muted-foreground font-lexend max-w-2xl mx-auto">
              Smart automation handles complex situations seamlessly
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {scenarios.map((scenario) => (
              <motion.div key={scenario.title} variants={fadeInUp}>
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-brand/10 text-brand">
                        <scenario.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold font-montserrat text-foreground">
                        {scenario.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-lexend">
                      {scenario.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stakeholders */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-foreground">
              Built for Every Stakeholder
            </h2>
            <p className="mt-4 text-muted-foreground font-lexend max-w-2xl mx-auto">
              Purpose-built experiences for passengers, merchants, operations, and beyond
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {stakeholders.map((stakeholder) => (
              <motion.div key={stakeholder.title} variants={fadeInUp}>
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-brand/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand/10 text-brand">
                        <stakeholder.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold font-montserrat text-foreground">
                        {stakeholder.title}
                      </h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-lexend">
                      {stakeholder.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Platform Applications */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-foreground">
              Four Integrated Applications
            </h2>
            <p className="mt-4 text-muted-foreground font-lexend max-w-2xl mx-auto">
              A complete ecosystem connecting passengers, runners, merchants, and operations
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {applications.map((app) => (
              <motion.div key={app.title} variants={fadeInUp}>
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all overflow-hidden group">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-5 mb-6">
                      <div
                        className={`flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} text-white shadow-lg group-hover:scale-110 transition-transform`}
                      >
                        <app.icon className="h-8 w-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold font-montserrat text-foreground mb-2">
                          {app.title}
                        </h3>
                        <p className="text-muted-foreground font-lexend text-sm">
                          {app.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {app.features.map((feature) => (
                        <span
                          key={feature}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Fleet & Device Management */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Fleet Features */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand/10 text-brand">
                  <Truck className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold font-montserrat text-foreground">
                  Fleet Management
                </h3>
              </div>
              <p className="text-muted-foreground font-lexend mb-8">
                Comprehensive device and fleet operations with real-time monitoring, 
                remote management, and intelligent alerting.
              </p>
              <div className="space-y-4">
                {fleetFeatures.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-brand flex-shrink-0">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold font-montserrat text-foreground">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground font-lexend">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Ops Features */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand/10 text-brand">
                  <LayoutDashboard className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold font-montserrat text-foreground">
                  Ops Command Center
                </h3>
              </div>
              <p className="text-muted-foreground font-lexend mb-8">
                Centralized operations console for monitoring, incident resolution, 
                and maintaining enterprise-grade security and compliance.
              </p>
              <div className="space-y-4">
                {opsFeatures.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted text-brand flex-shrink-0">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold font-montserrat text-foreground">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground font-lexend">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Merchant Portal Features */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand/10 text-brand">
                <Store className="h-6 w-6" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-foreground">
              Merchant Portal
            </h2>
            <p className="mt-4 text-muted-foreground font-lexend max-w-2xl mx-auto">
              Everything restaurants need to manage orders, menus, capacity, and local campaigns
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {merchantFeatures.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 text-center">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand/10 text-brand mx-auto mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold font-montserrat text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-lexend">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Priorities */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-foreground">
              Core Priorities
            </h2>
            <p className="mt-4 text-muted-foreground font-lexend max-w-2xl mx-auto">
              The platform always prioritizes what matters most
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {priorities.map((priority) => (
              <motion.div key={priority.title} variants={fadeInUp}>
                <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 text-center hover:border-brand/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brand/10 text-brand mx-auto mb-4">
                      <priority.icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-lg font-semibold font-montserrat text-foreground mb-2">
                      {priority.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-lexend">
                      {priority.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Privacy & Security */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-brand/10 text-brand mx-auto mb-6">
              <Shield className="h-8 w-8" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-foreground mb-4">
              Privacy & Enterprise Security
            </h2>
            <p className="text-muted-foreground font-lexend max-w-2xl mx-auto mb-8">
              Privacy-preserving identity, role-based access control, and enterprise-grade security 
              underpin every aspect of the platform. Full compliance with data protection regulations 
              and payment security standards.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground font-lexend">
              <span className="px-4 py-2 rounded-full bg-muted">Data Protection Compliant</span>
              <span className="px-4 py-2 rounded-full bg-muted">Payment Security Standards</span>
              <span className="px-4 py-2 rounded-full bg-muted">Role-Based Access</span>
              <span className="px-4 py-2 rounded-full bg-muted">Full Audit Logging</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Users className="h-6 w-6 text-brand" />
              <span className="text-sm font-medium text-brand font-lexend">
                Trusted by Leading Airports
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-montserrat text-foreground mb-6">
              Ready to Transform Airport Commerce?
            </h2>
            <p className="text-muted-foreground font-lexend mb-8 max-w-2xl mx-auto">
              Join the platform that's revolutionizing how passengers shop and dine at airports. 
              Real-time tracking, intelligent recommendations, and guaranteed on-time delivery.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => navigate(ROUTES.LOGIN)} className="gap-2">
                Access Admin Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/merchant/login')}>
                Merchant Portal
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={theme === 'tron' ? '/images/AITS - Tron.svg' : theme === 'eclipse' ? '/images/AITS - Eclipse.svg' : theme === 'dark' ? '/images/AiTS_White.svg' : '/images/AiTS.svg'} alt="Ai-TS" className={`h-8 w-auto ${theme === 'tron' ? 'tron-logo-glow' : ''}`} />
              <span className="text-sm text-muted-foreground font-lexend">
                Airport Intelligent Trolley System
              </span>
            </div>
            <p className="text-sm text-muted-foreground font-lexend">
              © {new Date().getFullYear()} Ai-TS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
