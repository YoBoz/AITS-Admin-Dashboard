import { useState, useMemo } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/Switch';
import { usePermissionsStore } from '@/store/permissions.store';
import { allPermissions } from '@/data/mock/roles.mock';
import { toast } from 'sonner';
import type { AdminUser } from '@/types/permissions.types';
import { AlertTriangle, Save } from 'lucide-react';

interface EditUserModalProps {
  user: AdminUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditUserModal({ user, open, onOpenChange }: EditUserModalProps) {
  const { roles, updateUser } = usePermissionsStore();

  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [terminal, setTerminal] = useState(user.terminal);
  const [department, setDepartment] = useState(user.department);
  const [phone, setPhone] = useState(user.phone);
  const [overrides, setOverrides] = useState<string[]>([...user.permissions_override]);

  const selectedRole = useMemo(() => roles.find((r) => r.id === role), [roles, role]);
  const rolePerms = useMemo(() => new Set(selectedRole?.permissions ?? []), [selectedRole]);
  const extraPerms = useMemo(
    () => allPermissions.filter((p) => !rolePerms.has(p.key)),
    [rolePerms],
  );

  const toggleOverride = (key: string) => {
    setOverrides((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const handleSave = () => {
    const selectedR = roles.find((r) => r.id === role);
    updateUser(user.id, {
      name: name.trim(),
      role,
      role_label: selectedR?.label ?? user.role_label,
      terminal,
      department: department.trim(),
      phone: phone.trim(),
      permissions_override: overrides,
    });
    toast.success(`${name} updated successfully`);
    onOpenChange(false);
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Edit User — ${user.name}`}
      subtitle={user.email}
      size="xl"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} className="gap-1.5">
            <Save className="h-3.5 w-3.5" />
            Save Changes
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-poppins font-medium text-foreground">Full Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-poppins font-medium text-foreground">Role</label>
          <select
            value={role}
            onChange={(e) => { setRole(e.target.value); setOverrides([]); }}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.label}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-poppins font-medium text-foreground">Terminal</label>
          <select
            value={terminal}
            onChange={(e) => setTerminal(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {['Terminal 1', 'Terminal 2', 'Terminal 3', 'All Terminals'].map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-poppins font-medium text-foreground">Department</label>
          <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
        </div>
        <div className="space-y-1.5 col-span-2">
          <label className="text-xs font-poppins font-medium text-foreground">Phone</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      </div>

      {/* Permissions Override */}
      <div className="mt-6 space-y-3">
        <h4 className="text-xs font-poppins font-semibold text-foreground uppercase tracking-wider">
          Permission Overrides
        </h4>

        {overrides.length > 0 && (
          <div className="flex items-start gap-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-600 dark:text-amber-400 font-lexend">
              Permission overrides make auditing harder. Prefer creating a custom role instead.
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground font-lexend mb-2">
          Base permissions from <strong>{selectedRole?.label}</strong> ({selectedRole?.permissions.length} permissions).
          Add extra permissions below:
        </div>

        <div className="max-h-48 overflow-y-auto border border-border rounded-md divide-y divide-border">
          {extraPerms.map((p) => (
            <div key={p.key} className="flex items-center justify-between px-3 py-2 hover:bg-muted/30">
              <div>
                <div className="text-xs font-lexend text-foreground">{p.label}</div>
                <div className="text-[10px] font-mono text-muted-foreground">{p.key}</div>
              </div>
              <Switch
                checked={overrides.includes(p.key)}
                onCheckedChange={() => toggleOverride(p.key)}
              />
            </div>
          ))}
        </div>
      </div>
    </FormModal>
  );
}
