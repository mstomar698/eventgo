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
  BiRefresh,
} from 'react-icons/bi';
import ConfirmModal from '@/components/ui/confirm-modal';
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

  const sanitizeNodes = (items: any[]) =>
    items.map((node) => {
      const rawLabel = node?.data?.label;
      const label = typeof rawLabel === 'string' ? rawLabel : 'Node';

      return {
        ...node,
        data: {
          ...(node.data ?? {}),
          label,
        },
      };
    });
  const [nodeCount, setNodeCount] = useState(initialNodesForDemoTheme.length);
  const [showMoreNodes, setShowMoreNodes] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showNewBoardConfirm, setShowNewBoardConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Load flow from server
  useEffect(() => {
    if (session) {
      fetch('/api/flows')
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data.nodes && data.data.edges) {
            const loadedNodes = Array.isArray(data.data.nodes) ? data.data.nodes : [];
            setNodes(sanitizeNodes(loadedNodes));
            setEdges(data.data.edges);
          }
        })
        .catch(console.error);
    }
  }, [session]);

  useEffect(() => {
    setNodeCount(nodes.length);
  }, [nodes]);

  // Save flow to server
  useEffect(() => {
    if (session && nodes.length > 0) {
      fetch('/api/flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes: sanitizeNodes(nodes), edges }),
      }).catch(console.error);
    }
  }, [nodes, edges, session]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds: any): any => sanitizeNodes(applyNodeChanges(changes, nds))),
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
      data: { label: `${label} ${id}` },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    };
    setNodes((prev) => sanitizeNodes([...prev, newNode]));
    setNodeCount((c) => c + 1);
  };

  const handleNewBoard = async () => {
    setIsSubmitting(true);
    try {
      setNodes([]);
      setEdges([]);
      setShowNewBoardConfirm(false);
    } catch (error) {
      console.error('Error creating new board:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportImage = async (
    ref: React.RefObject<HTMLDivElement | null>,
    filename: string
  ) => {
    const el = ref.current;
    if (!el) return;

    setExportError(null);
    try {
      const canvas = await html2canvas(el, {
        width: el.offsetWidth,
        height: el.offsetHeight,
        scale: 2,
        useCORS: true,
        backgroundColor: 'var(--app-surface)',
        foreignObjectRendering: true,
      });

      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Export failed:', error);
      setExportError('Failed to export image. Please try again.');
    } finally {
      setShowImageMenu(false);
    }
  };

  const proOptions = { hideAttribution: true };

  const toolbarBtnClass =
    'inline-flex items-center gap-1.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-xs font-medium text-[var(--app-text)] transition hover:bg-[var(--app-surface)] focus:outline-none';

  return (
    <div className="flex h-[75vh] w-full flex-col overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)]">
      {exportError && (
        <div className="bg-red-500/20 px-3 py-2 text-xs text-red-400 border-b border-red-500/30">
          {exportError}
        </div>
      )}
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
        {/* New Board */}
        <button
          type="button"
          onClick={() => setShowNewBoardConfirm(true)}
          className={`${toolbarBtnClass} text-amber-500 hover:text-amber-600`}
        >
          <BiRefresh size={14} /> New Board
        </button>

        <div className="h-4 w-px bg-[var(--app-border)]" />

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

      {/* New Board Confirmation Modal */}
      <ConfirmModal
        isOpen={showNewBoardConfirm}
        onClose={() => setShowNewBoardConfirm(false)}
        onConfirm={handleNewBoard}
        title="Create new board"
        message="This will clear all nodes and edges. Are you sure you want to start a fresh board?"
        confirmLabel="Create new"
        danger
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Flowchart;
