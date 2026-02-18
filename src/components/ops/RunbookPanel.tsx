// ──────────────────────────────────────
// Runbook Panel Component — Phase 8
// ──────────────────────────────────────

import { cn } from '@/lib/utils';
import { Runbook } from '@/types/incident.types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  CheckCircle, 
  PlayCircle, 
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useState } from 'react';

interface RunbookPanelProps {
  runbook: Runbook;
  completedStepOrders?: number[];
  onCompleteStep?: (stepOrder: number) => void;
  className?: string;
}

export function RunbookPanel({
  runbook,
  completedStepOrders = [],
  onCompleteStep,
  className,
}: RunbookPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const completedCount = completedStepOrders.length;
  const totalSteps = runbook.steps.length;
  const progress = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  return (
    <div className={cn('rounded-lg border bg-card', className)}>
      {/* Header */}
      <button
        className="flex w-full items-center justify-between p-4 text-left"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/20">
            <FileText className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h3 className="font-semibold">{runbook.name}</h3>
            <p className="text-xs text-muted-foreground">
              {completedCount} of {totalSteps} steps completed
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">
            ~{runbook.estimated_resolution_minutes} min
          </Badge>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Progress bar */}
      <div className="px-4 pb-2">
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-violet-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      {isExpanded && (
        <div className="border-t">
          {runbook.steps.map((step, index) => {
            const isCompleted = step.is_completed || completedStepOrders.includes(step.order);
            const isFirst = index === 0;
            const prevStepCompleted = isFirst || runbook.steps[index - 1]?.is_completed || completedStepOrders.includes(runbook.steps[index - 1]?.order);
            const canComplete = !isCompleted && prevStepCompleted;

            return (
              <div
                key={step.order}
                className={cn(
                  'flex items-start gap-3 p-4 border-b last:border-b-0',
                  isCompleted && 'bg-emerald-500/5'
                )}
              >
                {/* Step number & icon */}
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm',
                    isCompleted
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : canComplete
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-muted bg-muted text-muted-foreground'
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step.order
                  )}
                </div>

                {/* Step content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn(
                      'font-medium text-sm',
                      isCompleted && 'line-through text-muted-foreground'
                    )}>
                      {step.title}
                    </p>
                    {step.action_type === 'command' && (
                      <Badge variant="secondary" className="text-[10px]">
                        Command
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                </div>

                {/* Action */}
                {onCompleteStep && !isCompleted && canComplete && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0"
                    onClick={() => onCompleteStep(step.order)}
                  >
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Complete
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
