import { useState, useCallback } from 'react';
import ReactFlow, {
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { heroNodes, heroEdges } from '@/lib/schemas/';

const HomePage = () => {
  const [nodes, setNodes] = useState(heroNodes);
  const [edges, setEdges] = useState(heroEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds: any): any => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds: any): any => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div className="relative sm:top-[80px] lg:top-0 min-h-screen flex flex-col">
      <div className="h-screen bg-primary">
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
          panOnScroll={false}
          draggable={false}
          snapToGrid={false}
          fitView={true}
          className="pointer-events-none"
        >
          <div className="absolute bg-hero-pattern w-full h-full opacity-20 bg-cover bg-no-repeat bg-center"></div>
        </ReactFlow>
      </div>
    </div>
  );
};

export default HomePage;
