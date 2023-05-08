import Link from 'next/link';
import { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  addEdge,
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
          <Background className='bg-hero-pattern  opacity-20'/>
        </ReactFlow>
      </div>
    </div>
  );
};

export default HomePage;
