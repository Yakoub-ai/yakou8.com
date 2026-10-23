import { useInViewOnce } from "@/hooks/use-in-view-once";

interface Group {
  group: string;
  short: string;
  items: string[];
}

const W = 960;
const H = 560;
const CENTER = { x: 500, y: 280 };

// Left branch fans its leaves over the left side, right branch over the right.
const layout = [
  { hub: { x: 380, y: 280 }, radius: 190, from: 118, to: 242, side: "left" as const },
  { hub: { x: 660, y: 280 }, radius: 170, from: 50, to: -50, side: "right" as const },
];

const charW = 7.4;

const leafPositions = (count: number, l: (typeof layout)[number]) =>
  Array.from({ length: count }, (_, i) => {
    const deg = count === 1 ? (l.from + l.to) / 2 : l.from + ((l.to - l.from) * i) / (count - 1);
    const rad = (deg * Math.PI) / 180;
    return { x: l.hub.x + l.radius * Math.cos(rad), y: l.hub.y - l.radius * Math.sin(rad) };
  });

const curve = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const mx = a.x + (b.x - a.x) * 0.5;
  return `M${a.x} ${a.y} C${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`;
};

// Mind map from 900px, connector tree below that. The tree is the
// semantic version and stays readable to screen readers on every width.
const StackMap = ({ groups }: { groups: Group[] }) => {
  const [ref, drawn] = useInViewOnce<HTMLDivElement>(0.35);
  let step = 0;

  return (
    <div ref={ref} className="stack" data-drawn={drawn}>
      <svg className="stack-map" viewBox={`0 0 ${W} ${H}`} aria-hidden>
        {groups.slice(0, layout.length).map((g, gi) => {
          const l = layout[gi];
          const leaves = leafPositions(g.items.length, l);
          const hubW = g.short.length * charW + 28;
          return (
            <g key={g.group} className="branch">
              <path className="link" pathLength={1} d={`M${CENTER.x} ${CENTER.y} L${l.hub.x} ${l.hub.y}`} />
              {g.items.map((item, i) => {
                const p = leaves[i];
                const delay = 120 + step++ * 45;
                const left = l.side === "left";
                return (
                  <g key={item} className="leaf" style={{ "--d": `${delay}ms` } as React.CSSProperties}>
                    <path className="link" pathLength={1} d={curve(l.hub, p)} />
                    <circle cx={p.x} cy={p.y} r={3} />
                    <text x={left ? p.x - 12 : p.x + 12} y={p.y} textAnchor={left ? "end" : "start"}>
                      {item}
                    </text>
                  </g>
                );
              })}
              <g className="hub">
                <rect x={l.hub.x - hubW / 2} y={l.hub.y - 16} width={hubW} height={32} rx={16} />
                <text x={l.hub.x} y={l.hub.y} textAnchor="middle">
                  {g.short}
                </text>
              </g>
            </g>
          );
        })}
        <g className="core">
          <rect x={CENTER.x - 44} y={CENTER.y - 18} width={88} height={36} rx={18} />
          <text x={CENTER.x} y={CENTER.y} textAnchor="middle">
            STACK
          </text>
        </g>
      </svg>

      <ul className="stack-tree">
        <li>
          <span className="tree-root">Stack</span>
          <ul>
            {groups.map((g) => (
              <li key={g.group}>
                <span className="tree-branch">{g.group}</span>
                <ul>
                  {g.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default StackMap;
