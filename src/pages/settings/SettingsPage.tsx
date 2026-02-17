import { useState, useCallback } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { cn } from '@/lib/utils';
import {
  Globe,
  Palette,
  Bell,
  ShieldCheck,
  Database,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';

import GeneralSettingsTab from './GeneralSettingsTab';
import AppearanceSettingsTab from './AppearanceSettingsTab';
import NotificationSettingsTab from './NotificationSettingsTab';
import SecuritySettingsTab from './SecuritySettingsTab';
import DataSettingsTab from './DataSettingsTab';

const tabs = [
  { key: 'general', label: 'General', icon: Globe },
  { key: 'appearance', label: 'Appearance', icon: Palette },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: ShieldCheck },
  { key: 'data', label: 'Data & Reports', icon: Database },
] as const;

type TabKey = (typeof tabs)[number]['key'];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('general');
  const [dirtyTabs, setDirtyTabs] = useState<Set<TabKey>>(new Set());
  const [pendingTab, setPendingTab] = useState<TabKey | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const markDirty = useCallback((tab: TabKey, dirty: boolean) => {
    setDirtyTabs((prev) => {
      const next = new Set(prev);
      if (dirty) next.add(tab);
      else next.delete(tab);
      return next;
    });
  }, []);

  const handleTabClick = (tab: TabKey) => {
    if (tab === activeTab) return;
    if (dirtyTabs.has(activeTab)) {
      setPendingTab(tab);
      setConfirmOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const handleConfirmNavigate = () => {
    if (pendingTab) {
      setDirtyTabs((prev) => {
        const next = new Set(prev);
        next.delete(activeTab);
        return next;
      });
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
    setConfirmOpen(false);
  };

  const handleSave = (tab: TabKey) => {
    setDirtyTabs((prev) => {
      const next = new Set(prev);
      next.delete(tab);
      return next;
    });
    toast.success('Settings saved successfully');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Configure your dashboard preferences and system settings"
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Vertical Nav - Desktop / Horizontal Tabs - Mobile */}
        <nav className="lg:w-56 flex-shrink-0">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-lexend transition-colors whitespace-nowrap',
                  activeTab === tab.key
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                )}
              >
                <tab.icon className="h-4 w-4 flex-shrink-0" />
                {tab.label}
                {dirtyTabs.has(tab.key) && (
                  <Badge variant="warning" className="ml-auto text-[10px] px-1.5 py-0">
                    Unsaved
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {activeTab === 'general' && (
            <GeneralSettingsTab onDirty={(d) => markDirty('general', d)} onSave={() => handleSave('general')} />
          )}
          {activeTab === 'appearance' && (
            <AppearanceSettingsTab onDirty={(d) => markDirty('appearance', d)} onSave={() => handleSave('appearance')} />
          )}
          {activeTab === 'notifications' && (
            <NotificationSettingsTab onDirty={(d) => markDirty('notifications', d)} onSave={() => handleSave('notifications')} />
          )}
          {activeTab === 'security' && (
            <SecuritySettingsTab onDirty={(d) => markDirty('security', d)} onSave={() => handleSave('security')} />
          )}
          {activeTab === 'data' && (
            <DataSettingsTab onDirty={(d) => markDirty('data', d)} onSave={() => handleSave('data')} />
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={() => handleSave(activeTab)}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      {/* Unsaved Changes Confirm */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Unsaved Changes"
        description="You have unsaved changes in this tab. Discard and navigate away?"
        confirmLabel="Discard"
        confirmVariant="warning"
        onConfirm={handleConfirmNavigate}
      />
    </div>
  );
}
