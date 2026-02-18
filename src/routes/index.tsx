import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoginPage from '@/pages/auth/LoginPage';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { RootLayout } from '@/layouts/RootLayout';
import { MerchantLayout } from '@/layouts/merchant/MerchantLayout';
import { LoadingScreen } from '@/components/common/LoadingScreen';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';

// Lazy-load dashboard pages
const OverviewPage = lazy(() => import('@/pages/dashboard/OverviewPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));

// Phase 3 pages
const TrolleyListPage = lazy(() => import('@/pages/trolleys/TrolleyListPage'));
const TrolleyDetailPage = lazy(() => import('@/pages/trolleys/TrolleyDetailPage'));
const ShopListPage = lazy(() => import('@/pages/shops/ShopListPage'));
const ShopDetailPage = lazy(() => import('@/pages/shops/ShopDetailPage'));
const TerminalMapPage = lazy(() => import('@/pages/map/TerminalMapPage'));
const OffersPage = lazy(() => import('@/pages/offers/OffersPage'));

// Phase 4 pages
const HeatmapPage = lazy(() => import('@/pages/heatmap/HeatmapPage'));
const VisitorStatsPage = lazy(() => import('@/pages/visitors/VisitorStatsPage'));
const AlertsPage = lazy(() => import('@/pages/alerts/AlertsPage'));
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'));
const ComplaintsPage = lazy(() => import('@/pages/complaints/ComplaintsPage'));

// Phase 5 pages
const PermissionsPage = lazy(() => import('@/pages/permissions/PermissionsPage'));
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
const MerchantAnalyticsPage = lazy(() => import('@/pages/merchant/MerchantAnalyticsPage'));
const SLASettingsPage = lazy(() => import('@/pages/merchant/SLASettingsPage'));

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
                <TrolleyListPage />
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
                <ShopListPage />
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
                <AlertsPage />
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
            element: (
              <SuspenseWrapper>
                <ComplaintsPage />
              </SuspenseWrapper>
            ),
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
        ],
      },
      // Phase 7 — Merchant routes
      {
        path: '/merchant/login',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <MerchantLoginPage />
          </Suspense>
        ),
      },
      {
        path: '/merchant',
        element: <MerchantLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/merchant/orders" replace />,
          },
          {
            path: 'orders',
            element: (
              <SuspenseWrapper>
                <OrdersInboxPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'menu',
            element: (
              <SuspenseWrapper>
                <MenuManagementPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'coupons',
            element: (
              <SuspenseWrapper>
                <CouponsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'analytics',
            element: (
              <SuspenseWrapper>
                <MerchantAnalyticsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'settings',
            element: (
              <SuspenseWrapper>
                <SLASettingsPage />
              </SuspenseWrapper>
            ),
          },
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
