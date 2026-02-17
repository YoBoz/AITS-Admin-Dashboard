import { useEffect, useState } from 'react';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { SettingRow } from '@/components/settings/SettingRow';
import { Switch } from '@/components/ui/Switch';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useSettingsStore } from '@/store/settings.store';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Plus,
  X,
  Monitor,
  Smartphone,
  AlertTriangle,
} from 'lucide-react';

interface Props {
  onDirty: (dirty: boolean) => void;
  onSave: () => void;
}

const mockSessions = [
  { id: '1', device: 'Chrome on Windows', ip: '192.168.1.100', location: 'Dubai, AE', lastActive: '2 min ago', current: true },
  { id: '2', device: 'Safari on iPhone', ip: '10.0.0.42', location: 'Dubai, AE', lastActive: '3 hours ago', current: false },
  { id: '3', device: 'Firefox on macOS', ip: '172.16.0.5', location: 'Abu Dhabi, AE', lastActive: '2 days ago', current: false },
];

const passwordPolicies = [
  'Minimum 8 characters',
  'Must include uppercase + lowercase + number + special char',
  'Cannot reuse last 5 passwords',
  'Expires every 90 days',
];

export default function SecuritySettingsTab({ onDirty }: Props) {
  const store = useSettingsStore();
  const [local, setLocal] = useState({
    twoFactorEnabled: store.twoFactorEnabled,
    sessionTimeout: store.sessionTimeout,
    rememberMeDuration: store.rememberMeDuration,
    allowedIps: [...store.allowedIps],
  });
  const [newIp, setNewIp] = useState('');
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [verifyCode, setVerifyCode] = useState('');

  useEffect(() => {
    const isDirty =
      local.twoFactorEnabled !== store.twoFactorEnabled ||
      local.sessionTimeout !== store.sessionTimeout ||
      local.rememberMeDuration !== store.rememberMeDuration ||
      JSON.stringify(local.allowedIps) !== JSON.stringify(store.allowedIps);
    onDirty(isDirty);
  }, [local, store, onDirty]);

  const handle2FAToggle = () => {
    if (!local.twoFactorEnabled) {
      setShow2FASetup(true);
    } else {
      setLocal((s) => ({ ...s, twoFactorEnabled: false }));
      store.updateSetting('twoFactorEnabled', false);
      setShow2FASetup(false);
      toast.success('Two-factor authentication disabled');
    }
  };

  const verify2FA = () => {
    if (verifyCode.length === 6) {
      setLocal((s) => ({ ...s, twoFactorEnabled: true }));
      store.updateSetting('twoFactorEnabled', true);
      setShow2FASetup(false);
      setVerifyCode('');
      toast.success('Two-factor authentication enabled');
    }
  };

  const addIp = () => {
    if (!newIp.trim()) return;
    const updated = [...local.allowedIps, newIp.trim()];
    setLocal((s) => ({ ...s, allowedIps: updated }));
    store.addAllowedIp(newIp.trim());
    setNewIp('');
  };

  const removeIp = (ip: string) => {
    const updated = local.allowedIps.filter((i) => i !== ip);
    setLocal((s) => ({ ...s, allowedIps: updated }));
    store.removeAllowedIp(ip);
  };

  return (
    <div className="space-y-6">
      {/* 2FA */}
      <SettingsSection
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account."
      >
        <SettingRow label={local.twoFactorEnabled ? '2FA is enabled' : 'Enable 2FA'}>
          <Switch checked={local.twoFactorEnabled} onCheckedChange={handle2FAToggle} />
        </SettingRow>

        {show2FASetup && !local.twoFactorEnabled && (
          <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4 space-y-4">
            <p className="text-sm font-lexend font-medium">Set up Authenticator App</p>
            <div className="flex items-center justify-center">
              <div className="h-32 w-32 rounded-lg bg-muted border border-border flex items-center justify-center">
                <ShieldCheck className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Scan this QR code with your authenticator app (mock placeholder)
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit code"
                className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-mono text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/30"
                maxLength={6}
              />
              <Button size="sm" onClick={verify2FA} disabled={verifyCode.length !== 6}>
                Verify
              </Button>
            </div>
          </div>
        )}
      </SettingsSection>

      {/* Session Management */}
      <SettingsSection
        title="Session Management"
        description="Control how long admin sessions remain active."
      >
        <SettingRow label="Session Timeout">
          <select
            value={local.sessionTimeout}
            onChange={(e) => {
              setLocal((s) => ({ ...s, sessionTimeout: e.target.value }));
              store.updateSetting('sessionTimeout', e.target.value);
            }}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-lexend"
          >
            <option value="15m">15 minutes</option>
            <option value="30m">30 minutes</option>
            <option value="1h">1 hour</option>
            <option value="4h">4 hours</option>
            <option value="never">Never</option>
          </select>
        </SettingRow>
        <SettingRow label="Remember Me Duration">
          <select
            value={local.rememberMeDuration}
            onChange={(e) => {
              setLocal((s) => ({ ...s, rememberMeDuration: e.target.value }));
              store.updateSetting('rememberMeDuration', e.target.value);
            }}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm font-lexend"
          >
            <option value="1d">1 day</option>
            <option value="7d">7 days</option>
            <option value="30d">30 days</option>
          </select>
        </SettingRow>
      </SettingsSection>

      {/* Password Policy */}
      <SettingsSection
        title="Password Policy"
        description="View the current password requirements."
      >
        <ul className="space-y-2">
          {passwordPolicies.map((policy) => (
            <li key={policy} className="flex items-center gap-2 text-sm font-lexend text-muted-foreground">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              {policy}
            </li>
          ))}
        </ul>
      </SettingsSection>

      {/* Allowed IPs */}
      <SettingsSection
        title="Allowed IP Addresses"
        description="Restrict admin access to specific IP ranges (optional)."
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 p-2 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs text-amber-700 dark:text-amber-400 font-lexend">
              Ensure your current IP is included before saving.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              placeholder="IP or CIDR (e.g. 192.168.1.0/24)"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm font-lexend focus:outline-none focus:ring-2 focus:ring-primary/30"
              onKeyDown={(e) => e.key === 'Enter' && addIp()}
            />
            <Button size="sm" variant="outline" onClick={addIp}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          {local.allowedIps.length > 0 && (
            <div className="space-y-1">
              {local.allowedIps.map((ip) => (
                <div key={ip} className="flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
                  <span className="text-sm font-mono">{ip}</span>
                  <button onClick={() => removeIp(ip)} className="text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </SettingsSection>

      {/* Active Sessions */}
      <SettingsSection
        title="Active Sessions"
        description="Devices currently signed into your account."
      >
        <div className="space-y-3">
          {mockSessions.map((session) => (
            <div
              key={session.id}
              className={`flex items-center justify-between rounded-lg border p-3 ${
                session.current ? 'border-primary/30 bg-primary/5' : 'border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                {session.device.includes('iPhone') || session.device.includes('Android') ? (
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-lexend font-medium">{session.device}</p>
                    {session.current && <Badge variant="success" className="text-[10px]">Current</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {session.ip} · {session.location} · {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => toast.success(`Session on ${session.device} revoked`)}
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="text-destructive border-destructive/30 hover:bg-destructive/10"
            onClick={() => toast.success('All other sessions revoked')}
          >
            Revoke All Other Sessions
          </Button>
        </div>
      </SettingsSection>
    </div>
  );
}
