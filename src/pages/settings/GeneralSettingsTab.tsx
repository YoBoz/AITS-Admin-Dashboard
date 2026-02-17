import { useEffect, useState } from 'react';
import { SettingsSection } from '@/components/settings/SettingsSection';
import { useSettingsStore } from '@/store/settings.store';

interface Props {
  onDirty: (dirty: boolean) => void;
  onSave: () => void;
}

const timezones = [
  'UTC-5 (Eastern)', 'UTC-4 (Atlantic)', 'UTC+0 (GMT)', 'UTC+1 (CET)',
  'UTC+2 (EET)', 'UTC+3 (AST)', 'UTC+4 (GST)', 'UTC+5 (PKT)',
  'UTC+5:30 (IST)', 'UTC+8 (CST)', 'UTC+9 (JST)', 'UTC+10 (AEST)',
];

const dateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
const currencies = [
  { value: 'AED', label: 'AED (د.إ)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
];

export default function GeneralSettingsTab({ onDirty }: Props) {
  const store = useSettingsStore();
  const [localState, setLocalState] = useState({
    timezone: store.timezone,
    dateFormat: store.dateFormat,
    timeFormat: store.timeFormat,
    currency: store.currency,
  });

  useEffect(() => {
    const isDirty =
      localState.timezone !== store.timezone ||
      localState.dateFormat !== store.dateFormat ||
      localState.timeFormat !== store.timeFormat ||
      localState.currency !== store.currency;
    onDirty(isDirty);
  }, [localState, store, onDirty]);

  const update = <K extends keyof typeof localState>(key: K, value: (typeof localState)[K]) => {
    setLocalState((s) => ({ ...s, [key]: value }));
    store.updateSetting(key, value as never);
  };

  return (
    <div className="space-y-6">
      {/* Timezone */}
      <SettingsSection title="Time Zone">
        <select
          value={localState.timezone}
          onChange={(e) => update('timezone', e.target.value)}
          className="w-full sm:w-64 rounded-md border border-border bg-background px-3 py-2 text-sm font-lexend focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {timezones.map((tz) => (
            <option key={tz} value={tz}>{tz}</option>
          ))}
        </select>
      </SettingsSection>

      {/* Date Format */}
      <SettingsSection title="Date Format">
        <div className="flex flex-wrap gap-3">
          {dateFormats.map((fmt) => (
            <label key={fmt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="dateFormat"
                value={fmt}
                checked={localState.dateFormat === fmt}
                onChange={() => update('dateFormat', fmt)}
                className="h-4 w-4 text-primary accent-primary"
              />
              <span className="text-sm font-lexend">{fmt}</span>
            </label>
          ))}
        </div>
      </SettingsSection>

      {/* Time Format */}
      <SettingsSection title="Time Format">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="timeFormat"
              value="12h"
              checked={localState.timeFormat === '12h'}
              onChange={() => update('timeFormat', '12h')}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm font-lexend">12 Hour (AM/PM)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="timeFormat"
              value="24h"
              checked={localState.timeFormat === '24h'}
              onChange={() => update('timeFormat', '24h')}
              className="h-4 w-4 accent-primary"
            />
            <span className="text-sm font-lexend">24 Hour</span>
          </label>
        </div>
      </SettingsSection>

      {/* Currency */}
      <SettingsSection
        title="Currency Display"
        description="Affects any monetary values shown in dashboard."
      >
        <select
          value={localState.currency}
          onChange={(e) => update('currency', e.target.value)}
          className="w-full sm:w-48 rounded-md border border-border bg-background px-3 py-2 text-sm font-lexend focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {currencies.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </SettingsSection>
    </div>
  );
}
