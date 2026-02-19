import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoginPage from '@/pages/auth/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { RootLayout } from '@/layouts/RootLayout';
import { MerchantLayout } from '@/layouts/merchant/MerchantLayout';
import { MerchantProtectedRoute } from './MerchantProtectedRoute';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Lazy-load dashboard pages
const OverviewPage = lazy(() => import('@/pages/dashboard/OverviewPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));

// Phase 3 pages
const TrolleyHubPage = lazy(() => import('@/pages/trolleys/TrolleyHubPage'));
const TrolleyDetailPage = lazy(() => import('@/pages/trolleys/TrolleyDetailPage'));
const ShopHubPage = lazy(() => import('@/pages/shops/ShopHubPage'));
const ShopDetailPage = lazy(() => import('@/pages/shops/ShopDetailPage'));
const TerminalMapPage = lazy(() => import('@/pages/map/TerminalMapPage'));
const OffersPage = lazy(() => import('@/pages/offers/OffersPage'));

// Phase 4 pages
const HeatmapPage = lazy(() => import('@/pages/heatmap/HeatmapPage'));
const VisitorStatsPage = lazy(() => import('@/pages/visitors/VisitorStatsPage'));
const AlertsHubPage = lazy(() => import('@/pages/alerts/AlertsHubPage'));
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'));

// Phase 5 pages
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));

// Phase 6 error pages
const NotFoundPage = lazy(() => import('@/pages/errors/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('@/pages/errors/UnauthorizedPage'));
const ServerErrorPage = lazy(() => import('@/pages/errors/ServerErrorPage'));

// Phase 7 — Merchant pages
const MerchantLoginPage = lazy(() => import('@/pages/merchant/MerchantLoginPage'));
const OrdersInboxPage = lazy(() => import('@/pages/merchant/OrdersInboxPage'));
const MenuManagementPage = lazy(() => import('@/pages/merchant/MenuManagementPage'));
const CouponsPage = lazy(() => import('@/pages/merchant/CouponsPage'));
const CampaignsPage = lazy(() => import('@/pages/merchant/CampaignsPage'));
const RefundsPage = lazy(() => import('@/pages/merchant/RefundsPage'));
const MerchantAnalyticsPage = lazy(() => import('@/pages/merchant/MerchantAnalyticsPage'));
const SLASettingsPage = lazy(() => import('@/pages/merchant/SLASettingsPage'));
const MerchantUnauthorizedPage = lazy(() => import('@/pages/merchant/MerchantUnauthorizedPage'));

// Phase 8 — Ops Command Center pages (fleet & health moved to Trolley Hub, incidents moved to Alerts Hub, SLA & venue & orders moved to Shop Hub, policies moved to Admin Hub)
const IncidentDetailPage = lazy(() => import('@/pages/ops/IncidentDetailPage'));
const GateSurgePage = lazy(() => import('@/pages/ops/GateSurgePage'));

// Phase 9 — Compliance, Global Rules, Permissions, Policies → Administration Hub
const AdminHubPage = lazy(() => import('@/pages/administration/AdminHubPage'));

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
        element: <Navigate to="/login" replace />,
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
            element: (
              <SuspenseWrapper>
                <TrolleyHubPage />
              </SuspenseWrapper>
            ),
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
                <TerminalMapPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'offers',
            element: (
              <SuspenseWrapper>
                <OffersPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'heatmap',
            element: (
              <SuspenseWrapper>
                <HeatmapPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'visitors',
            element: (
              <SuspenseWrapper>
                <VisitorStatsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'alerts',
            element: (
              <SuspenseWrapper>
                <AlertsHubPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'notifications',
            element: (
              <SuspenseWrapper>
                <NotificationsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'complaints',
            element: <Navigate to="/dashboard/alerts?tab=complaints" replace />,
          },
          {
            path: 'permissions',
            element: <Navigate to="/dashboard/admin?tab=permissions" replace />,
          },
          {
            path: 'settings',
            element: (
              <SuspenseWrapper>
                <SettingsPage />
              </SuspenseWrapper>
            ),
          },
          // Phase 8 — Ops routes (fleet & health redirected to Trolley Hub, incidents redirected to Alerts Hub)
          {
            path: 'ops/fleet',
            element: <Navigate to="/dashboard/trolleys?tab=live-tracking" replace />,
          },
          {
            path: 'ops/health',
            element: <Navigate to="/dashboard/trolleys?tab=health" replace />,
          },
          {
            path: 'ops/incidents',
            element: <Navigate to="/dashboard/alerts?tab=incidents" replace />,
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
            path: 'ops/orders',
            element: <Navigate to="/dashboard/shops?tab=orders" replace />,
          },
          {
            path: 'ops/surge',
            element: (
              <SuspenseWrapper>
                <GateSurgePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'ops/policies',
            element: <Navigate to="/dashboard/admin?tab=policies" replace />,
          },
          {
            path: 'ops/sla',
            element: <Navigate to="/dashboard/shops?tab=sla" replace />,
          },
          {
            path: 'ops/venue',
            element: <Navigate to="/dashboard/shops?tab=venue" replace />,
          },
          // Phase 9 — Administration Hub (Compliance, Global Rules, Permissions, Policies)
          {
            path: 'admin',
            element: (
              <SuspenseWrapper>
                <AdminHubPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'compliance',
            element: <Navigate to="/dashboard/admin?tab=compliance" replace />,
          },
          {
            path: 'global-rules',
            element: <Navigate to="/dashboard/admin?tab=global-rules" replace />,
          },
          {
            path: 'cms',
            element: <Navigate to="/dashboard/shops?tab=content" replace />,
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
          { index: true, element: <Navigate to="/merchant/orders" replace /> },
          { path: 'orders', element: <MerchantProtectedRoute requiredPermission="orders.view"><SuspenseWrapper><OrdersInboxPage /></SuspenseWrapper></MerchantProtectedRoute> },
          { path: 'menu', element: <MerchantProtectedRoute requiredPermission="menu.view"><SuspenseWrapper><MenuManagementPage /></SuspenseWrapper></MerchantProtectedRoute> },
          { path: 'campaigns', element: <MerchantProtectedRoute requiredPermission="campaigns.view"><SuspenseWrapper><CampaignsPage /></SuspenseWrapper></MerchantProtectedRoute> },
          { path: 'coupons', element: <MerchantProtectedRoute requiredPermission="coupons.validate"><SuspenseWrapper><CouponsPage /></SuspenseWrapper></MerchantProtectedRoute> },
          { path: 'refunds', element: <MerchantProtectedRoute requiredPermission="refunds.view"><SuspenseWrapper><RefundsPage /></SuspenseWrapper></MerchantProtectedRoute> },
          { path: 'analytics', element: <MerchantProtectedRoute requiredPermission="analytics.view"><SuspenseWrapper><MerchantAnalyticsPage /></SuspenseWrapper></MerchantProtectedRoute> },
          { path: 'settings', element: <MerchantProtectedRoute requiredPermission="sla.view"><SuspenseWrapper><SLASettingsPage /></SuspenseWrapper></MerchantProtectedRoute> },
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
