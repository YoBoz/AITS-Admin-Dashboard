import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SectionCard } from '@/components/common/SectionCard';
import { UserCard } from '@/components/permissions/UserCard';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { usePermissionsStore } from '@/store/permissions.store';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Users, UserCheck, UserPlus, UserX, Search, Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import { FormModal } from '@/components/common/FormModal';
import type { AdminUser } from '@/types/permissions.types';

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'pending_invite', label: 'Pending' },
];

export default function UsersTab() {
  const { user: authUser } = useAuth();
  const {
    getFilteredUsers, getUserStats, roles, filters, setFilters, deactivateUser, updateUser,
  } = usePermissionsStore();

  const [addOpen, setAddOpen] = useState(false);
  const [editUser, setEditUser] = useState<AdminUser | null>(null);
  const [revokeUser, setRevokeUser] = useState<AdminUser | null>(null);
  const [activityUser, setActivityUser] = useState<AdminUser | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const stats = getUserStats();
  const filteredUsers = getFilteredUsers();

  const roleColorMap = useMemo(() => {
    const m: Record<string, string> = {};
    roles.forEach((r) => { m[r.id] = r.color; });
    return m;
  }, [roles]);

  const roleOptions = useMemo(() => [
    { value: 'all', label: 'All Roles' },
    ...roles.map((r) => ({ value: r.id, label: r.label })),
  ], [roles]);

  const terminalOptions = useMemo(() => {
    const terms = new Set(filteredUsers.map((u) => u.terminal));
    return [{ value: 'all', label: 'All Terminals' }, ...Array.from(terms).map((t) => ({ value: t, label: t }))];
  }, [filteredUsers]);

  const handleRevoke = () => {
    if (revokeUser) {
      deactivateUser(revokeUser.id);
      toast.success(`${revokeUser.name} access has been revoked`);
      setRevokeUser(null);
    }
  };

  const statCards = [
    { label: 'Total Users', value: stats.total, icon: Users, color: 'text-foreground' },
    { label: 'Active', value: stats.active, icon: UserCheck, color: 'text-emerald-500' },
    { label: 'Pending Invites', value: stats.pending, icon: UserPlus, color: 'text-amber-500' },
    { label: 'Suspended', value: stats.suspended, icon: UserX, color: 'text-red-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-lexend">{s.label}</p>
                <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
              </div>
              <s.icon className={`h-8 w-8 ${s.color} opacity-20`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="pl-9 h-9 text-sm"
          />
        </div>
        <select
          value={filters.role}
          onChange={(e) => setFilters({ role: e.target.value })}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs font-lexend"
        >
          {roleOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ status: e.target.value })}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs font-lexend"
        >
          {statusOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <select
          value={filters.terminal}
          onChange={(e) => setFilters({ terminal: e.target.value })}
          className="h-9 rounded-md border border-input bg-background px-3 text-xs font-lexend"
        >
          {terminalOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <div className="flex-1" />

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{selectedIds.size} selected</span>
            <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => {
              selectedIds.forEach((id) => updateUser(id, { status: 'active' }));
              toast.success(`${selectedIds.size} users activated`);
              setSelectedIds(new Set());
            }}>
              Activate
            </Button>
            <Button size="sm" variant="outline" className="h-8 text-xs text-red-500" onClick={() => {
              selectedIds.forEach((id) => deactivateUser(id));
              toast.success(`${selectedIds.size} users suspended`);
              setSelectedIds(new Set());
            }}>
              Suspend
            </Button>
          </div>
        )}

        <Button size="sm" variant="outline" className="h-9 text-xs gap-1.5">
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
        <Button size="sm" className="h-9 text-xs gap-1.5" onClick={() => setAddOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Invite User
        </Button>
      </div>

      {/* Users Table */}
      <SectionCard title="Admin Users" subtitle={`${filteredUsers.length} users found`}>
        {/* Header */}
        <div className="grid grid-cols-12 gap-3 px-4 py-2 border-b border-border bg-muted/30">
          {['Name', 'Email', 'Role', 'Terminal', 'Status', 'Last Login', '2FA', 'Actions'].map((h, i) => (
            <div
              key={h}
              className={`text-[10px] font-poppins font-semibold text-muted-foreground uppercase tracking-wider ${
                i === 0 ? 'col-span-3' : i === 1 ? 'col-span-2' : 'col-span-1'
              } ${h === '2FA' ? 'text-center' : ''}`}
            >
              {h}
            </div>
          ))}
        </div>
        {/* Rows */}
        {filteredUsers.map((u) => (
          <UserCard
            key={u.id}
            user={u}
            roleColor={roleColorMap[u.role] || '#6B7280'}
            isOwnAccount={authUser?.email === u.email}
            isSuperAdmin={u.role === 'super_admin' && authUser?.email !== u.email}
            onEdit={() => setEditUser(u)}
            onResetPassword={() => toast.success(`Password reset email sent to ${u.email}`)}
            onViewActivity={() => setActivityUser(u)}
            onRevoke={() => setRevokeUser(u)}
            onStatusChange={(active) => {
              updateUser(u.id, { status: active ? 'active' : 'inactive' });
              toast.success(`${u.name} is now ${active ? 'active' : 'inactive'}`);
            }}
          />
        ))}
        {filteredUsers.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">No users match the current filters.</div>
        )}
      </SectionCard>

      {/* Modals */}
      <AddUserModal open={addOpen} onOpenChange={setAddOpen} />
      {editUser && (
        <EditUserModal user={editUser} open={!!editUser} onOpenChange={() => setEditUser(null)} />
      )}
      <ConfirmDialog
        open={!!revokeUser}
        onOpenChange={() => setRevokeUser(null)}
        title="Revoke User Access"
        description={`Are you sure you want to suspend ${revokeUser?.name}? They will lose access to the dashboard immediately.`}
        confirmLabel="Revoke Access"
        confirmVariant="danger"
        onConfirm={handleRevoke}
      />

      {/* Activity Log Modal */}
      <FormModal
        open={!!activityUser}
        onOpenChange={() => setActivityUser(null)}
        title={`Activity Log — ${activityUser?.name ?? ''}`}
        subtitle="Recent account activity and access history."
        footer={
          <div className="flex justify-end">
            <button onClick={() => setActivityUser(null)} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Close</button>
          </div>
        }
      >
        <div className="space-y-3 max-h-[340px] overflow-y-auto">
          {[
            { action: 'Logged in', ip: '192.168.1.42', time: '2 minutes ago', device: 'Chrome / Windows' },
            { action: 'Updated shop profile', ip: '192.168.1.42', time: '15 minutes ago', device: 'Chrome / Windows' },
            { action: 'Exported complaints report', ip: '192.168.1.42', time: '1 hour ago', device: 'Chrome / Windows' },
            { action: 'Changed password', ip: '10.0.0.15', time: '3 hours ago', device: 'Safari / macOS' },
            { action: 'Logged in', ip: '10.0.0.15', time: '3 hours ago', device: 'Safari / macOS' },
            { action: 'Approved offer #OF-0012', ip: '192.168.1.42', time: '1 day ago', device: 'Chrome / Windows' },
            { action: 'Assigned complaint #CMP-005', ip: '192.168.1.42', time: '1 day ago', device: 'Chrome / Windows' },
            { action: 'Logged in', ip: '192.168.1.42', time: '1 day ago', device: 'Chrome / Windows' },
          ].map((entry, i) => (
            <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 text-sm">
              <div className="h-2 w-2 rounded-full bg-brand mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{entry.action}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.device} · {entry.ip} · {entry.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </FormModal>
    </div>
  );
}
