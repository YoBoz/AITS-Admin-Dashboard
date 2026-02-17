
interface TrolleyMapMarkerProps {
  x: number;
  y: number;
  status: 'active' | 'idle' | 'charging' | 'maintenance';
  battery: number;
  selected?: boolean;
  onClick?: () => void;
}

export function TrolleyMapMarker({
  x,
  y,
  status,
  battery,
  selected = false,
  onClick,
}: TrolleyMapMarkerProps) {
  const color =
    battery < 20 ? '#f59e0b' :
    status === 'active' ? '#10b981' :
    status === 'charging' ? '#3b82f6' :
    status === 'maintenance' ? '#f59e0b' :
    '#9ca3af';

  return (
    <g onClick={onClick} style={{ cursor: 'pointer' }}>
      {/* Pulse animation for active trolleys */}
      {status === 'active' && (
        <circle cx={x} cy={y} r={10} fill={color} opacity={0.2}>
          <animate
            attributeName="r"
            values="6;12;6"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.3;0.05;0.3"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      {/* Selection ring */}
      {selected && (
        <circle
          cx={x}
          cy={y}
          r={10}
          fill="none"
          stroke="#BE052E"
          strokeWidth={2}
          strokeDasharray="3 2"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`0 ${x} ${y}`}
            to={`360 ${x} ${y}`}
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      {/* Main dot */}
      <circle cx={x} cy={y} r={6} fill={color} stroke="white" strokeWidth={1.5} />
    </g>
  );
}
