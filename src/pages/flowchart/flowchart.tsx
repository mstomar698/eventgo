// import React, { useState } from 'react';

// import ReactFlow, {
//   //removeElements,
//   addEdge,
//   MiniMap,
//   Controls,
//   ControlButton,
//   Background,
//   updateEdge,
// } from 'reactFlow';
// import { initialElements } from './initial-elements';

// const onLoad = (reactFlowInstance) => {
//   console.log('flow loaded:', reactFlowInstance);
//   reactFlowInstance.fitView();
// };

// const Flow = () => {
//   const [elements, setElements] = useState(initialElements);
//   const onElementsRemove = (elementsToRemove) =>
//     setElements((els) => 'removeElements(elementsToRemove, els)');
//   const onConnect = (params) => setElements((els) => addEdge(params, els));
//   // gets called after end of edge gets dragged to another source or target
//   const onEdgeUpdate = (oldEdge, newConnection) =>
//     setElements((els) => updateEdge(oldEdge, newConnection, els));
//   return (
//     <div className="h-[1000px] w-full">
//       <ReactFlow
//         elements={elements}
//         onElementsRemove={onElementsRemove}
//         onConnect={onConnect}
//         onEdgeUpdate={onEdgeUpdate}
//         onLoad={onLoad}
//         snapToGrid={true}
//         snapGrid={[15, 15]}
//         onMove={(e) => console.log('moving')}
//       >
//         <MiniMap
//           nodeStrokeColor={(n) => {
//             if (n.style?.background) return n.style.background;
//             if (n.type === 'input') return '#0041d0';
//             if (n.type === 'output') return '#ff0072';
//             if (n.type === 'default') return '#1a192b';

//             return '#eee';
//           }}
//           nodeColor={(n) => {
//             if (n.style?.background) return n.style.background;

//             return '#fff';
//           }}
//           nodeBorderRadius={2}
//         />
//         <Controls onZoomIn={() => console.log('zoom in pressed')}>
//           <ControlButton onClick={() => console.log('action')}>h</ControlButton>
//         </Controls>
//         <Background color="#aaa" gap={16} />
//       </ReactFlow>
//     </div>
//   );
// };

// export default Flow;
import { useState, useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from 'reactflow';
import 'reactflow/dist/style.css';
import initialNodes from './initialnodes';
import initialEdges from './initialedges';

const Flowchart = () => {
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
    <div className="h-full max-sm:h-screen max-md:h-screen overflow-y-auto w-full my-1 flex flex-col text-center items-center justify-center  border-2 border-solid border-orange-500 rounded-sm text-white bg-gray-700">
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default Flowchart;
