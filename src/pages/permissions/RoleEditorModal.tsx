import { useState, useMemo } from 'react';
import { FormModal } from '@/components/common/FormModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { usePermissionsStore } from '@/store/permissions.store';
import { permissionsByGroup, permissionGroupLabels } from '@/data/mock/roles.mock';
import { toast } from 'sonner';
import type { Role, PermissionGroup } from '@/types/permissions.types';
import { Save, ChevronDown, ChevronRight, Check, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingRole?: Role | null;
  cloneFrom?: Role | null;
}

const presetColors = ['#BE052E', '#7C3AED', '#2563EB', '#059669', '#D97706', '#0891B2'];

export default function RoleEditorModal({ open, onOpenChange, editingRole, cloneFrom }: RoleEditorModalProps) {
  const { addRole, updateRole, roles } = usePermissionsStore();
  const isEditing = !!editingRole && !cloneFrom;
  const baseRole = editingRole || cloneFrom;

  const [label, setLabel] = useState(isEditing ? baseRole?.label ?? '' : cloneFrom ? `${cloneFrom.label} (Copy)` : '');
  const [description, setDescription] = useState(baseRole?.description ?? '');
  const [color, setColor] = useState(baseRole?.color ?? '#2563EB');
  const [customColor, setCustomColor] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(
    new Set(baseRole?.permissions ?? []),
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<PermissionGroup>>(new Set());

  const toggleGroup = (group: PermissionGroup) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      next.has(group) ? next.delete(group) : next.add(group);
      return next;
    });
  };

  const togglePerm = (key: string) => {
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleGroupAll = (group: PermissionGroup) => {
    const groupPerms = permissionsByGroup[group];
    const allSelected = groupPerms.every((p) => selectedPerms.has(p.key));
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      groupPerms.forEach((p) => {
        allSelected ? next.delete(p.key) : next.add(p.key);
      });
      return next;
    });
  };

  const riskSummary = useMemo(() => {
    const permsArr = Array.from(selectedPerms);
    const allPerms = Object.values(permissionsByGroup).flat();
    let critical = 0, high = 0;
    permsArr.forEach((key) => {
      const p = allPerms.find((pp) => pp.key === key);
      if (p?.risk_level === 'critical') critical++;
      if (p?.risk_level === 'high') high++;
    });
    return { critical, high, total: selectedPerms.size };
  }, [selectedPerms]);

  const handleSave = () => {
    const trimmed = label.trim();
    if (!trimmed) return;

    if (isEditing && editingRole) {
      updateRole(editingRole.id, {
        label: trimmed,
        description: description.trim(),
        color,
        permissions: Array.from(selectedPerms),
      });
      toast.success(`Role "${trimmed}" updated`);
    } else {
      const id = trimmed.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now().toString(36);
      const newRole: Role = {
        id,
        name: id,
        label: trimmed,
        description: description.trim(),
        color,
        permissions: Array.from(selectedPerms),
        is_system_role: false,
        user_count: 0,
        created_at: new Date().toISOString(),
        created_by: 'Admin User',
      };
      addRole(newRole);
      toast.success(`Role "${trimmed}" created`);
    }
    onOpenChange(false);
  };

  // Reset state when modal opens
  useMemo(() => {
    if (open) {
      setLabel(isEditing ? baseRole?.label ?? '' : cloneFrom ? `${cloneFrom.label} (Copy)` : '');
      setDescription(baseRole?.description ?? '');
      setColor(baseRole?.color ?? '#2563EB');
      setSelectedPerms(new Set(baseRole?.permissions ?? []));
      setExpandedGroups(new Set());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? 'Edit Role' : 'Create Custom Role'}
      subtitle={isEditing ? `Editing: ${editingRole?.label}` : cloneFrom ? `Based on: ${cloneFrom.label}` : 'Define a new role with custom permissions'}
      size="xl"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button disabled={!label.trim()} onClick={handleSave} className="gap-1.5">
            <Save className="h-3.5 w-3.5" />
            {isEditing ? 'Update Role' : 'Create Role'}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-3 gap-6">
        {/* Left: Fields + Permissions */}
        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-poppins font-medium text-foreground">Role Label *</label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="My Custom Role" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-poppins font-medium text-foreground">Color</label>
              <div className="flex items-center gap-2">
                {presetColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      'h-7 w-7 rounded-full border-2 transition-all',
                      color === c ? 'border-foreground scale-110' : 'border-transparent',
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <Input
                  type="text"
                  value={customColor}
                  onChange={(e) => { setCustomColor(e.target.value); if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) setColor(e.target.value); }}
                  placeholder="#hex"
                  className="h-7 w-20 text-xs font-mono"
                />
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-poppins font-medium text-foreground">Description</label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the role's purpose" />
          </div>

          {cloneFrom === null && editingRole === null && (
            <div className="space-y-1.5">
              <label className="text-xs font-poppins font-medium text-foreground">Base on existing role</label>
              <select
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                onChange={(e) => {
                  const r = roles.find((rr) => rr.id === e.target.value);
                  if (r) setSelectedPerms(new Set(r.permissions));
                }}
                defaultValue=""
              >
                <option value="">None (start from scratch)</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Permission groups */}
          <div className="border border-border rounded-md max-h-[340px] overflow-y-auto">
            {(Object.keys(permissionsByGroup) as PermissionGroup[]).map((group) => {
              const perms = permissionsByGroup[group];
              const expanded = expandedGroups.has(group);
              const allChecked = perms.every((p) => selectedPerms.has(p.key));
              const someChecked = perms.some((p) => selectedPerms.has(p.key));

              return (
                <div key={group}>
                  <div
                    className="flex items-center gap-2 px-3 py-2 bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors border-b border-border"
                    onClick={() => toggleGroup(group)}
                  >
                    {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); toggleGroupAll(group); }}
                      className={cn(
                        'h-4 w-4 rounded border flex items-center justify-center shrink-0',
                        allChecked ? 'bg-emerald-500 border-emerald-500 text-white' :
                        someChecked ? 'bg-primary/30 border-primary' : 'border-border',
                      )}
                    >
                      {allChecked && <Check className="h-2.5 w-2.5" />}
                      {someChecked && !allChecked && <div className="h-1.5 w-1.5 bg-primary rounded-sm" />}
                    </button>
                    <span className="text-xs font-poppins font-semibold text-foreground">
                      {permissionGroupLabels[group]}
                    </span>
                    <span className="text-[9px] font-mono text-muted-foreground ml-auto">
                      {perms.filter((p) => selectedPerms.has(p.key)).length}/{perms.length}
                    </span>
                  </div>
                  {expanded && perms.map((p) => (
                    <div
                      key={p.key}
                      className="flex items-center gap-3 px-6 py-1.5 hover:bg-muted/20 cursor-pointer border-b border-border/50"
                      onClick={() => togglePerm(p.key)}
                    >
                      <button
                        type="button"
                        className={cn(
                          'h-4 w-4 rounded border flex items-center justify-center shrink-0',
                          selectedPerms.has(p.key) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-border',
                        )}
                      >
                        {selectedPerms.has(p.key) && <Check className="h-2.5 w-2.5" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-lexend text-foreground">{p.label}</div>
                        <div className="text-[10px] font-mono text-muted-foreground">{p.key}</div>
                      </div>
                      <span className={cn(
                        'text-[9px] font-mono capitalize px-1.5 py-0.5 rounded',
                        p.risk_level === 'critical' ? 'text-red-500 bg-red-500/10' :
                        p.risk_level === 'high' ? 'text-amber-500 bg-amber-500/10' :
                        p.risk_level === 'medium' ? 'text-blue-500 bg-blue-500/10' :
                        'text-emerald-500 bg-emerald-500/10',
                      )}>
                        {p.risk_level}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Preview panel */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-poppins font-semibold text-foreground">Role Preview</h4>
            </div>
            <div className="h-1.5 rounded-full" style={{ backgroundColor: color }} />
            <div>
              <div className="text-sm font-montserrat font-bold text-foreground">{label || 'Untitled Role'}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{description || 'No description'}</div>
            </div>
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono text-muted-foreground">
                Total: <span className="text-foreground font-bold">{riskSummary.total}</span> permissions
              </div>
              {riskSummary.critical > 0 && (
                <div className="text-[10px] font-mono text-red-500">
                  ⚠ {riskSummary.critical} critical permissions
                </div>
              )}
              {riskSummary.high > 0 && (
                <div className="text-[10px] font-mono text-amber-500">
                  ⚠ {riskSummary.high} high-risk permissions
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </FormModal>
  );
}
