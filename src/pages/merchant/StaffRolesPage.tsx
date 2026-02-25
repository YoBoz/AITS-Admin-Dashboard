import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, X, Check, UserMinus, RotateCcw, Shield,
  ClipboardList, ChevronDown, Search, Calendar,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { RequirePermission } from '@/components/merchant/RequirePermission';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { useMerchantAuth } from '@/hooks/useMerchantAuth';
import { useMerchantAuditStore } from '@/store/merchant-audit.store';
import type { MerchantRole, MerchantAuditEventType } from '@/types/merchant.types';
import { ROLE_PERMISSIONS } from '@/types/merchant.types';

// --- Types ------------------------------------------------------------------
interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: MerchantRole;
  status: 'active' | 'inactive' | 'invited';
  last_login: string | null;
  created_at: string;
}

type StaffManageableRole = 'manager' | 'kitchen' | 'cashier' | 'viewer';
const STAFF_ROLES: StaffManageableRole[] = ['manager', 'kitchen', 'cashier', 'viewer'];

const initialStaff: StaffMember[] = [
  { id: 'staff-1', name: 'Ahmed Al-Rashid', email: 'manager@demo.ai-ts', role: 'manager', status: 'active', last_login: '2026-02-24T10:30:00Z', created_at: '2025-09-01T09:00:00Z' },
  { id: 'staff-2', name: 'Sara Hassan', email: 'cashier@demo.ai-ts', role: 'cashier', status: 'active', last_login: '2026-02-24T09:15:00Z', created_at: '2025-10-15T14:00:00Z' },
  { id: 'staff-3', name: 'Omar Khalil', email: 'kitchen@demo.ai-ts', role: 'kitchen', status: 'active', last_login: '2026-02-24T11:00:00Z', created_at: '2025-11-20T08:00:00Z' },
  { id: 'staff-4', name: 'Fatima Noor', email: 'cashier2@demo.ai-ts', role: 'cashier', status: 'inactive', last_login: '2026-02-20T16:00:00Z', created_at: '2025-12-01T10:00:00Z' },
  { id: 'staff-5', name: 'Dana Viewer', email: 'viewer@demo.ai-ts', role: 'viewer', status: 'active', last_login: '2026-02-23T14:45:00Z', created_at: '2026-01-10T11:00:00Z' },
];

const ROLE_COLORS: Record<string, string> = {
  manager: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400',
  cashier: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  kitchen: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  viewer: 'bg-slate-100 text-slate-600 dark:bg-slate-950/40 dark:text-slate-400',
  developer: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
};

// --- Permission Matrix Config -----------------------------------------------
const PERMISSION_COLUMNS = [
  { key: 'orders.accept', label: 'Accept Order' },
  { key: 'orders.reject', label: 'Reject Order' },
  { key: 'orders.prepare', label: 'Mark Preparing' },
  { key: 'orders.ready', label: 'Mark Ready' },
  { key: 'refunds.request', label: 'Request Refund' },
  { key: 'menu.edit', label: 'Edit Menu' },
  { key: 'menu.publish', label: 'Publish Menu' },
  { key: 'delivery.edit', label: 'Update Delivery' },
] as const;

