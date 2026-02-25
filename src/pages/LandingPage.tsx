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

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/images/AiTS.svg" alt="Ai-TS" className="h-10 w-auto" />
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
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand/10 via-transparent to-transparent" />
        <img
          src="/images/Trolly.svg"
          alt=""
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.03] pointer-events-none select-none"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <img src="/images/AiTS.svg" alt="Ai-TS" className="h-8 w-auto" />
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
