import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Phone,
  Building2,
  IdCard,
  Calendar,
  Globe,
  Shield,
  Key,
  Clock,
  LogOut,
  Monitor,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Laptop,
} from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Separator } from '@/components/ui/Separator';
import { StatusDot } from '@/components/common/StatusDot';
import { cn, formatDate, getRoleColor } from '@/lib/utils';
import type { Role } from '@/types/auth.types';
import {
  currentUserExtended,
  activityLog,
  activeSessions,
  type ActivityLogEntry,
} from '@/data/mock/profile.mock';

// ─── Tab definitions ─────────────────
const tabs = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'preferences', label: 'Preferences', icon: Globe },
  { id: 'activity', label: 'Activity Log', icon: Clock },
  { id: 'security', label: 'Security', icon: Shield },
] as const;

type TabId = (typeof tabs)[number]['id'];

// ─── Helpers ─────────────────────────
function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

const statusIcons: Record<ActivityLogEntry['status'], typeof CheckCircle> = {
  success: CheckCircle,
  failed: XCircle,
  warning: AlertTriangle,
};

const statusColors: Record<ActivityLogEntry['status'], string> = {
  success: 'text-status-success',
  failed: 'text-status-error',
  warning: 'text-status-warning',
};

// ─── Profile Card (Left) ─────────────
function ProfileCard() {
  const user = currentUserExtended;
  const roleBadge = getRoleColor(user.role as Role);

  return (
    <Card className="overflow-hidden">
      {/* Banner */}
      <div className="h-24 bg-gradient-to-r from-brand via-brand-hover to-brand/70" />
      <CardContent className="relative -mt-12 pb-6">
        {/* Avatar */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-background bg-brand text-white text-2xl font-bold font-montserrat shadow-md">
          {getInitials(user.name)}
        </div>
        <div className="mt-3">
          <h2 className="text-xl font-bold font-montserrat">{user.name}</h2>
          <p className="text-sm text-muted-foreground font-lexend">{user.email}</p>
          <Badge className={cn('mt-2 capitalize', roleBadge)}>
            {user.role.replace('_', ' ')}
          </Badge>
        </div>

        <Separator className="my-4" />

        <dl className="space-y-3 text-sm">
          <InfoRow icon={Building2} label="Department" value={user.department} />
          <InfoRow icon={IdCard} label="Employee ID" value={user.employeeId} />
          <InfoRow icon={Monitor} label="Terminal" value={user.terminal} />
          <InfoRow icon={Phone} label="Phone" value={user.phone} />
          <InfoRow icon={Calendar} label="Member Since" value={formatDate(user.memberSince)} />
          <InfoRow icon={Clock} label="Last Login" value={formatDate(user.lastLogin)} />
        </dl>
      </CardContent>
    </Card>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <dt className="text-muted-foreground w-28 shrink-0">{label}</dt>
      <dd className="font-medium font-roboto">{value}</dd>
    </div>
  );
}

// ─── Tabs Content ────────────────────
function PersonalInfoTab() {
  const user = currentUserExtended;
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground font-lexend">
        Update your personal information. Changes will be saved automatically.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Full Name</Label>
          <Input defaultValue={user.name} />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input defaultValue={user.email} type="email" disabled />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input defaultValue={user.phone} />
        </div>
        <div className="space-y-2">
          <Label>Department</Label>
          <Input defaultValue={user.department} />
        </div>
        <div className="space-y-2">
          <Label>Employee ID</Label>
          <Input defaultValue={user.employeeId} disabled />
        </div>
        <div className="space-y-2">
          <Label>Terminal</Label>
          <Input defaultValue={user.terminal} disabled />
        </div>
      </div>
      <Button className="bg-brand hover:bg-brand-hover text-white">Save Changes</Button>
    </div>
  );
}

