// The page's signature element: instead of a decorative network-of-dots
// illustration, each node is labelled with a real skill/interest tag, and
// edges only connect nodes that would actually share a tag — i.e. this *is*
// the product's matching idea rendered as a picture, not a stock graphic.
const NODES = [
  { id: "ml", label: "ML", x: 90, y: 60 },
  { id: "design", label: "Design", x: 260, y: 40 },
  { id: "you", label: "You", x: 190, y: 150, self: true },
  { id: "growth", label: "Growth", x: 340, y: 130 },
  { id: "backend", label: "Backend", x: 60, y: 190 },
  { id: "product", label: "Product", x: 300, y: 220 },
  { id: "research", label: "Research", x: 130, y: 260 },
];

const EDGES = [
  ["you", "ml"], ["you", "design"], ["you", "growth"],
  ["you", "backend"], ["you", "product"], ["you", "research"],
  ["ml", "research"], ["design", "product"],
];

export default function SignalGraph() {
  const find = (id) => NODES.find((n) => n.id === id);
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      {EDGES.map(([a, b], i) => {
        const na = find(a), nb = find(b);
        return (
          <line
            key={i}
            x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
            stroke="#3634E0"
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />
        );
      })}
      {NODES.map((n) => (
        <g key={n.id}>
          <circle
            cx={n.x} cy={n.y}
            r={n.self ? 30 : 26}
            fill={n.self ? "#3634E0" : "#F6F4EE"}
            stroke={n.self ? "#3634E0" : "#3634E0"}
            strokeOpacity={n.self ? 1 : 0.3}
            strokeWidth="1.5"
          />
          <text
            x={n.x} y={n.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="font-mono"
            fontSize="11"
            fill={n.self ? "#F6F4EE" : "#14161F"}
          >
            {n.label}
          </text>
        </g>
      ))}
      <circle cx={190} cy={150} r="46" fill="none" stroke="#F2A93B" strokeWidth="1.5" strokeDasharray="3 5">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 190 150"
          to="360 190 150"
          dur="18s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
