// ──────────────────────────────────────
// Device Quarantine Tab — Phase 9 (S-02)
// ──────────────────────────────────────

import { useState, useMemo } from 'react';
import { SectionCard } from '@/components/common/SectionCard';
import { QuarantineStatusCard } from '@/components/compliance/QuarantineStatusCard';
import { useComplianceStore } from '@/store/compliance.store';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import QuarantineDeviceModal from './QuarantineDeviceModal';

export default function DeviceQuarantineTab() {
  const { quarantinedDevices, clearQuarantine } = useComplianceStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const activeDevices = useMemo(
    () => quarantinedDevices.filter((d) => d.status === 'active_quarantine' || d.status === 'under_investigation'),
    [quarantinedDevices],
  );

  const historicalDevices = useMemo(
    () => quarantinedDevices.filter((d) => d.status === 'cleared' || d.status === 'decommissioned'),
    [quarantinedDevices],
  );

  const handleClear = (device: typeof quarantinedDevices[0]) => {
    clearQuarantine(device.device_id, 'Current Admin', 'Cleared via compliance center.');
    toast.success(`Device ${device.device_imei} cleared from quarantine.`);
  };

  const handleInvestigate = (device: typeof quarantinedDevices[0]) => {
    const store = useComplianceStore.getState();
    const target = store.quarantinedDevices.find((d) => d.device_id === device.device_id);
    if (target && target.status === 'active_quarantine') {
      useComplianceStore.setState({
        quarantinedDevices: store.quarantinedDevices.map((d) =>
          d.device_id === device.device_id ? { ...d, status: 'under_investigation' as const } : d,
        ),
      });
      toast.info(`Device ${device.device_imei} moved to investigation.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Active Quarantines */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold font-lexend">Active Quarantines ({activeDevices.length})</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Quarantine Device
        </button>
      </div>

      {activeDevices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeDevices.map((device) => (
            <QuarantineStatusCard
              key={device.device_id}
              device={device}
              onInvestigate={handleInvestigate}
              onClear={handleClear}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
          No devices currently in quarantine.
        </div>
      )}

      {/* Historical */}
      <SectionCard title="Historical Quarantine Records" subtitle={`${historicalDevices.length} records`}>
        <div className="overflow-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-border">
              <tr>
                {['IMEI', 'Reason', 'Quarantined At', 'Duration', 'Cleared By', 'Outcome'].map((h) => (
                  <th key={h} className="px-3 py-2 text-left text-[10px] font-poppins font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {historicalDevices.map((device) => {
                const days = device.cleared_at
                  ? Math.ceil((new Date(device.cleared_at).getTime() - new Date(device.quarantined_at).getTime()) / (1000 * 60 * 60 * 24))
                  : '—';
                return (
                  <tr key={device.device_id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="px-3 py-2 font-mono">{device.device_imei}</td>
                    <td className="px-3 py-2 capitalize">{device.quarantine_reason.replace(/_/g, ' ')}</td>
                    <td className="px-3 py-2 text-muted-foreground">{new Date(device.quarantined_at).toLocaleDateString()}</td>
                    <td className="px-3 py-2 font-mono">{days} days</td>
                    <td className="px-3 py-2">{device.cleared_by || '—'}</td>
                    <td className="px-3 py-2 capitalize text-muted-foreground">{device.status.replace(/_/g, ' ')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {historicalDevices.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">No historical records.</div>
          )}
        </div>
      </SectionCard>

      <QuarantineDeviceModal open={showAddModal} onOpenChange={setShowAddModal} />
    </div>
  );
}