// --- Invite Staff Modal -----------------------------------------------------
function InviteStaffModal({
  onClose,
  onInvite,
}: {
  onClose: () => void;
  onInvite: (data: { name: string; email: string; role: StaffManageableRole }) => void;
}) {
  const [form, setForm] = useState({ name: '', email: '', role: 'cashier' as StaffManageableRole });
  const canSubmit = form.name.trim() && form.email.trim();

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-card rounded-xl border border-border shadow-xl p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold font-montserrat">Invite Staff Member</h3>
            <button onClick={onClose} className="p-1 rounded-md hover:bg-muted">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Full Name *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Email or Phone *</Label>
            <Input
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="e.g. staff@shop.com or +971..."
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Role *</Label>
            <div className="grid grid-cols-2 gap-2">
              {STAFF_ROLES.map((role) => (
                <button
                  key={role}
                  onClick={() => setForm((f) => ({ ...f, role }))}
                  className={cn(
                    'rounded-lg border py-2 text-xs font-medium capitalize transition-all',
                    form.role === role
                      ? 'border-brand bg-brand/5 text-brand'
                      : 'border-border hover:border-foreground/20',
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-border p-3 space-y-1.5">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Permissions for {form.role}
            </p>
            <div className="flex flex-wrap gap-1">
              {ROLE_PERMISSIONS[form.role].map((perm) => (
                <span key={perm} className="text-[9px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
                  {perm}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" onClick={() => canSubmit && onInvite(form)} disabled={!canSubmit} className="gap-1">
              <Plus className="h-3 w-3" /> Send Invite
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// --- Confirmation Modal -----------------------------------------------------
function ConfirmModal({
  title,
  description,
  confirmLabel,
  variant = 'default',
  onClose,
  onConfirm,
  children,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  variant?: 'default' | 'destructive';
  onClose: () => void;
  onConfirm: () => void;
  children?: React.ReactNode;
}) {
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-sm bg-card rounded-xl border border-border shadow-xl p-5 space-y-4" onClick={(e) => e.stopPropagation()}>
          <div>
            <h3 className="text-sm font-semibold font-montserrat">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          {children}
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button size="sm" variant={variant === 'destructive' ? 'destructive' : 'default'} onClick={onConfirm} className="gap-1">
              <Check className="h-3 w-3" /> {confirmLabel}
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// --- Audit Drawer -----------------------------------------------------------
function AuditDrawer({ onClose }: { onClose: () => void }) {
  const { entries } = useMerchantAuditStore();
  const [nameFilter, setNameFilter] = useState('');
  const [actionFilter, setActionFilter] = useState<MerchantAuditEventType | ''>('');

  const AUDIT_EVENT_LABELS: Record<MerchantAuditEventType, string> = {
    merchant_staff_invited: 'Staff Invited',
    merchant_staff_role_changed: 'Role Changed',
    merchant_staff_disabled: 'Staff Disabled',
    merchant_audit_viewed: 'Audit Viewed',
    merchant_delivery_settings_updated: 'Delivery Updated',
    merchant_report_viewed: 'Report Viewed',
    merchant_report_exported: 'Report Exported',
    merchant_settings_updated: 'Settings Updated',
    merchant_hours_updated: 'Hours Updated',
  };

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (nameFilter && !e.actorName.toLowerCase().includes(nameFilter.toLowerCase())) return false;
      if (actionFilter && e.eventType !== actionFilter) return false;
      return true;
    });
  }, [entries, nameFilter, actionFilter]);

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-card border-l border-border shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-brand" />
            <h3 className="text-sm font-semibold font-montserrat">Audit Log</h3>
            <Badge variant="secondary" className="text-[10px]">{entries.length} events</Badge>
          </div>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Filter by staff name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="pl-8 text-xs h-8"
              />
            </div>
            <div className="relative">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value as MerchantAuditEventType | '')}
                className="h-8 rounded-md border border-input bg-background px-2 text-xs pr-6 appearance-none"
              >
                <option value="">All Actions</option>
                {(Object.keys(AUDIT_EVENT_LABELS) as MerchantAuditEventType[]).map((key) => (
                  <option key={key} value={key}>{AUDIT_EVENT_LABELS[key]}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Entries */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <ClipboardList className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-xs">No audit entries found</p>
            </div>
          ) : (
            filtered.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-border p-3 space-y-1.5 hover:bg-muted/30 transition-colors">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[9px]">
                    {AUDIT_EVENT_LABELS[entry.eventType] ?? entry.eventType}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(entry.timestamp).toLocaleString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium">{entry.actorName}</span>
                  <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full capitalize', ROLE_COLORS[entry.actorRole] ?? 'bg-muted text-muted-foreground')}>
                    {entry.actorRole}
                  </span>
                </div>
                {Object.keys(entry.metadata).length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(entry.metadata).map(([key, val]) => (
                      <span key={key} className="text-[9px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                        {key}: {String(val)}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </>,
    document.body
  );
}

// --- Main Page --------------------------------------------------------------
export default function StaffRolesPage() {
  const { merchantRole, canDo, merchantUser } = useMerchantAuth();
  const addAudit = useMerchantAuditStore((s) => s.addEntry);

  if (!canDo('staff.view')) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }

  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [showInvite, setShowInvite] = useState(false);
  const [showAudit, setShowAudit] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'permissions'>('list');

  // Confirmation modals
  const [disableTarget, setDisableTarget] = useState<StaffMember | null>(null);
  const [roleChangeTarget, setRoleChangeTarget] = useState<StaffMember | null>(null);
  const [newRole, setNewRole] = useState<StaffManageableRole>('cashier');

  const actor = merchantUser?.name ?? 'Unknown';
  const actorRole = merchantRole ?? 'unknown';

  // --- Actions ---
  const handleInvite = (data: { name: string; email: string; role: StaffManageableRole }) => {
    const member: StaffMember = {
      id: `staff-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      status: 'invited',
      last_login: null,
      created_at: new Date().toISOString(),
    };
    setStaff((prev) => [...prev, member]);
    addAudit({ eventType: 'merchant_staff_invited', actorName: actor, actorRole, metadata: { name: data.name, role: data.role } });
    toast.success(`Invite sent to ${data.name}`);
    setShowInvite(false);
  };

  const handleDisable = (member: StaffMember) => {
    const newStatus = member.status === 'inactive' ? 'active' : 'inactive';
    setStaff((prev) => prev.map((s) => s.id === member.id ? { ...s, status: newStatus } : s));
    addAudit({ eventType: 'merchant_staff_disabled', actorName: actor, actorRole, metadata: { targetName: member.name, newStatus } });
    toast.success(`${member.name} ${newStatus === 'inactive' ? 'disabled' : 're-enabled'}`);
    setDisableTarget(null);
  };

  const handleRoleChange = () => {
    if (!roleChangeTarget) return;
    const oldRole = roleChangeTarget.role;
    setStaff((prev) => prev.map((s) => s.id === roleChangeTarget.id ? { ...s, role: newRole } : s));
    addAudit({ eventType: 'merchant_staff_role_changed', actorName: actor, actorRole, metadata: { targetName: roleChangeTarget.name, oldRole, newRole } });
    toast.success(`${roleChangeTarget.name} role changed to ${newRole}`);
    setRoleChangeTarget(null);
  };

  const handleResendInvite = (member: StaffMember) => {
    toast.success(`Invite re-sent to ${member.email}`);
  };

  const activeCount = staff.filter((s) => s.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-foreground">Staff & Roles</h1>
          <p className="text-xs text-muted-foreground font-lexend mt-0.5">
            Manage staff accounts and role assignments {'\u00B7'} {activeCount} active {'\u00B7'} Role:{' '}
            <span className="font-semibold capitalize text-foreground">{merchantRole}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowAudit(true);
              addAudit({ eventType: 'merchant_audit_viewed', actorName: actor, actorRole, metadata: {} });
            }}
            className="gap-1.5"
          >
            <ClipboardList className="h-3.5 w-3.5" /> Audit Log
          </Button>
          <RequirePermission permission="staff.manage" disableInstead>
            <Button size="sm" onClick={() => setShowInvite(true)} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Invite Staff
            </Button>
          </RequirePermission>
        </div>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {STAFF_ROLES.map((role) => {
          const count = staff.filter((s) => s.role === role).length;
          const perms = ROLE_PERMISSIONS[role].length;
          return (
            <motion.div key={role} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold', ROLE_COLORS[role])}>
                      {role[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold capitalize">{role}</p>
                      <p className="text-[10px] text-muted-foreground">{count} staff {'\u00B7'} {perms} permissions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setActiveView('list')}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-all',
            activeView === 'list' ? 'bg-brand text-white' : 'bg-muted text-muted-foreground hover:text-foreground',
          )}
        >
          Staff List
        </button>
        <button
          onClick={() => setActiveView('permissions')}
          className={cn(
            'rounded-full px-3 py-1 text-xs font-medium transition-all',
            activeView === 'permissions' ? 'bg-brand text-white' : 'bg-muted text-muted-foreground hover:text-foreground',
          )}
        >
          <Shield className="h-3 w-3 inline mr-1" />
          Permission Matrix
        </button>
      </div>

      {/* Staff List View */}
      {activeView === 'list' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Last Login</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Created</th>
                    <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member) => (
                    <tr key={member.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-brand text-[10px] font-bold">
                            {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <span className="font-medium text-xs">{member.name}</span>
                            <p className="text-[10px] text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize', ROLE_COLORS[member.role])}>
                          {member.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={member.status === 'active' ? 'success' : member.status === 'invited' ? 'warning' : 'secondary'}
                          className="text-[9px]"
                        >
                          {member.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {member.last_login
                          ? new Date(member.last_login).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                          : '\u2014'}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {new Date(member.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1">
                          <RequirePermission permission="staff.manage" disableInstead>
                            <button
                              onClick={() => {
                                setRoleChangeTarget(member);
                                setNewRole(member.role as StaffManageableRole);
                              }}
                              className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              title="Change Role"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          </RequirePermission>
                          <RequirePermission permission="staff.manage" disableInstead>
                            <button
                              onClick={() => setDisableTarget(member)}
                              className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                              title={member.status === 'inactive' ? 'Re-enable' : 'Disable'}
                            >
                              <UserMinus className="h-3.5 w-3.5" />
                            </button>
                          </RequirePermission>
                          {member.status === 'invited' && (
                            <RequirePermission permission="staff.manage" disableInstead>
                              <button
                                onClick={() => handleResendInvite(member)}
                                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                title="Resend Invite"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                              </button>
                            </RequirePermission>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Permission Matrix View */}
      {activeView === 'permissions' && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium sticky left-0 bg-muted/30">Role</th>
                    {PERMISSION_COLUMNS.map((col) => (
                      <th key={col.key} className="text-center py-3 px-3 text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {STAFF_ROLES.map((role) => {
                    const perms = ROLE_PERMISSIONS[role];
                    return (
                      <tr key={role} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 sticky left-0 bg-card">
                          <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize', ROLE_COLORS[role])}>
                            {role}
                          </span>
                        </td>
                        {PERMISSION_COLUMNS.map((col) => (
                          <td key={col.key} className="text-center py-3 px-3">
                            {perms.includes(col.key as (typeof perms)[number]) ? (
                              <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invite Modal */}
      <AnimatePresence>
        {showInvite && <InviteStaffModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />}
      </AnimatePresence>

      {/* Disable Confirmation Modal */}
      <AnimatePresence>
        {disableTarget && (
          <ConfirmModal
            title={disableTarget.status === 'inactive' ? 'Re-enable Staff' : 'Disable Staff'}
            description={
              disableTarget.status === 'inactive'
                ? `Re-enable ${disableTarget.name}'s access to the dashboard?`
                : `Disable ${disableTarget.name}'s access? They will be logged out and unable to sign in.`
            }
            confirmLabel={disableTarget.status === 'inactive' ? 'Re-enable' : 'Disable'}
            variant={disableTarget.status === 'inactive' ? 'default' : 'destructive'}
            onClose={() => setDisableTarget(null)}
            onConfirm={() => handleDisable(disableTarget)}
          />
        )}
      </AnimatePresence>

      {/* Change Role Confirmation Modal */}
      <AnimatePresence>
        {roleChangeTarget && (
          <ConfirmModal
            title="Change Role"
            description={`Change ${roleChangeTarget.name}'s role from ${roleChangeTarget.role} to a new role.`}
            confirmLabel="Change Role"
            onClose={() => setRoleChangeTarget(null)}
            onConfirm={handleRoleChange}
          >
            <div className="space-y-1.5 pt-2">
              <Label className="text-xs">New Role</Label>
              <div className="grid grid-cols-2 gap-2">
                {STAFF_ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => setNewRole(role)}
                    className={cn(
                      'rounded-lg border py-2 text-xs font-medium capitalize transition-all',
                      newRole === role ? 'border-brand bg-brand/5 text-brand' : 'border-border hover:border-foreground/20',
                    )}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </ConfirmModal>
        )}
      </AnimatePresence>

      {/* Audit Drawer */}
      <AnimatePresence>
        {showAudit && <AuditDrawer onClose={() => setShowAudit(false)} />}
      </AnimatePresence>
    </div>
  );
}
