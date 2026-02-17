import { useState, useMemo } from 'react';
import { RoleCard } from '@/components/permissions/RoleCard';
import { usePermissionsStore } from '@/store/permissions.store';
import { usePermissions } from '@/hooks/usePermissions';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import RoleEditorModal from './RoleEditorModal';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Role } from '@/types/permissions.types';

export default function RolesTab() {
  const { roles, deleteRole } = usePermissionsStore();
  const { can } = usePermissions();
  const canManageRoles = can('permissions.roles_manage');

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [cloneFrom, setCloneFrom] = useState<Role | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setCloneFrom(null);
    setEditorOpen(true);
  };

  const handleClone = (role: Role) => {
    setEditingRole(null);
    setCloneFrom(role);
    setEditorOpen(true);
  };

  const handleCreate = () => {
    setEditingRole(null);
    setCloneFrom(null);
    setEditorOpen(true);
  };

  const handleDelete = () => {
    if (deleteTarget) {
      deleteRole(deleteTarget.id);
      toast.success(`Role "${deleteTarget.label}" deleted`);
      setDeleteTarget(null);
    }
  };

  const systemRoles = useMemo(() => roles.filter((r) => r.is_system_role), [roles]);
  const customRoles = useMemo(() => roles.filter((r) => !r.is_system_role), [roles]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-poppins font-semibold text-foreground">System Roles</h3>
          <p className="text-xs text-muted-foreground font-lexend mt-0.5">
            Built-in roles that cannot be deleted
          </p>
        </div>
      </div>

      {/* System Roles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systemRoles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            canEdit={canManageRoles}
            canDelete={false}
            onEdit={() => handleEdit(role)}
            onClone={() => handleClone(role)}
            previewPermissions={role.permissions.slice(0, 5)}
          />
        ))}
      </div>

      {/* Custom Roles */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-poppins font-semibold text-foreground">Custom Roles</h3>
          <p className="text-xs text-muted-foreground font-lexend mt-0.5">
            User-created roles with tailored permissions
          </p>
        </div>
        <Button size="sm" className="h-8 text-xs gap-1.5" onClick={handleCreate}>
          <Plus className="h-3.5 w-3.5" />
          Create Custom Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customRoles.map((role) => (
          <RoleCard
            key={role.id}
            role={role}
            canEdit={canManageRoles}
            canDelete={canManageRoles}
            onEdit={() => handleEdit(role)}
            onClone={() => handleClone(role)}
            onDelete={() => setDeleteTarget(role)}
            previewPermissions={role.permissions.slice(0, 5)}
          />
        ))}
        {customRoles.length === 0 && (
          <div className="col-span-3 text-center py-12 text-sm text-muted-foreground">
            No custom roles yet. Clone a system role to get started.
          </div>
        )}
      </div>

      {/* Modals */}
      <RoleEditorModal
        open={editorOpen}
        onOpenChange={setEditorOpen}
        editingRole={editingRole}
        cloneFrom={cloneFrom}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Role"
        description={`Are you sure you want to delete "${deleteTarget?.label}"? Users assigned to this role will be reassigned to Viewer.`}
        confirmLabel="Delete Role"
        confirmVariant="danger"
        onConfirm={handleDelete}
      />
    </div>
  );
}
