import { BaseEdge, EdgeProps, getSmoothStepPath } from 'reactflow';
// ...existing code...

export function FrictionEdge({ id, sourceX, sourceY, targetX, targetY }: EdgeProps) {
  const [edgePath] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY });

  return (
    <>
      <BaseEdge path={edgePath} style={{ stroke: '#EF4444', strokeWidth: 2 }} />
      {/* The Zig-Zag Pattern for Conflict */}
      <path d={edgePath} fill="none" stroke="#EF4444" strokeDasharray="5,5" />
      <text>
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle" className="fill-red-500 text-xs font-bold">
          FRICTION
        </textPath>
      </text>
    </>
  );
}

export function CutoffEdge({ id, sourceX, sourceY, targetX, targetY }: EdgeProps) {
  // Logic for a broken line with a gap in the middle
  const [edgePath] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY });
  return (
    <>
      <BaseEdge path={edgePath} style={{ stroke: '#F59E42', strokeWidth: 2 }} />
      {/* Dashed line with a gap in the middle for Cutoff */}
      <path d={edgePath} fill="none" stroke="#F59E42" strokeDasharray="10,10" />
      <text>
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle" className="fill-amber-500 text-xs font-bold">
          CUTOFF
        </textPath>
      </text>
    </>
  );
}
// ...existing code...

