import React, { useCallback } from 'react';
import ReactFlow, { Background, Controls, useNodesState, useEdgesState, OnSelectionChangeParams } from 'reactflow';
import 'reactflow/dist/style.css';

export function TopologyMap({ initialNodes, initialEdges, onSelectionChange }: any) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes); // Remove setNodes
  const [edges, , onEdgesChange] = useEdgesState(initialEdges); // Remove setEdges

  const handleSelectionChange = useCallback(({ nodes, edges }: OnSelectionChangeParams) => {
    if (nodes.length > 0) onSelectionChange(nodes[0].data);
    else if (edges.length > 0) onSelectionChange(edges[0].data);
    else onSelectionChange(null);
  }, [onSelectionChange]);

  return (
    <div className="w-full h-full bg-[#0F172A]">
      <ReactFlow
        nodes={nodes as any}
        edges={edges as any}
        onNodesChange={onNodesChange as any}
        onEdgesChange={onEdgesChange as any}
        onSelectionChange={handleSelectionChange}
        fitView
      >
        <Background color="#334155" gap={24} />
        <Controls className="bg-slate-800" />
      </ReactFlow>
    </div>
  );
}
