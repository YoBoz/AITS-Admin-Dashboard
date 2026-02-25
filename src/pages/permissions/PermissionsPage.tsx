import { useState, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/common/PageHeader';
import { cn } from '@/lib/utils';
import { Users, Shield, Grid3X3 } from 'lucide-react';

const UsersTab = lazy(() => import('./UsersTab'));
const RolesTab = lazy(() => import('./RolesTab'));
const PermissionMatrixTab = lazy(() => import('./PermissionMatrixTab'));

const tabs = [
  { key: 'users', label: 'Users', icon: Users },
  { key: 'roles', label: 'Roles', icon: Shield },
  { key: 'matrix', label: 'Permission Matrix', icon: Grid3X3 },
];

interface PermissionsPageProps {
  embedded?: boolean;
}

export default function PermissionsPage({ embedded }: PermissionsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(
    tabParam && tabs.some((t) => t.key === tabParam) ? tabParam : 'users'
  );

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (!embedded) {
      setSearchParams((prev) => {
        prev.set('tab', tab);
        prev.delete('page');
        prev.delete('pageSize');
        return prev;
      }, { replace: true });
    }
  };

  return (
    <div className="space-y-6">
      {!embedded && (
        <PageHeader
          title="Access Control & Permissions"
          subtitle="Manage users, roles, and granular permissions"
        />
      )}

      {/* Tab Bar */}
      <div className="flex items-center gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-lexend transition-colors relative',
              activeTab === tab.key
                ? 'text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Suspense fallback={<div className="py-12 text-center text-sm text-muted-foreground">Loading...</div>}>
        {activeTab === 'users' && <UsersTab />}
        {activeTab === 'roles' && <RolesTab />}
        {activeTab === 'matrix' && <PermissionMatrixTab />}
      </Suspense>
    </div>
  );
}
