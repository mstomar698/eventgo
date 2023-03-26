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
import Link from 'next/link';
import 'reactflow/dist/style.css';
import { initialNodes } from '../../lib/flowschemas/initialdummynodes';
import { initialEdges } from '../../lib/flowschemas/initialdummyedges';

const HeroFlow = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

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
    <div className="h-full rounded-r-sm text-white bg-gray-700 ">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
      >
        <Background />
        <Controls style={{  top: '4px', left: '0px' }} />
        <div className="absolute left-1 text-xl h-16 text-center p-2 bottom-1 rounded-sm bg-gray-700 hover:bg-black z-10 justify-between flex w-auto border-2 border-solid border-red-500 ">
          <Link href={'/planner'} className="text-white m-1">
            {'Plan Your Event'}
          </Link>
        </div>
      </ReactFlow>
    </div>
  );
};

export default HeroFlow;
