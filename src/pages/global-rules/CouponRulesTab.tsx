// ──────────────────────────────────────
// Coupon Rules Tab — Phase 9
// ──────────────────────────────────────

import { useState } from 'react';
import { SectionCard } from '@/components/common/SectionCard';
import { RuleRow } from '@/components/global-rules/RuleRow';
import { FormModal } from '@/components/common/FormModal';
import { Input } from '@/components/ui/Input';
import { useGlobalRulesStore } from '@/store/global-rules.store';
import { Callout } from '@/components/common/Callout';
import { toast } from 'sonner';
import type { CouponRule } from '@/types/global-rules.types';

export default function CouponRulesTab() {
  const { couponRules, updateRule, toggleRule } = useGlobalRulesStore();
  const [editingRule, setEditingRule] = useState<CouponRule | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  const openEdit = (rule: CouponRule) => {
    setEditingRule(rule);
    setEditValue(String(rule.value));
  };

  const handleSave = () => {
    if (!editingRule) return;
    const numVal = Number(editValue);
    updateRule(editingRule.id, { value: isNaN(numVal) ? editValue : numVal });
    toast.success(`Updated: ${editingRule.name}`);
    setEditingRule(null);
  };

  return (
    <div className="space-y-5">
      <Callout variant="info">
        Coupon rules control global constraints on coupon creation and redemption across all merchants. Changes take effect immediately.
      </Callout>

      <SectionCard title="Coupon Constraints">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="pb-2 pr-4 font-medium">Rule</th>
                <th className="pb-2 pr-4 font-medium w-32">Value</th>
                <th className="pb-2 pr-4 font-medium w-20">Active</th>
                <th className="pb-2 font-medium w-16">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {couponRules.map((rule) => (
                <RuleRow
                  key={rule.id}
                  label={rule.name}
                  description={rule.description}
                  value={String(rule.value)}
                  unit={rule.scope}
                  enabled={rule.is_active}
                  onToggle={() => toggleRule(rule.id)}
                  onEdit={() => openEdit(rule)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Edit Modal */}
      {editingRule && (
        <FormModal
          open={!!editingRule}
          onOpenChange={(open) => { if (!open) setEditingRule(null); }}
          title={`Edit: ${editingRule.name}`}
          size="sm"
          footer={
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditingRule(null)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Save</button>
            </div>
          }
        >
          <div className="space-y-3">
            {editingRule.description && (
              <p className="text-xs text-muted-foreground">{editingRule.description}</p>
            )}
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                Value ({editingRule.scope})
              </label>
              <Input
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
}
