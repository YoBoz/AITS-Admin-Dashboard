import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Pencil, Trash2, X, Check,
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
import type { MerchantRole } from '@/types/merchant.types';
import { ROLE_PERMISSIONS } from '@/types/merchant.types';

// ─── Mock Staff Data ──────────────────────────────────────────────────
interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: MerchantRole;
  status: 'active' | 'inactive';
  last_active: string;
}

const initialStaff: StaffMember[] = [
  { id: 'staff-1', name: 'Ahmed Al-Rashid', email: 'manager@demo.ai-ts', role: 'manager', status: 'active', last_active: '2026-02-24T10:30:00Z' },
  { id: 'staff-2', name: 'Sara Hassan', email: 'cashier@demo.ai-ts', role: 'cashier', status: 'active', last_active: '2026-02-24T09:15:00Z' },
  { id: 'staff-3', name: 'Omar Khalil', email: 'kitchen@demo.ai-ts', role: 'kitchen', status: 'active', last_active: '2026-02-24T11:00:00Z' },
  { id: 'staff-4', name: 'Fatima Noor', email: 'cashier2@demo.ai-ts', role: 'cashier', status: 'inactive', last_active: '2026-02-20T16:00:00Z' },
];

const ROLE_COLORS: Record<MerchantRole, string> = {
  manager: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400',
  cashier: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  kitchen: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  developer: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
};

// ─── Add/Edit Staff Modal ─────────────────────────────────────────────
function StaffModal({
  staff,
  onClose,
  onSave,
}: {
  staff: StaffMember | null;
  onClose: () => void;
  onSave: (data: Omit<StaffMember, 'id' | 'last_active'>) => void;
}) {
  const isEdit = !!staff;
  const [form, setForm] = useState({
    name: staff?.name ?? '',
    email: staff?.email ?? '',
    role: staff?.role ?? ('cashier' as MerchantRole),
    status: staff?.status ?? ('active' as 'active' | 'inactive'),
  });

  const canSubmit = form.name.trim() && form.email.trim();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-card rounded-xl border border-border shadow-xl p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold font-montserrat">
            {isEdit ? 'Edit Staff Member' : 'Add Staff Member'}
          </h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Full Name</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="e.g. John Doe"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Email</Label>
          <Input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="e.g. staff@shop.com"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Role</Label>
          <div className="grid grid-cols-2 gap-2">
            {(['manager', 'cashier', 'kitchen'] as MerchantRole[]).map((role) => (
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

        {/* Role permissions preview */}
        <div className="rounded-lg border border-border p-3 space-y-1.5">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
            Permissions for {form.role}
          </p>
          <div className="flex flex-wrap gap-1">
            {ROLE_PERMISSIONS[form.role].map((perm) => (
              <span
                key={perm}
                className="text-[9px] bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground"
              >
                {perm}
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            onClick={() => canSubmit && onSave(form)}
            disabled={!canSubmit}
            className="gap-1"
          >
            <Check className="h-3 w-3" /> {isEdit ? 'Save Changes' : 'Add Staff'}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────
export default function StaffRolesPage() {
  const { merchantRole, canDo } = useMerchantAuth();
  const canManage = canDo('staff.manage');

  if (!canDo('staff.view')) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">You do not have permission to view this page.</p>
      </div>
    );
  }
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [modalStaff, setModalStaff] = useState<StaffMember | null | undefined>(undefined);
  const showModal = modalStaff !== undefined;

  const openAdd = () => setModalStaff(null);
  const openEdit = (member: StaffMember) => setModalStaff(member);
  const closeModal = () => setModalStaff(undefined);

  const handleSave = (data: Omit<StaffMember, 'id' | 'last_active'>) => {
    if (modalStaff) {
      // Edit
      setStaff((prev) =>
        prev.map((s) => (s.id === modalStaff.id ? { ...s, ...data } : s))
      );
      toast.success('Staff member updated');
    } else {
      // Add
      const newMember: StaffMember = {
        ...data,
        id: `staff-${Date.now()}`,
        last_active: new Date().toISOString(),
      };
      setStaff((prev) => [...prev, newMember]);
      toast.success('Staff member added');
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    setStaff((prev) => prev.filter((s) => s.id !== id));
    toast.success('Staff member removed');
  };

  const handleToggleStatus = (id: string) => {
    setStaff((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s
      )
    );
  };

  const activeCount = staff.filter((s) => s.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-montserrat text-foreground">Staff & Roles</h1>
          <p className="text-xs text-muted-foreground font-lexend mt-0.5">
            Manage staff accounts and role assignments · {activeCount} active · Role:{' '}
            <span className="font-semibold capitalize text-foreground">{merchantRole}</span>
          </p>
        </div>
        <RequirePermission permission="staff.manage" disableInstead>
          <Button size="sm" onClick={openAdd} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Staff
          </Button>
        </RequirePermission>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(['manager', 'cashier', 'kitchen'] as MerchantRole[]).map((role) => {
          const count = staff.filter((s) => s.role === role).length;
          const perms = ROLE_PERMISSIONS[role].length;
          return (
            <motion.div
              key={role}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold', ROLE_COLORS[role])}>
                      {role[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold capitalize">{role}</p>
                      <p className="text-[10px] text-muted-foreground">{count} staff · {perms} permissions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Staff List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Last Active</th>
                  <th className="text-right py-3 px-4 text-xs text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-brand text-[10px] font-bold">
                          {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-xs">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">{member.email}</td>
                    <td className="py-3 px-4">
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize', ROLE_COLORS[member.role])}>
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => canManage && handleToggleStatus(member.id)}
                        disabled={!canManage}
                      >
                        <Badge
                          variant={member.status === 'active' ? 'success' : 'secondary'}
                          className="text-[9px] cursor-pointer"
                        >
                          {member.status}
                        </Badge>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {new Date(member.last_active).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <RequirePermission permission="staff.manage" disableInstead>
                          <button
                            onClick={() => openEdit(member)}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </RequirePermission>
                        <RequirePermission permission="staff.manage" disableInstead>
                          <button
                            onClick={() => handleDelete(member.id)}
                            className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </RequirePermission>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <StaffModal
            staff={modalStaff ?? null}
            onClose={closeModal}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
