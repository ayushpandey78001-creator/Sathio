// A radial "signal strength" gauge used for both rating score and match score.
// Chosen instead of a generic progress bar because the product's whole idea
// is about tuning into the right frequency of person — so scores read as signal.
export default function SignalGauge({ value, size = 64, stroke = 6, color = "#3634E0", label }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, value)) / 100) * circumference;

  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} className="-rotate-90 shrink-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E4E0D6"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
          className="font-mono"
          fontSize={size * 0.28}
          fill="#14161F"
          fontWeight="500"
        >
          {value}
        </text>
      </svg>
      {label && (
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-ink/50">{label}</p>
        </div>
      )}
    </div>
  );
}
