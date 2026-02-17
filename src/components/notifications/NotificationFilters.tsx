import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface NotificationFiltersProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  search: string;
  onSearchChange: (val: string) => void;
  priority: string;
  onPriorityChange: (val: string) => void;
}

const tabs: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'alert', label: 'Alerts' },
  { value: 'system', label: 'System' },
  { value: 'shop', label: 'Shops' },
  { value: 'contract', label: 'Contracts' },
  { value: 'visitor', label: 'Visitors' },
  { value: 'complaint', label: 'Complaints' },
];

const priorities: { value: string; label: string }[] = [
  { value: 'all', label: 'All Priority' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export function NotificationFilters({
  activeTab, onTabChange, search, onSearchChange, priority, onPriorityChange,
}: NotificationFiltersProps) {
  return (
    <div className="space-y-3">
      {/* Tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={cn(
              'shrink-0 px-3 py-1.5 rounded-md text-xs font-lexend transition-colors',
              activeTab === tab.value
                ? 'bg-brand text-white'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + priority */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-2 text-xs font-lexend"
        >
          {priorities.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
