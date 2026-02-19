// ──────────────────────────────────────
// Expiry Rules Tab — Phase 9
// ──────────────────────────────────────

import { useState } from 'react';
import { SectionCard } from '@/components/common/SectionCard';
import { RuleRow } from '@/components/global-rules/RuleRow';
import { FormModal } from '@/components/common/FormModal';
import { Input } from '@/components/ui/Input';
import { Callout } from '@/components/common/Callout';
import { useGlobalRulesStore } from '@/store/global-rules.store';
import { toast } from 'sonner';
import type { ExpiryRule } from '@/types/global-rules.types';

export default function ExpiryRulesTab() {
  const { expiryRules, updateExpiryRule, toggleExpiryRule } = useGlobalRulesStore();
  const [editing, setEditing] = useState<ExpiryRule | null>(null);
  const [editRule, setEditRule] = useState('');

  const openEdit = (rule: ExpiryRule) => {
    setEditing(rule);
    setEditRule(rule.rule);
  };

  const handleSave = () => {
    if (!editing) return;
    updateExpiryRule(editing.id, { rule: editRule });
    toast.success(`Updated: ${editing.name}`);
    setEditing(null);
  };

  return (
    <div className="space-y-5">
      <Callout variant="info">
        Expiry and retention rules determine how long data is kept before automatic cleanup. These comply with data privacy regulations.
      </Callout>

      <SectionCard title="Expiry &amp; Retention Policies">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Policy</th>
                <th className="pb-2 pr-4 font-medium w-40">Rule</th>
                <th className="pb-2 pr-4 font-medium w-20">Active</th>
                <th className="pb-2 font-medium w-16">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {expiryRules.map((rule) => (
                <RuleRow
                  key={rule.id}
                  label={rule.name}
                  description={rule.description}
                  value={rule.rule}
                  enabled={rule.is_active}
                  onToggle={() => toggleExpiryRule(rule.id)}
                  onEdit={() => openEdit(rule)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Rules Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        {expiryRules.map((r) => (
          <div key={r.id} className="flex items-center gap-2 p-2 rounded-lg border border-border bg-card">
            <span className={`w-2 h-2 rounded-full ${r.is_active ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
            <div>
              <p className="font-medium">{r.name}</p>
              <p className="text-muted-foreground">{r.rule}</p>
            </div>
          </div>
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
            {editing.description && (
              <p className="text-xs text-muted-foreground">{editing.description}</p>
            )}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Rule
              </label>
              <Input
                value={editRule}
                onChange={(e) => setEditRule(e.target.value)}
              />
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
}
