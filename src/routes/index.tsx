import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/auth/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { RootLayout } from '@/layouts/RootLayout';
import { MerchantLayout } from '@/layouts/merchant/MerchantLayout';
import { MerchantProtectedRoute } from './MerchantProtectedRoute';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Lazy-load dashboard pages
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const OverviewPage = lazy(() => import('@/pages/dashboard/OverviewPage'));

// Phase 3 pages
const TrolleyDetailPage = lazy(() => import('@/pages/trolleys/TrolleyDetailPage'));
const ShopHubPage = lazy(() => import('@/pages/shops/ShopHubPage'));
const ShopDetailPage = lazy(() => import('@/pages/shops/ShopDetailPage'));

// Phase 4 pages (AlertsHubPage removed — alerts now redirect to incidents)

// Phase 6 error pages
const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@/pages/errors/UnauthorizedPage'));
const ServerErrorPage = lazy(() => import('@/pages/errors/ServerErrorPage'));

// Phase 7 — Merchant pages
const MerchantLoginPage = lazy(() => import('@/pages/merchant/MerchantLoginPage'));
const MerchantDashboardPage = lazy(() => import('@/pages/merchant/MerchantDashboardPage'));
const OrdersInboxPage = lazy(() => import('@/pages/merchant/OrdersInboxPage'));
const MenuManagementPage = lazy(() => import('@/pages/merchant/MenuManagementPage'));
const CouponsPage = lazy(() => import('@/pages/merchant/CouponsPage'));
const CampaignsPage = lazy(() => import('@/pages/merchant/CampaignsPage'));
const RefundsPage = lazy(() => import('@/pages/merchant/RefundsPage'));
const MerchantAnalyticsPage = lazy(() => import('@/pages/merchant/MerchantAnalyticsPage'));
const SLASettingsPage = lazy(() => import('@/pages/merchant/SLASettingsPage'));
const DeliverySettingsPage = lazy(() => import('@/pages/merchant/DeliverySettingsPage'));
const ReportsPage = lazy(() => import('@/pages/merchant/ReportsPage'));
const StaffRolesPage = lazy(() => import('@/pages/merchant/StaffRolesPage'));
const MerchantSettingsPage = lazy(() => import('@/pages/merchant/MerchantSettingsPage'));
const MerchantUnauthorizedPage = lazy(() => import('@/pages/merchant/MerchantUnauthorizedPage'));

// Phase 8 — Ops Command Center pages
const IncidentDetailPage = lazy(() => import('@/pages/ops/IncidentDetailPage'));
const IncidentsPage = lazy(() => import('@/pages/ops/IncidentsPage'));
const OpsOrdersConsolePage = lazy(() => import('@/pages/ops/OpsOrdersConsolePage'));
const SLADashboardPage = lazy(() => import('@/pages/ops/SLADashboardPage'));
const PoliciesPage = lazy(() => import('@/pages/ops/PoliciesPage'));

