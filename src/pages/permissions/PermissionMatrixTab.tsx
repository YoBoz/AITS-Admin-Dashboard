import { useMemo, useState } from 'react';
import { usePermissionsStore } from '@/store/permissions.store';
import { permissionsByGroup } from '@/data/mock/roles.mock';
import { PermissionGroupRow } from '@/components/permissions/PermissionGroupRow';
import { PermissionCell } from '@/components/permissions/PermissionCell';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Button } from '@/components/ui/Button';
import { Download, Info } from 'lucide-react';
import { toast } from 'sonner';
import type { PermissionGroup, Permission } from '@/types/permissions.types';
import { cn } from '@/lib/utils';

export default function PermissionMatrixTab() {
  const { roles, updateRolePermissions } = usePermissionsStore();
  const [confirmRemove, setConfirmRemove] = useState<{
    roleId: string;
    roleName: string;
    permKey: string;
    permLabel: string;
  } | null>(null);

  const groups = useMemo(
    () => Object.keys(permissionsByGroup) as PermissionGroup[],
    [],
  );

  const handleToggle = (roleId: string, roleName: string, perm: Permission, currentlyChecked: boolean) => {
    const role = roles.find((r) => r.id === roleId);
    if (!role || role.is_system_role) return;

    if (currentlyChecked) {
      // Removing a permission — confirm
      setConfirmRemove({ roleId, roleName, permKey: perm.key, permLabel: perm.label });
    } else {
      // Adding — apply directly
      const newPerms = [...role.permissions, perm.key];
      updateRolePermissions(roleId, newPerms);
      toast.success(`Added "${perm.label}" to ${roleName}`);
    }
  };

  const handleConfirmRemove = () => {
    if (!confirmRemove) return;
    const role = roles.find((r) => r.id === confirmRemove.roleId);
    if (!role) return;
    const newPerms = role.permissions.filter((p) => p !== confirmRemove.permKey);
    updateRolePermissions(confirmRemove.roleId, newPerms);
    toast.success(`Removed "${confirmRemove.permLabel}" from ${confirmRemove.roleName}`);
    setConfirmRemove(null);
  };

  const exportCSV = () => {
    const header = ['Permission', ...roles.map((r) => r.label)];
    const rows: string[][] = [];
    groups.forEach((group) => {
      permissionsByGroup[group].forEach((p) => {
        rows.push([p.key, ...roles.map((r) => (r.permissions.includes(p.key) ? 'Yes' : 'No'))]);
      });
    });
    const csv = [header, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'permission-matrix.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Permission matrix exported');
  };

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="flex items-start gap-2 p-3 rounded-md bg-blue-500/10 border border-blue-500/20">
        <Info className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-xs text-blue-600 dark:text-blue-400 font-lexend">
          System roles cannot be modified. To customize permissions, clone a role and create a custom version.
        </p>
      </div>

      {/* Export */}
      <div className="flex justify-end">
        <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={exportCSV}>
          <Download className="h-3.5 w-3.5" />
          Export as CSV
        </Button>
      </div>

      {/* Matrix Table */}
      <div className="border border-border rounded-lg overflow-auto max-h-[600px]">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-10 bg-card border-b border-border">
            <tr>
              <th className="sticky left-0 z-20 bg-card px-4 py-3 text-left text-[10px] font-poppins font-semibold text-muted-foreground uppercase tracking-wider min-w-[200px]">
                Permission
              </th>
              {roles.map((role) => (
                <th key={role.id} className="px-3 py-3 text-center min-w-[100px]">
                  <div className="flex flex-col items-center gap-1">
                    <span
                      className="inline-block h-2 w-8 rounded-full"
                      style={{ backgroundColor: role.color }}
                    />
                    <span className={cn('text-[10px] font-poppins font-semibold', role.is_system_role ? 'text-foreground' : 'text-primary')}>
                      {role.label}
                    </span>
                    {role.is_system_role && (
                      <span className="text-[8px] text-muted-foreground">System</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => (
              <PermissionGroupRow
                key={group}
                group={group}
                permissions={permissionsByGroup[group]}
                roleCount={roles.length}
                defaultExpanded={group === 'dashboard' || group === 'trolleys'}
              >
                {permissionsByGroup[group].map((perm) => (
                  <tr key={perm.key} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="sticky left-0 bg-card px-6 py-2">
                      <div className="text-xs font-lexend text-foreground">{perm.label}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">{perm.key}</div>
                    </td>
                    {roles.map((role) => {
                      const checked = role.permissions.includes(perm.key);
                      return (
                        <PermissionCell
                          key={role.id}
                          checked={checked}
                          disabled={role.is_system_role}
                          permission={perm}
                          onChange={() => handleToggle(role.id, role.label, perm, checked)}
                        />
                      );
                    })}
                  </tr>
                ))}
              </PermissionGroupRow>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!confirmRemove}
        onOpenChange={() => setConfirmRemove(null)}
        title="Remove Permission"
        description={`Remove "${confirmRemove?.permLabel}" from role "${confirmRemove?.roleName}"? Users with this role will lose this access.`}
        confirmLabel="Remove"
        confirmVariant="warning"
        onConfirm={handleConfirmRemove}
      />
    </div>
  );
}
