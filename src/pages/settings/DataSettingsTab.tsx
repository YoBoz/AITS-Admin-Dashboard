import { useEffect, useState } from 'react';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { SettingRow } from '@/components/settings/SettingRow';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { useSettingsStore } from '@/store/settings.store';
import { toast } from 'sonner';
import { Download, Database, Clock } from 'lucide-react';

interface Props {
  onDirty: (dirty: boolean) => void;
  onSave: () => void;
}

export default function DataSettingsTab({ onDirty }: Props) {
  const store = useSettingsStore();
  const [local, setLocal] = useState({
    trolleyTrackingRetention: store.trolleyTrackingRetention,
    visitorStatsRetention: store.visitorStatsRetention,
    alertLogsRetention: store.alertLogsRetention,
    auditLogsRetention: store.auditLogsRetention,
    scheduledReport: store.scheduledReport,
    scheduledReportDay: store.scheduledReportDay,
    scheduledReportTime: store.scheduledReportTime,
    exportFormat: store.exportFormat,
    anonymizeDays: store.anonymizeDays,
    maskPiiInExports: store.maskPiiInExports,
  });

  useEffect(() => {
    const isDirty = Object.keys(local).some(
      (k) => local[k as keyof typeof local] !== store[k as keyof typeof local],
    );
    onDirty(isDirty);
  }, [local, store, onDirty]);

  const update = <K extends keyof typeof local>(key: K, value: (typeof local)[K]) => {
    setLocal((s) => ({ ...s, [key]: value }));
    store.updateSetting(key, value as never);
  };

  const selectCls = 'rounded-md border border-border bg-background px-3 py-1.5 text-sm font-lexend focus:outline-none focus:ring-2 focus:ring-primary/30';

  return (
    <div className="space-y-6">
      {/* Data Retention */}
      <SettingsSection title="Data Retention">
        <SettingRow label="Trolley Tracking History">
          <select
            value={local.trolleyTrackingRetention}
            onChange={(e) => update('trolleyTrackingRetention', e.target.value)}
            className={selectCls}
          >
            <option value="30d">30 days</option>
            <option value="90d">90 days</option>
            <option value="180d">180 days</option>
            <option value="1y">1 year</option>
          </select>
        </SettingRow>
        <SettingRow label="Visitor Statistics">
          <select
            value={local.visitorStatsRetention}
            onChange={(e) => update('visitorStatsRetention', e.target.value)}
            className={selectCls}
          >
            <option value="6m">6 months</option>
            <option value="1y">1 year</option>
            <option value="2y">2 years</option>
          </select>
        </SettingRow>
        <SettingRow label="Alert Logs">
          <select
            value={local.alertLogsRetention}
            onChange={(e) => update('alertLogsRetention', e.target.value)}
            className={selectCls}
          >
            <option value="90d">90 days</option>
            <option value="180d">180 days</option>
            <option value="1y">1 year</option>
          </select>
        </SettingRow>
        <SettingRow label="Audit Logs">
          <select
            value={local.auditLogsRetention}
            onChange={(e) => update('auditLogsRetention', e.target.value)}
            className={selectCls}
          >
            <option value="1y">1 year</option>
            <option value="2y">2 years</option>
            <option value="forever">Forever</option>
          </select>
        </SettingRow>
      </SettingsSection>

      {/* Export & Reports */}
      <SettingsSection title="Export & Reports">
        <SettingRow label="Scheduled Report" description="Weekly PDF summary emailed to admins">
          <div className="flex items-center gap-3">
            <Switch
              checked={local.scheduledReport}
              onCheckedChange={(checked) => update('scheduledReport', checked)}
            />
          </div>
        </SettingRow>
        {local.scheduledReport && (
          <div className="flex items-center gap-3 py-3 pl-4">
            <select
              value={local.scheduledReportDay}
              onChange={(e) => update('scheduledReportDay', e.target.value)}
              className={selectCls}
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <input
              type="time"
              value={local.scheduledReportTime}
              onChange={(e) => update('scheduledReportTime', e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-lexend"
            />
          </div>
        )}
        <SettingRow label="Export Format Default">
          <div className="flex gap-3">
            {(['csv', 'excel', 'pdf'] as const).map((fmt) => (
              <label key={fmt} className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="exportFormat"
                  value={fmt}
                  checked={local.exportFormat === fmt}
                  onChange={() => update('exportFormat', fmt)}
                  className="h-4 w-4 accent-primary"
                />
                <span className="text-sm font-lexend uppercase">{fmt}</span>
              </label>
            ))}
          </div>
        </SettingRow>
      </SettingsSection>

      {/* Data Anonymization */}
      <SettingsSection title="Data Anonymization">
        <SettingRow label="Anonymize visitor data after">
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={local.anonymizeDays}
              onChange={(e) => update('anonymizeDays', Number(e.target.value))}
              className="w-20 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-lexend text-center"
              min={1}
            />
            <span className="text-xs text-muted-foreground">days</span>
          </div>
        </SettingRow>
        <SettingRow label="Mask complaint submitter PII in exports">
          <Switch
            checked={local.maskPiiInExports}
            onCheckedChange={(checked) => update('maskPiiInExports', checked)}
          />
        </SettingRow>
      </SettingsSection>

      {/* Privacy & Consent (Phase 9) */}
      <SettingsSection title="Privacy & Consent">
        <SettingRow label="Consent Form Version" description="Current version shown to visitors">
          <span className="text-sm font-mono font-medium bg-muted/50 px-2 py-0.5 rounded">v2.1</span>
        </SettingRow>
        <SettingRow label="Consent Categories">
          <div className="flex flex-wrap gap-1.5">
            {['analytics', 'marketing', 'personalisation', 'functional'].map((cat) => (
              <span key={cat} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                {cat}
              </span>
            ))}
          </div>
        </SettingRow>
        <SettingRow label="Consent Expiry" description="Days before consent must be re-confirmed">
          <div className="flex items-center gap-1">
            <input
              type="number"
              defaultValue={365}
              className="w-20 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-lexend text-center"
              min={30}
            />
            <span className="text-xs text-muted-foreground">days</span>
          </div>
        </SettingRow>
        <SettingRow label="PII Retention Period" description="How long personally identifiable data is kept">
          <select defaultValue="2y" className={selectCls}>
            <option value="1y">1 year</option>
            <option value="2y">2 years</option>
            <option value="5y">5 years</option>
          </select>
        </SettingRow>
        <SettingRow label="DSAR SLA" description="Maximum days to fulfill a data subject access request">
          <div className="flex items-center gap-1">
            <input
              type="number"
              defaultValue={30}
              className="w-20 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-lexend text-center"
              min={1}
            />
            <span className="text-xs text-muted-foreground">days</span>
          </div>
        </SettingRow>
      </SettingsSection>

      {/* System Maintenance */}
      <SettingsSection title="System Maintenance">
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-3">
              <Database className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Database Size</p>
                <p className="text-sm font-mono font-medium">2.4 GB</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Last Backup</p>
                <p className="text-sm font-mono font-medium">Jan 15, 2025 03:00</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-muted/30 p-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Next Maintenance</p>
                <p className="text-sm font-mono font-medium">Feb 1, 2025 02:00</p>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={() => toast.success('Export requested. You will be notified when ready.')}
          >
            <Download className="h-4 w-4 mr-2" />
            Request Data Export (Full Backup)
          </Button>
        </div>
      </SettingsSection>
    </div>
  );
}
