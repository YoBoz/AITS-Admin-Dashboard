import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Route } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { TrolleyStatusBadge } from './TrolleyStatusBadge';
import { BatteryIndicator } from './BatteryIndicator';
import { TrolleyHealthScore } from './TrolleyHealthScore';
import { formatDistanceToNow } from 'date-fns';
import type { Trolley } from '@/types/trolley.types';

interface TrolleyCardProps {
  trolley: Trolley;
  onClick?: () => void;
}

export function TrolleyCard({ trolley, onClick }: TrolleyCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <Card
        className="p-4 cursor-pointer hover:border-brand/30 transition-colors"
        onClick={onClick || (() => navigate(`/dashboard/trolleys/${trolley.id}`))}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-mono text-sm font-bold text-foreground">{trolley.imei}</p>
            <p className="text-xs text-muted-foreground">{trolley.id} — {trolley.serial_number}</p>
          </div>
          <TrolleyStatusBadge status={trolley.status} />
        </div>

        {/* Battery & Health */}
        <div className="flex items-center justify-between mb-3">
          <BatteryIndicator
            level={trolley.battery}
            charging={trolley.status === 'charging'}
            size="sm"
          />
          <TrolleyHealthScore score={trolley.health_score} size="sm" showLabel={false} />
        </div>

        {/* Info */}
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3 w-3" />
            <span>{trolley.location.zone} {trolley.location.gate ? `— Gate ${trolley.location.gate}` : ''}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(trolley.last_seen), { addSuffix: true })}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Route className="h-3 w-3" />
            <span>{trolley.today_trips} trips today — {trolley.total_trips.toLocaleString()} total</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
