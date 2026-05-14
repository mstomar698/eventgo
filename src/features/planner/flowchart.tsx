'use client';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  BiPhotoAlbum,
} from 'react-icons/bi';
import ConfirmModal from '@/components/ui/confirm-modal';
import { initialNodesForDemoTheme } from '../../lib/flowschemas/initialnodes';
import { initialEdgesForDemoTheme } from '../../lib/flowschemas/initialedges';
import Nodes from '../../lib/flowschemas/nodes';

const nodeTypes = {
  default: Nodes.EditableNode,
  input: Nodes.EditableInputNode,
  output: Nodes.EditableOutputNode,
  textUpdater: Nodes.TextUpdaterNode,
  nodesad: Nodes.NodeWithSAD,
  nodetext: Nodes.NodeWithText,
  textstrip: Nodes.TextStrip,
  imageNode: Nodes.ImageNode,
};

const GAP = 130;

const makeEdge = (src: string, tgt: string) => ({
  id: `e${src}-${tgt}`,
  source: src,
  target: tgt,
  type: 'smoothstep',
  arrowHeadType: 'arrowclosed',
});

const buildThemeNodes = (theme: any): { nodes: any[]; edges: any[] } => {
  const palette: string[] = theme.colorPalette?.length
    ? theme.colorPalette
    : ['#14b8a6', '#8b5cf6', '#f97316', '#22c55e', '#f43f5e', '#06b6d4'];

  const steps: Array<{ label: string; type?: string; color?: string }> = [];
  let ci = 0;
  const nextColor = () => palette[ci++ % palette.length];

  // Node 1 — title + description (input, no custom border)
  const titleLabel = theme.description
    ? `${theme.title}\n${theme.description}`
    : theme.title;
  steps.push({ label: titleLabel, type: 'input' });

  // One node per field
  if (theme.occasion) {
    steps.push({ label: `Occasion\n${theme.occasion}`, color: nextColor() });
  }
  if (theme.mood?.length) {
    steps.push({ label: `Mood\n${theme.mood.join(' · ')}`, color: nextColor() });
  }
  if (theme.events?.length) {
    steps.push({ label: `Activities\n${theme.events.join(' · ')}`, color: nextColor() });
  }
  if (theme.decor?.length) {
    steps.push({ label: `Decor\n${theme.decor.join(' · ')}`, color: nextColor() });
  }
  if (theme.music?.length) {
    steps.push({ label: `Music\n${theme.music.join(' · ')}`, color: nextColor() });
  }
  if (theme.food?.length) {
    steps.push({ label: `Food & Drinks\n${theme.food.join(' · ')}`, color: nextColor() });
  }
  if (theme.budgetEstimate) {
    const bl = theme.budgetNotes
      ? `Budget: $${theme.budgetEstimate}\n${theme.budgetNotes}`
      : `Budget: $${theme.budgetEstimate}`;
    steps.push({ label: bl, color: nextColor() });
  }
  if (theme.checklist?.length) {
    const items =
      theme.checklist.slice(0, 4).join('\n') + (theme.checklist.length > 4 ? '\n…' : '');
    steps.push({
      label: `Checklist (${theme.checklist.length} items)\n${items}`,
      color: nextColor(),
    });
  }
  if (theme.timeline?.length) {
    const phases = theme.timeline
      .map((p: any) => `${p.phase} — ${p.daysBefore}d before`)
      .join('\n');
    steps.push({ label: `Timeline\n${phases}`, color: nextColor() });
  }

  steps.push({ label: 'Event Ready!', type: 'output' });

  const nodes = steps.map((s, i) => ({
    id: String(i + 1),
    type: s.type,
    data: { label: s.label },
    position: { x: 300, y: i * GAP },
    ...(s.color
      ? { style: { border: `2px solid ${s.color}`, borderRadius: '8px' } }
      : {}),
  }));

  const edges = nodes.slice(0, -1).map((n, i) => makeEdge(n.id, String(i + 2)));
  return { nodes, edges };
};