// New pages — Command Center requirements
const RunnersPage = lazy(() => import('@/pages/runners/RunnersPage'));
const GateManagementPage = lazy(() => import('@/pages/gates/GateManagementPage'));
const AuditLogsPage = lazy(() => import('@/pages/audit/AuditLogsPage'));
const PermissionsPage = lazy(() => import('@/pages/permissions/PermissionsPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));

// Hub pages — absorb removed sidebar items as sub-tabs
const LiveMapHubPage = lazy(() => import('@/pages/map/LiveMapHubPage'));
const FleetMonitoringHubPage = lazy(() => import('@/pages/fleet/FleetMonitoringHubPage'));
const ReportsHubPage = lazy(() => import('@/pages/reports/ReportsHubPage'));

// Phase 9 — Administration Hub redirected to policies (lazy import removed)

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/unauthorized',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <UnauthorizedPage />
          </Suspense>
        ),
      },
      {
        path: '/error',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <ServerErrorPage />
          </Suspense>
        ),
      },
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard/overview" replace />,
          },
          {
            path: 'overview',
            element: (
              <SuspenseWrapper>
                <OverviewPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'profile',
            element: (
              <SuspenseWrapper>
                <ProfilePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'trolleys',
            element: <Navigate to="/dashboard/fleet?tab=trolleys" replace />,
          },
          {
            path: 'trolleys/:id',
            element: (
              <SuspenseWrapper>
                <TrolleyDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'shops',
            element: (
              <SuspenseWrapper>
                <ShopHubPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'shops/:id',
            element: (
              <SuspenseWrapper>
                <ShopDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'map',
            element: (
              <SuspenseWrapper>
                <LiveMapHubPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'offers',
            element: <Navigate to="/dashboard/shops" replace />,
          },
          {
            path: 'heatmap',
            element: <Navigate to="/dashboard/map?tab=heatmap" replace />,
          },
          {
            path: 'visitors',
            element: <Navigate to="/dashboard/reports" replace />,
          },
          {
            path: 'alerts',
            element: <Navigate to="/dashboard/incidents" replace />,
          },
          {
            path: 'notifications',
            element: <Navigate to="/dashboard/shops" replace />,
          },
          {
            path: 'complaints',
            element: <Navigate to="/dashboard/incidents" replace />,
          },
          {
            path: 'permissions',
            element: (
              <SuspenseWrapper>
                <PermissionsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'settings',
            element: (
              <SuspenseWrapper>
                <SettingsPage />
              </SuspenseWrapper>
            ),
          },
          // Phase 8 — Ops routes (now promoted to top-level navigation)
          {
            path: 'fleet',
            element: (
              <SuspenseWrapper>
                <FleetMonitoringHubPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'ops/fleet',
            element: <Navigate to="/dashboard/fleet" replace />,
          },
          {
            path: 'ops/health',
            element: <Navigate to="/dashboard/trolleys?tab=health" replace />,
          },
          {
            path: 'incidents',
            element: (
              <SuspenseWrapper>
                <IncidentsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'ops/incidents',
            element: <Navigate to="/dashboard/incidents" replace />,
          },
          {
            path: 'ops/incidents/:id',
            element: (
              <SuspenseWrapper>
                <IncidentDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'incidents/:id',
            element: (
              <SuspenseWrapper>
                <IncidentDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'orders',
            element: (
              <SuspenseWrapper>
                <OpsOrdersConsolePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'ops/orders',
            element: <Navigate to="/dashboard/orders" replace />,
          },
          {
            path: 'runners',
            element: (
              <SuspenseWrapper>
                <RunnersPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'gates',
            element: (
              <SuspenseWrapper>
                <GateManagementPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'ops/surge',
            element: <Navigate to="/dashboard/gates" replace />,
          },
          {
            path: 'policies',
            element: (
              <SuspenseWrapper>
                <PoliciesPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'ops/policies',
            element: <Navigate to="/dashboard/policies" replace />,
          },
          {
            path: 'sla',
            element: (
              <SuspenseWrapper>
                <SLADashboardPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'ops/sla',
            element: <Navigate to="/dashboard/sla" replace />,
          },
          {
            path: 'ops/venue',
            element: <Navigate to="/dashboard/shops?tab=venue" replace />,
          },
          {
            path: 'reports',
            element: (
              <SuspenseWrapper>
                <ReportsHubPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'audit-logs',
            element: (
              <SuspenseWrapper>
                <AuditLogsPage />
              </SuspenseWrapper>
            ),
          },
          // Phase 9 — Administration Hub redirected to policies
          {
            path: 'admin',
            element: <Navigate to="/dashboard/policies" replace />,
          },
          {
            path: 'compliance',
            element: <Navigate to="/dashboard/admin?tab=global-rules" replace />,
          },
          {
            path: 'global-rules',
            element: <Navigate to="/dashboard/admin?tab=global-rules" replace />,
          },
          {
            path: 'cms',
            element: <Navigate to="/dashboard/shops" replace />,
          },
          {
            path: 'merchant-directory',
            element: <Navigate to="/dashboard/shops?tab=merchants" replace />,
          },
        ],
      },
      // Merchant routes
      {
        path: '/merchant/login',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <MerchantLoginPage />
          </Suspense>
        ),
      },
      {
        path: '/merchant/unauthorized',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <MerchantUnauthorizedPage />
          </Suspense>
        ),
      },
      {
        path: '/merchant',
        element: <MerchantLayout />,
        children: [
          { index: true, element: <Navigate to="/merchant/dashboard" replace /> },
          { path: 'dashboard', element: <MerchantProtectedRoute requiredPermission="dashboard.view"><SuspenseWrapper><MerchantDashboardPage /></SuspenseWrapper></MerchantProtectedRoute> },
          { path: 'orders', element: <MerchantProtectedRoute requiredPermission="orders.view"><SuspenseWrapper><OrdersInboxPage /></SuspenseWrapper></MerchantProtectedRoute> },
          { path: 'menu', element: <MerchantProtectedRoute requiredPermission="menu.view"><SuspenseWrapper><MenuManagementPage /></SuspenseWrapper></MerchantProtectedRoute> },
          { path: 'capacity-sla', element: <MerchantProtectedRoute requiredPermission="sla.view"><SuspenseWrapper><SLASettingsPage /></SuspenseWrapper></MerchantProtectedRoute> },
          { path: 'delivery', element: <MerchantProtectedRoute requiredPermission="delivery.view"><SuspenseWrapper><DeliverySettingsPage /></SuspenseWrapper></MerchantProtectedRoute> },
          { path: 'campaigns', element: <MerchantProtectedRoute requiredPermission="campaigns.view"><SuspenseWrapper><CampaignsPage /></SuspenseWrapper></MerchantProtectedRoute> },
          { path: 'coupons', element: <MerchantProtectedRoute requiredPermission="coupons.validate"><SuspenseWrapper><CouponsPage /></SuspenseWrapper></MerchantProtectedRoute> },
          { path: 'refunds', element: <MerchantProtectedRoute requiredPermission="refunds.view"><SuspenseWrapper><RefundsPage /></SuspenseWrapper></MerchantProtectedRoute> },
          { path: 'reports', element: <MerchantProtectedRoute requiredPermission="reports.view"><SuspenseWrapper><ReportsPage /></SuspenseWrapper></MerchantProtectedRoute> },
          { path: 'staff', element: <MerchantProtectedRoute requiredPermission="staff.view"><SuspenseWrapper><StaffRolesPage /></SuspenseWrapper></MerchantProtectedRoute> },
          { path: 'settings', element: <MerchantProtectedRoute requiredPermission="settings.view"><SuspenseWrapper><MerchantSettingsPage /></SuspenseWrapper></MerchantProtectedRoute> },
          { path: 'analytics', element: <MerchantProtectedRoute requiredPermission="analytics.view"><SuspenseWrapper><MerchantAnalyticsPage /></SuspenseWrapper></MerchantProtectedRoute> },
        ],
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);
