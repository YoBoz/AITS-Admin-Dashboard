import { SectionCard } from '@/components/common/SectionCard';
import { formatNumber } from '@/lib/utils';

interface FlowNode {
  name: string;
  value: number;
  color: string;
}

// Simulated Sankey-like visualization using HTML/CSS
const sourceNodes: FlowNode[] = [
  { name: 'International Arrival', value: 4200, color: '#3B82F6' },
  { name: 'Domestic Arrival', value: 2800, color: '#10B981' },
  { name: 'International Transfer', value: 3100, color: '#8B5CF6' },
  { name: 'Domestic Departure', value: 1900, color: '#F59E0B' },
];

const destNodes: FlowNode[] = [
  { name: 'Duty Free', value: 3800, color: '#BE052E' },
  { name: 'Food Court', value: 2900, color: '#EF4444' },
  { name: 'Gates', value: 2700, color: '#6366F1' },
  { name: 'Lounges', value: 1500, color: '#EC4899' },
  { name: 'Retail', value: 1100, color: '#14B8A6' },
];

const totalSource = sourceNodes.reduce((s, n) => s + n.value, 0);
const totalDest = destNodes.reduce((s, n) => s + n.value, 0);

export function VisitorFlowSankey() {
  return (
    <SectionCard title="Visitor Flow" subtitle="From entry points to destinations">
      <div className="flex items-stretch gap-4 h-[250px]">
        {/* Source column */}
        <div className="flex flex-col gap-1 w-[140px] shrink-0">
          {sourceNodes.map((node) => {
            const heightPct = (node.value / totalSource) * 100;
            return (
              <div
                key={node.name}
                className="rounded-md flex items-center justify-center px-2 transition-all"
                style={{
                  flex: heightPct,
                  backgroundColor: `${node.color}20`,
                  borderLeft: `3px solid ${node.color}`,
                }}
              >
                <div className="text-center">
                  <div className="text-[10px] font-poppins font-semibold text-foreground leading-tight">
                    {node.name}
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    {formatNumber(node.value)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Flow lines SVG */}
        <div className="flex-1 relative min-w-[80px]">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            {sourceNodes.map((src, si) => {
              const srcY = (sourceNodes.slice(0, si).reduce((s, n) => s + n.value, 0) / totalSource) * 100;
              const srcH = (src.value / totalSource) * 100;
              return destNodes.map((dst, di) => {
                const dstY = (destNodes.slice(0, di).reduce((s, n) => s + n.value, 0) / totalDest) * 100;
                const dstH = (dst.value / totalDest) * 100;
                const flow = (src.value * dst.value) / (totalSource * totalDest) * 100;
                return (
                  <path
                    key={`${si}-${di}`}
                    d={`M 0 ${srcY + srcH / 2} C 50 ${srcY + srcH / 2}, 50 ${dstY + dstH / 2}, 100 ${dstY + dstH / 2}`}
                    fill="none"
                    stroke={src.color}
                    strokeWidth={Math.max(0.5, flow * 0.15)}
                    opacity={0.4}
                  />
                );
              });
            })}
          </svg>
        </div>

        {/* Destination column */}
        <div className="flex flex-col gap-1 w-[140px] shrink-0">
          {destNodes.map((node) => {
            const heightPct = (node.value / totalDest) * 100;
            return (
              <div
                key={node.name}
                className="rounded-md flex items-center justify-center px-2 transition-all"
                style={{
                  flex: heightPct,
                  backgroundColor: `${node.color}20`,
                  borderRight: `3px solid ${node.color}`,
                }}
              >
                <div className="text-center">
                  <div className="text-[10px] font-poppins font-semibold text-foreground leading-tight">
                    {node.name}
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground">
                    {formatNumber(node.value)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}