function PreferencesTab() {
  const user = currentUserExtended;
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground font-lexend">
        Customize your dashboard experience.
      </p>
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="font-medium font-lexend">Language</p>
            <p className="text-sm text-muted-foreground">Current: {user.language.toUpperCase()}</p>
          </div>
          <Badge variant="outline">{user.language.toUpperCase()}</Badge>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="font-medium font-lexend">Email Notifications</p>
            <p className="text-sm text-muted-foreground">Receive alerts via email</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="font-medium font-lexend">Push Notifications</p>
            <p className="text-sm text-muted-foreground">Browser push notifications</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div>
            <p className="font-medium font-lexend">Sound Alerts</p>
            <p className="text-sm text-muted-foreground">Play sound on critical alerts</p>
          </div>
          <Switch />
        </div>
      </div>
    </div>
  );
}

function ActivityLogTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground font-lexend">
        Your recent account activity for the last 7 days.
      </p>
      <div className="rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="px-4 py-3 text-left font-medium font-poppins text-muted-foreground">Action</th>
              <th className="px-4 py-3 text-left font-medium font-poppins text-muted-foreground hidden sm:table-cell">Device</th>
              <th className="px-4 py-3 text-left font-medium font-poppins text-muted-foreground hidden md:table-cell">IP Address</th>
              <th className="px-4 py-3 text-left font-medium font-poppins text-muted-foreground">Time</th>
              <th className="px-4 py-3 text-center font-medium font-poppins text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {activityLog.map((entry) => {
              const StatusIcon = statusIcons[entry.status];
              return (
                <tr key={entry.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-roboto">{entry.action}</td>
                  <td className="px-4 py-3 text-muted-foreground font-roboto hidden sm:table-cell">{entry.device}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs hidden md:table-cell">{entry.ipAddress}</td>
                  <td className="px-4 py-3 text-muted-foreground font-roboto text-xs">{formatDate(entry.timestamp)}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusIcon className={cn('h-4 w-4 mx-auto', statusColors[entry.status])} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SecurityTab() {
  const user = currentUserExtended;
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground font-lexend">
        Manage your security settings and active sessions.
      </p>

      {/* Password */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-poppins flex items-center gap-2">
            <Key className="h-4 w-4" />
            Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Last changed: <span className="font-medium">{formatDate(user.passwordLastChanged)}</span>
          </p>
          <Button variant="outline" size="sm">
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* 2FA */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-poppins flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm">
                Status:{' '}
                <Badge variant={user.twoFactorEnabled ? 'default' : 'secondary'}>
                  {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Add an extra layer of security to your account.
              </p>
            </div>
            <Switch checked={user.twoFactorEnabled} />
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-poppins flex items-center gap-2">
            <Laptop className="h-4 w-4" />
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activeSessions.map((sess) => (
            <div
              key={sess.id}
              className={cn(
                'flex items-center justify-between rounded-lg border p-3',
                sess.current && 'border-brand/30 bg-brand/5'
              )}
            >
              <div className="flex items-center gap-3">
                <StatusDot status={sess.current ? 'online' : 'offline'} />
                <div>
                  <p className="text-sm font-medium font-lexend">
                    {sess.device} · {sess.browser}
                    {sess.current && (
                      <Badge variant="outline" className="ml-2 text-[10px]">
                        Current
                      </Badge>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground font-roboto">
                    {sess.ip} · {sess.location} · {formatDate(sess.lastActive)}
                  </p>
                </div>
              </div>
              {!sess.current && (
                <Button variant="ghost" size="sm" className="text-status-error hover:text-status-error">
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Page ───────────────────────
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>('personal');

  const tabContent: Record<TabId, JSX.Element> = {
    personal: <PersonalInfoTab />,
    preferences: <PreferencesTab />,
    activity: <ActivityLogTab />,
    security: <SecurityTab />,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" subtitle="Manage your account and preferences" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Profile Card */}
        <div className="lg:col-span-1">
          <ProfileCard />
        </div>

        {/* Right — Tabs */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              {/* Tab bar */}
              <div className="flex border-b overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'flex items-center gap-2 px-5 py-3.5 text-sm font-medium font-lexend whitespace-nowrap transition-colors border-b-2 -mb-px',
                        isActive
                          ? 'border-brand text-brand'
                          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="p-6"
              >
                {tabContent[activeTab]}
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
