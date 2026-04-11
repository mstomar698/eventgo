'use client';
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
import html2canvas from 'html2canvas';
import { useSession } from 'next-auth/react';
import {
  BiPlus,
  BiText,
  BiDetail,
  BiChevronDown,
  BiImage,
  BiLogIn,
  BiLogOut,
  BiNote,
  BiStrikethrough,
} from 'react-icons/bi';
import { initialNodesForDemoTheme } from '../../lib/flowschemas/initialnodes';
import { initialEdgesForDemoTheme } from '../../lib/flowschemas/initialedges';
import Nodes from '../../lib/flowschemas/nodes';

const nodeTypes = {
  textUpdater: Nodes.TextUpdaterNode,
  nodesad: Nodes.NodeWithSAD,
  nodetext: Nodes.NodeWithText,
  textstrip: Nodes.TextStrip,
};

const Flowchart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<any[]>(initialNodesForDemoTheme);
  const [edges, setEdges] = useState(initialEdgesForDemoTheme);
  const [nodeCount, setNodeCount] = useState(nodes.length);
  const [showMoreNodes, setShowMoreNodes] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const { data: session } = useSession();

  // Load flow from server
  useEffect(() => {
    if (session) {
      fetch('/api/flows')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data.nodes && data.data.edges) {
            setNodes(data.data.nodes);
            setEdges(data.data.edges);
          }
        })
        .catch(console.error);
    }
  }, [session]);

  // Save flow to server
  useEffect(() => {
    if (session && nodes.length > 0) {
      fetch('/api/flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      }).catch(console.error);
    }
  }, [nodes, edges, session]);

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
  const onConnect = useCallback(
    (params: any) => setEdges((eds: any): any => addEdge(params, eds)),
    []
  );

  const addNode = (type?: string) => {
    const id = (nodes.length + 1).toString();
    const label = type === 'input' ? 'Input' : type === 'output' ? 'Output' : 'Node';
    const newNode = {
      id,
      ...(type ? { type } : {}),
      data: { label: <>{`${label} ${id}`}</> },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    };
    setNodes((prev) => [...prev, newNode]);
    setNodeCount((c) => c + 1);
  };

  const handleExportImage = (
    ref: React.RefObject<HTMLDivElement | null>,
    filename: string
  ) => {
    const el = ref.current;
    if (!el) return;
    html2canvas(el, { width: el.offsetWidth, height: el.offsetHeight }).then((canvas) => {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
    setShowImageMenu(false);
  };

  const proOptions = { hideAttribution: true };

  const toolbarBtnClass =
    'inline-flex items-center gap-1.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-xs font-medium text-[var(--app-text)] transition hover:bg-[var(--app-surface)] focus:outline-none';

  return (
    <div className="flex h-[75vh] w-full flex-col overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)]">
      {/* Flow canvas */}
      <div className="relative flex-1" ref={containerRef}>
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          proOptions={proOptions}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          ref={flowRef}
        >
          <Background color="var(--app-muted)" gap={20} size={1} />
          <Controls className="!border-[var(--app-border)] !bg-[var(--app-elevated)] !shadow-lg [&>button]:!border-[var(--app-border)] [&>button]:!bg-[var(--app-elevated)] [&>button]:!fill-[var(--app-text)] hover:[&>button]:!bg-[var(--app-surface)]" />
          {/* Node counter badge */}
          <div className="absolute left-2 top-2 z-10 rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-1.5 text-xs font-medium text-[var(--app-muted)]">
            {nodeCount} nodes
          </div>
        </ReactFlow>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-t border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2.5">
        {/* Primary node actions */}
        <button type="button" onClick={() => addNode()} className={toolbarBtnClass}>
          <BiPlus size={14} /> Event
        </button>
        <button
          type="button"
          onClick={() => addNode('textUpdater')}
          className={toolbarBtnClass}
        >
          <BiText size={14} /> Text
        </button>
        <button
          type="button"
          onClick={() => addNode('nodesad')}
          className={toolbarBtnClass}
        >
          <BiDetail size={14} /> Details
        </button>

        {/* More nodes dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowMoreNodes((v) => !v);
              setShowImageMenu(false);
            }}
            className={toolbarBtnClass}
          >
            More <BiChevronDown size={14} />
          </button>
          {showMoreNodes && (
            <div className="absolute bottom-full left-0 z-20 mb-2 w-44 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  addNode('input');
                  setShowMoreNodes(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
              >
                <BiLogIn size={14} /> Input Node
              </button>
              <button
                type="button"
                onClick={() => {
                  addNode('output');
                  setShowMoreNodes(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
              >
                <BiLogOut size={14} /> Output Node
              </button>
              <button
                type="button"
                onClick={() => {
                  addNode('nodetext');
                  setShowMoreNodes(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
              >
                <BiNote size={14} /> Text Node
              </button>
              <button
                type="button"
                onClick={() => {
                  addNode('textstrip');
                  setShowMoreNodes(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
              >
                <BiStrikethrough size={14} /> Text Strip
              </button>
            </div>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Export image dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowImageMenu((v) => !v);
              setShowMoreNodes(false);
            }}
            className={toolbarBtnClass}
          >
            <BiImage size={14} /> Export <BiChevronDown size={14} />
          </button>
          {showImageMenu && (
            <div className="absolute bottom-full right-0 z-20 mb-2 w-44 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => handleExportImage(containerRef, 'flowColored.png')}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
              >
                Full board image
              </button>
              <button
                type="button"
                onClick={() => handleExportImage(flowRef, 'flowChart.png')}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
              >
                Flowchart only
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flowchart;
