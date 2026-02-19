// ──────────────────────────────────────
// Fraud Limits Tab — Phase 9
// ──────────────────────────────────────

import { useState } from 'react';
import { SectionCard } from '@/components/common/SectionCard';
import { RuleRow } from '@/components/global-rules/RuleRow';
import { FormModal } from '@/components/common/FormModal';
import { Input } from '@/components/ui/Input';
import { Callout } from '@/components/common/Callout';
import { useGlobalRulesStore } from '@/store/global-rules.store';
import { toast } from 'sonner';
import type { FraudLimit } from '@/types/global-rules.types';

const actionColors: Record<FraudLimit['action'], string> = {
  flag: 'bg-amber-500',
  block: 'bg-red-500',
  require_ops_approval: 'bg-purple-500',
  alert_only: 'bg-blue-500',
};

export default function FraudLimitsTab() {
  const { fraudLimits, updateFraudLimit, toggleFraudLimit } = useGlobalRulesStore();
  const [editing, setEditing] = useState<FraudLimit | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  const openEdit = (limit: FraudLimit) => {
    setEditing(limit);
    setEditValue(limit.threshold);
  };

  const handleSave = () => {
    if (!editing) return;
    updateFraudLimit(editing.id, { threshold: editValue });
    toast.success(`Updated: ${editing.name}`);
    setEditing(null);
  };

  return (
    <div className="space-y-5">
      <Callout variant="warning">
        Fraud limits protect the platform from unauthorized transactions and abuse. Changes are logged to the immutable audit trail. Adjust with caution.
      </Callout>

      <SectionCard title="Fraud &amp; Transaction Limits">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Limit</th>
                <th className="pb-2 pr-4 font-medium w-32">Threshold</th>
                <th className="pb-2 pr-4 font-medium w-20">Active</th>
                <th className="pb-2 font-medium w-16">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {fraudLimits.map((limit) => (
                <RuleRow
                  key={limit.id}
                  label={limit.name}
                  description={limit.description}
                  value={limit.threshold}
                  unit={limit.action}
                  enabled={limit.is_active}
                  onToggle={() => toggleFraudLimit(limit.id)}
                  onEdit={() => openEdit(limit)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Action Legend */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="font-medium">Action Types:</span>
        {fraudLimits.map((l) => (
          <span key={l.id} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${actionColors[l.action]}`} />
            {l.name} ({l.action.replace(/_/g, ' ')})
          </span>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <FormModal
          open={!!editing}
          onOpenChange={(open) => { if (!open) setEditing(null); }}
          title={`Edit: ${editing.name}`}
          size="sm"
          footer={
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Save</button>
            </div>
          }
        >
          <div className="space-y-3">
            <Callout variant="warning">
              Changing this limit will be recorded in the immutable audit log.
            </Callout>
            {editing.description && (
              <p className="text-xs text-muted-foreground">{editing.description}</p>
            )}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Threshold
              </label>
              <Input
                type="number"
                value={editValue}
                onChange={(e) => setEditValue(Number(e.target.value))}
              />
            </div>
            <div className="text-xs text-muted-foreground">
              <strong>Action:</strong>{' '}
              <span className="font-medium">{editing.action.replace(/_/g, ' ')}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              <strong>Triggered Today:</strong> {editing.triggered_count_today}
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
}
