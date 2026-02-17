import { useEffect, useState } from 'react';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { SettingRow } from '@/components/settings/SettingRow';
import { Switch } from '@/components/ui/Switch';
import { useSettingsStore } from '@/store/settings.store';

interface Props {
  onDirty: (dirty: boolean) => void;
  onSave: () => void;
}

export default function NotificationSettingsTab({ onDirty }: Props) {
  const store = useSettingsStore();
  const [local, setLocal] = useState({
    criticalAlerts: store.criticalAlerts,
    warningAlerts: store.warningAlerts,
    infoAlerts: store.infoAlerts,
    newComplaints: store.newComplaints,
    complaintSeverityFilter: store.complaintSeverityFilter,
    contractExpiry: store.contractExpiry,
    contractExpiryDays: store.contractExpiryDays,
    newShopRegistration: store.newShopRegistration,
    visitorMilestones: store.visitorMilestones,
    inAppNotifications: store.inAppNotifications,
    emailDigest: store.emailDigest,
    emailDigestFrequency: store.emailDigestFrequency,
    soundAlerts: store.soundAlerts,
    quietHoursEnabled: store.quietHoursEnabled,
    quietHoursFrom: store.quietHoursFrom,
    quietHoursTo: store.quietHoursTo,
  });

  useEffect(() => {
    const isDirty = Object.keys(local).some(
      (k) => local[k as keyof typeof local] !== store[k as keyof typeof local],
    );
    onDirty(isDirty);
  }, [local, store, onDirty]);

  const toggle = (key: keyof typeof local) => {
    const val = !local[key];
    setLocal((s) => ({ ...s, [key]: val }));
    store.updateSetting(key, val as never);
  };

  const update = <K extends keyof typeof local>(key: K, value: (typeof local)[K]) => {
    setLocal((s) => ({ ...s, [key]: value }));
    store.updateSetting(key, value as never);
  };

  return (
    <div className="space-y-6">
      {/* Alert Notifications */}
      <SettingsSection title="Alert Notifications">
        <SettingRow
          label="Critical Alerts"
          description="Battery <10%, hardware fault, system down"
        >
          <Switch checked={local.criticalAlerts} onCheckedChange={() => {}} disabled />
        </SettingRow>
        <SettingRow
          label="Warning Alerts"
          description="Battery <25%, maintenance overdue"
        >
          <Switch checked={local.warningAlerts} onCheckedChange={() => toggle('warningAlerts')} />
        </SettingRow>
        <SettingRow label="Info Alerts" description="Routine notifications">
          <Switch checked={local.infoAlerts} onCheckedChange={() => toggle('infoAlerts')} />
        </SettingRow>
      </SettingsSection>

      {/* Operational Notifications */}
      <SettingsSection title="Operational Notifications">
        <SettingRow label="New Complaints">
          <div className="flex items-center gap-3">
            {local.newComplaints && (
              <select
                value={local.complaintSeverityFilter}
                onChange={(e) => update('complaintSeverityFilter', e.target.value as 'high' | 'all')}
                className="rounded-md border border-border bg-background px-2 py-1 text-xs font-lexend"
              >
                <option value="all">All</option>
                <option value="high">High only</option>
              </select>
            )}
            <Switch checked={local.newComplaints} onCheckedChange={() => toggle('newComplaints')} />
          </div>
        </SettingRow>
        <SettingRow label="Contract Expiry" description="Days before expiry">
          <div className="flex items-center gap-3">
            {local.contractExpiry && (
              <input
                type="number"
                value={local.contractExpiryDays}
                onChange={(e) => update('contractExpiryDays', Number(e.target.value))}
                className="w-16 rounded-md border border-border bg-background px-2 py-1 text-xs font-lexend text-center"
                min={1}
                max={365}
              />
            )}
            <Switch checked={local.contractExpiry} onCheckedChange={() => toggle('contractExpiry')} />
          </div>
        </SettingRow>
        <SettingRow label="New Shop Registration">
          <Switch checked={local.newShopRegistration} onCheckedChange={() => toggle('newShopRegistration')} />
        </SettingRow>
        <SettingRow label="Visitor Milestones" description="e.g. 10,000th visitor today">
          <Switch checked={local.visitorMilestones} onCheckedChange={() => toggle('visitorMilestones')} />
        </SettingRow>
      </SettingsSection>

      {/* Delivery Methods */}
      <SettingsSection title="Delivery Methods">
        <SettingRow label="In-App Notifications">
          <Switch checked={local.inAppNotifications} onCheckedChange={() => {}} disabled />
        </SettingRow>
        <SettingRow label="Email Digest" description="Frequency">
          <div className="flex items-center gap-3">
            {local.emailDigest && (
              <select
                value={local.emailDigestFrequency}
                onChange={(e) => update('emailDigestFrequency', e.target.value as 'immediate' | 'hourly' | 'daily')}
                className="rounded-md border border-border bg-background px-2 py-1 text-xs font-lexend"
              >
                <option value="immediate">Immediate</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
              </select>
            )}
            <Switch checked={local.emailDigest} onCheckedChange={() => toggle('emailDigest')} />
          </div>
        </SettingRow>
        <SettingRow label="Sound Alerts" description="Play sound for critical alerts">
          <Switch checked={local.soundAlerts} onCheckedChange={() => toggle('soundAlerts')} />
        </SettingRow>
      </SettingsSection>

      {/* Quiet Hours */}
      <SettingsSection
        title="Quiet Hours"
        description="Suppress non-critical notifications during specified hours"
      >
        <SettingRow label="Enable Quiet Hours">
          <Switch checked={local.quietHoursEnabled} onCheckedChange={() => toggle('quietHoursEnabled')} />
        </SettingRow>
        {local.quietHoursEnabled && (
          <div className="flex items-center gap-3 py-3">
            <label className="text-xs text-muted-foreground font-lexend">From</label>
            <input
              type="time"
              value={local.quietHoursFrom}
              onChange={(e) => update('quietHoursFrom', e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-lexend"
            />
            <label className="text-xs text-muted-foreground font-lexend">To</label>
            <input
              type="time"
              value={local.quietHoursTo}
              onChange={(e) => update('quietHoursTo', e.target.value)}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs font-lexend"
            />
          </div>
        )}
      </SettingsSection>
    </div>
  );
}