const buildTemplateNodes = (template: any): { nodes: any[]; edges: any[] } => {
  const steps: Array<{ label: string; type?: string }> = [];

  steps.push({
    label: `${template.name}\n${template.category ? template.category + ' event' : ''}`,
    type: 'input',
  });

  (template.timeline ?? []).forEach((phase: any) => {
    const taskLines = (phase.tasks ?? []).slice(0, 3).join('\n');
    steps.push({
      label: `${phase.phase}${phase.daysBefore > 0 ? ` — ${phase.daysBefore} days before` : ' — Day of event'}\n${taskLines}`,
    });
  });

  if (template.checklist?.length) {
    steps.push({
      label: `Checklist (${template.checklist.length} items)\n${template.checklist.slice(0, 3).join('\n')}${template.checklist.length > 3 ? '\n…' : ''}`,
    });
  }

  if (template.budgetCategories?.length) {
    const total = template.budgetCategories.reduce(
      (s: number, c: any) => s + c.estimatedAmount,
      0
    );
    const lines = template.budgetCategories
      .slice(0, 3)
      .map((c: any) => `${c.category}: $${c.estimatedAmount}`)
      .join('\n');
    steps.push({ label: `Budget — $${total} total\n${lines}` });
  }

  if (template.vendorNeeds?.length) {
    steps.push({ label: `Vendor Needs\n${template.vendorNeeds.join(' · ')}` });
  }

  steps.push({ label: 'Event Ready!', type: 'output' });

  const nodes = steps.map((s, i) => ({
    id: String(i + 1),
    type: s.type,
    data: { label: s.label },
    position: { x: 300, y: i * GAP },
  }));

  const edges = nodes.slice(0, -1).map((n, i) => makeEdge(n.id, String(i + 2)));

  return { nodes, edges };
};

const Flowchart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
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
  // Prevents the save effect from overwriting the server state before the initial load completes
  const loadedRef = useRef(false);

  // Load flow from server or from a theme/template URL param
  useEffect(() => {
    if (!session) return;

    const themeId = searchParams?.get('theme');
    const templateId = searchParams?.get('template');

    if (themeId) {
      fetch(`/api/themes?id=${themeId}`)
        .then((r) => r.json())
        .then((d) => {
          const theme = d?.data ?? d;
          if (theme?.title) {
            const { nodes: n, edges: e } = buildThemeNodes(theme);
            setNodes(sanitizeNodes(n));
            setEdges(e);
            router.replace('/planner');
          }
        })
        .catch(console.error)
        .finally(() => {
          loadedRef.current = true;
        });
      return;
    }

    if (templateId) {
      fetch(`/api/templates/${templateId}`)
        .then((r) => r.json())
        .then((d) => {
          const template = d?.data ?? d;
          if (template?.name) {
            const { nodes: n, edges: e } = buildTemplateNodes(template);
            setNodes(sanitizeNodes(n));
            setEdges(e);
            router.replace('/planner');
          }
        })
        .catch(console.error)
        .finally(() => {
          loadedRef.current = true;
        });
      return;
    }

    fetch('/api/flows')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.nodes && data.data.edges) {
          const loadedNodes = Array.isArray(data.data.nodes) ? data.data.nodes : [];
          setNodes(sanitizeNodes(loadedNodes));
          setEdges(data.data.edges);
        }
      })
      .catch(console.error)
      .finally(() => {
        loadedRef.current = true;
      });
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setNodeCount(nodes.length);
  }, [nodes]);

  // Save flow to server — guarded by loadedRef so initial demo nodes never overwrite saved state
  useEffect(() => {
    if (!loadedRef.current || !session) return;
    fetch('/api/flows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodes: sanitizeNodes(nodes), edges }),
    }).catch(console.error);
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
      const bgColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue('--app-surface')
          .trim() || '#111c33';
      const canvas = await html2canvas(el, {
        width: el.offsetWidth,
        height: el.offsetHeight,
        scale: 2,
        useCORS: true,
        backgroundColor: bgColor,
        foreignObjectRendering: true,
        logging: false,
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
              <button
                type="button"
                onClick={() => {
                  addNode('imageNode');
                  setShowMoreNodes(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
              >
                <BiPhotoAlbum size={14} /> Image Node
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
