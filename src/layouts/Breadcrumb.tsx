import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/** Map each URL segment to the i18n key matching the sidebar label */
const routeLabels: Record<string, string> = {
  // Sidebar nav items (must match Sidebar.tsx labels exactly)
  overview: 'nav.dashboard',
  map: 'nav.liveMap',
  fleet: 'nav.fleetMonitoring',
  runners: 'nav.runners',
  orders: 'nav.orders',
  incidents: 'nav.incidents',
  gates: 'nav.gateManagement',
  policies: 'nav.policyControls',
  shops: 'nav.merchantManagement',
  sla: 'nav.slaAnalytics',
  reports: 'nav.reports',
  permissions: 'nav.rbac',
  'audit-logs': 'nav.auditLogs',
  // Supplemental pages
  profile: 'nav.profile',
  heatmap: 'nav.heatmap',
  trolleys: 'nav.fleetMonitoring',
};

/** Convert a URL segment like "audit-logs" → "Audit logs" (sentence case) */
function toSentenceCase(seg: string): string {
  const words = seg.replace(/-/g, ' ').replace(/_/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

export function Breadcrumb() {
  const { t } = useTranslation();
  const location = useLocation();

  const segments = location.pathname.split('/').filter(Boolean);

  // Skip the 'dashboard' segment — it's the root wrapper, not a real page
  const pageSegments = segments.filter((seg) => seg !== 'dashboard');

  // Build crumb list from remaining segments
  const crumbs = pageSegments.map((seg, idx) => ({
    label: routeLabels[seg] ? t(routeLabels[seg]) : toSentenceCase(seg),
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
