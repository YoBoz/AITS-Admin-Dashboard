import { useState, useMemo } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { usePermissionsStore } from '@/store/permissions.store';
import { toast } from 'sonner';
import type { AdminUser } from '@/types/permissions.types';
import { Send, Shield } from 'lucide-react';

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddUserModal({ open, onOpenChange }: AddUserModalProps) {
  const { roles, users, addUser } = usePermissionsStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [terminal, setTerminal] = useState('Terminal 1');
  const [department, setDepartment] = useState('');
  const [phone, setPhone] = useState('');

  const selectedRole = useMemo(() => roles.find((r) => r.id === role), [roles, role]);
  const emailExists = useMemo(() => users.some((u) => u.email.toLowerCase() === email.toLowerCase()), [users, email]);

  const isValid = name.trim() && email.trim() && !emailExists;

  const handleSubmit = () => {
    if (!isValid || !selectedRole) return;
    const newUser: AdminUser = {
      id: `u-${String(users.length + 1).padStart(3, '0')}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      role_label: selectedRole.label,
      avatar: null,
      status: 'pending_invite',
      terminal,
      department: department.trim() || 'Unassigned',
      phone: phone.trim(),
      last_login: null,
      created_at: new Date().toISOString(),
      invited_by: 'Admin User',
      two_fa_enabled: false,
      permissions_override: [],
    };
    addUser(newUser);
    toast.success(`Invitation sent to ${email}`);
    onOpenChange(false);
    // Reset
    setName(''); setEmail(''); setRole('viewer'); setDepartment(''); setPhone('');
  };

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title="Invite New User"
      subtitle="Send an invitation to a new admin user"
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!isValid} onClick={handleSubmit} className="gap-1.5">
            <Send className="h-3.5 w-3.5" />
            Send Invite
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-poppins font-medium text-foreground">Full Name *</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-poppins font-medium text-foreground">Email *</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="john@aits.io"
          />
          {emailExists && (
            <p className="text-[10px] text-red-500">This email is already registered</p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-poppins font-medium text-foreground">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.id}>{r.label} — {r.description}</option>
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
          <Input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Operations" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-poppins font-medium text-foreground">Phone (optional)</label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+971-50-000-0000" />
        </div>
      </div>

      {/* Permission Preview */}
      {selectedRole && (
        <div className="mt-4 p-3 rounded-md bg-muted/50 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-primary" />
            <h4 className="text-xs font-poppins font-semibold text-foreground">
              Permissions for {selectedRole.label}
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedRole.permissions.slice(0, 12).map((p) => (
              <span key={p} className="inline-flex rounded px-1.5 py-0.5 text-[9px] font-mono bg-background text-muted-foreground border border-border">
                {p}
              </span>
            ))}
            {selectedRole.permissions.length > 12 && (
              <span className="text-[9px] font-mono text-muted-foreground">
                +{selectedRole.permissions.length - 12} more
              </span>
            )}
          </div>
        </div>
      )}
    </FormModal>
  );
}
