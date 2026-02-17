import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const routeLabels: Record<string, string> = {
  dashboard: 'nav.dashboard',
  overview: 'nav.overview',
  map: 'nav.terminalMap',
  heatmap: 'nav.heatmap',
  trolleys: 'nav.trolleyManagement',
  shops: 'nav.shopManagement',
  visitors: 'nav.visitorStats',
  offers: 'nav.offersContracts',
  notifications: 'nav.notifications',
  alerts: 'nav.alerts',
  complaints: 'nav.complaints',
  permissions: 'nav.permissions',
  settings: 'nav.settings',
  profile: 'nav.profile',
};

export function Breadcrumb() {
  const { t } = useTranslation();
  const location = useLocation();

  const segments = location.pathname.split('/').filter(Boolean);

  // Skip the 'dashboard' segment — it's the root wrapper, not a real page
  const pageSegments = segments.filter((seg) => seg !== 'dashboard');

  // Build crumb list from remaining segments
  const crumbs = pageSegments.map((seg, idx) => ({
    label: t(routeLabels[seg] || seg),
    path: '/dashboard/' + pageSegments.slice(0, idx + 1).join('/'),
    isLast: idx === pageSegments.length - 1,
  }));

  return (
    <nav className="flex items-center gap-1.5 text-sm font-lexend">
      <Link to="/dashboard/overview" className="text-muted-foreground hover:text-foreground transition-colors">
        <Home className="h-3.5 w-3.5" />
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.path} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
          {crumb.isLast ? (
            <span className="font-medium text-foreground">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.path}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
