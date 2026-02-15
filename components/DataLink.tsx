import React from 'react';
import { getBezierPath, EdgeProps } from 'reactflow';

// Bowen edge style logic
function getBowenEdgeStyle(data: any) {
  if (data?.dynamic === 'CUTOFF') {
    return {
      className: 'stroke-warning stroke-[2px] stroke-dasharray-[10,6]',
      color: '#F59E42',
      label: 'CUTOFF',
    };
  }
  if (data?.dynamic === 'FUSION') {
    return {
      className: 'stroke-primary stroke-[4px]',
      color: '#D4AF37',
      label: 'FUSION',
    };
  }
  if (data?.isGlitch || data?.dynamic === 'FRICTION') {
    return {
      className: 'stroke-destructive stroke-[2px] stroke-dasharray-[5,5]',
      color: '#EF4444',
      label: 'FRICTION',
    };
  }
  return {
    className: 'stroke-slate-800 stroke-[1px]',
    color: '#334155',
    label: '',
  };
}

export default function DataLink({ id, sourceX, sourceY, targetX, targetY, data, markerEnd }: EdgeProps) {
  const [path] = getBezierPath({ sourceX, sourceY, targetX, targetY });
  const style = getBowenEdgeStyle(data);

  return (
    <g>
      <path
        id={id}
        d={path}
        className={style.className}
        fill="none"
        markerEnd={markerEnd}
      />
      {style.label && (
        <text>
          <textPath href={`#${id}`} startOffset="50%" textAnchor="middle" className={`fill-[${style.color}] text-xs font-bold`}>
            {style.label}
          </textPath>
        </text>
      )}
      {data?.isGlitch && (
        <circle>
          <animateMotion dur="2s" repeatCount="indefinite">
            <mpath xlinkHref={`#${id}`} />
          </animateMotion>
          <animate attributeName="r" values="3;6;3" dur="1s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
}
