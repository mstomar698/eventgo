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
import { toCanvas } from 'html-to-image';
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
  BiExpand,
  BiCollapse,
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

const makeEdge = (src: string, tgt: string) => ({
  id: `e${src}-${tgt}`,
  source: src,
  target: tgt,
  type: 'smoothstep',
  arrowHeadType: 'arrowclosed',
});

const W = 200; // node width
const H = 100; // node height
const COL_GAP = 240; // horizontal gap between columns
const ROW_GAP = 140; // vertical gap between rows

// Place nodes in a 2-column grid, with single-width nodes centred
const gridLayout = (
  items: Array<{ label: string; type?: string; color?: string; wide?: boolean }>
) => {
  const nodes: any[] = [];
  const edges: any[] = [];
  let row = 0;
  let i = 0;

  while (i < items.length) {
    const item = items[i];
    // Wide nodes (title / output) sit centred
    if (item.wide || item.type === 'input' || item.type === 'output') {
      const id = String(nodes.length + 1);
      nodes.push({
        id,
        type: item.type,
        data: { label: item.label },
        position: { x: COL_GAP / 2, y: row * ROW_GAP },
        style: item.color
          ? { border: `2px solid ${item.color}`, borderRadius: '8px', width: W + COL_GAP }
          : { width: W + COL_GAP },
      });
      i++;
    } else {
      // Pair two items side-by-side
      const left = items[i];
      const right = items[i + 1];
      const leftId = String(nodes.length + 1);
      nodes.push({
        id: leftId,
        data: { label: left.label },
        position: { x: 0, y: row * ROW_GAP },
        style: left.color
          ? { border: `2px solid ${left.color}`, borderRadius: '8px', width: W }
          : { width: W },
      });
      if (right && !right.wide && right.type !== 'input' && right.type !== 'output') {
        const rightId = String(nodes.length + 1);
        nodes.push({
          id: rightId,
          data: { label: right.label },
          position: { x: COL_GAP, y: row * ROW_GAP },
          style: right.color
            ? { border: `2px solid ${right.color}`, borderRadius: '8px', width: W }
            : { width: W },
        });
        i += 2;
      } else {
        i++;
      }
    }
    row++;
  }

  // Connect sequentially (each node → the next)
  for (let j = 0; j < nodes.length - 1; j++) {
    edges.push(makeEdge(nodes[j].id, nodes[j + 1].id));
  }

  return { nodes, edges };
};

const buildThemeNodes = (theme: any): { nodes: any[]; edges: any[] } => {
  const palette: string[] = theme.colorPalette?.length
    ? theme.colorPalette
    : ['#14b8a6', '#8b5cf6', '#f97316', '#22c55e', '#f43f5e', '#06b6d4'];

  let ci = 0;
  const nextColor = () => palette[ci++ % palette.length];

  const titleLabel = theme.description
    ? `${theme.title}\n${theme.description}`
    : theme.title;

  const items: Array<{ label: string; type?: string; color?: string; wide?: boolean }> = [
    { label: titleLabel, type: 'input' },
  ];

  if (theme.occasion)
    items.push({ label: `Occasion\n${theme.occasion}`, color: nextColor() });
  if (theme.mood?.length)
    items.push({ label: `Mood\n${theme.mood.join(' · ')}`, color: nextColor() });
  if (theme.events?.length)
    items.push({ label: `Activities\n${theme.events.join(' · ')}`, color: nextColor() });
  if (theme.decor?.length)
    items.push({ label: `Decor\n${theme.decor.join(' · ')}`, color: nextColor() });
  if (theme.music?.length)
    items.push({ label: `Music\n${theme.music.join(' · ')}`, color: nextColor() });
  if (theme.food?.length)
    items.push({ label: `Food & Drinks\n${theme.food.join(' · ')}`, color: nextColor() });
  if (theme.budgetEstimate) {
    const bl = theme.budgetNotes
      ? `Budget: $${theme.budgetEstimate}\n${theme.budgetNotes}`
      : `Budget: $${theme.budgetEstimate}`;
    items.push({ label: bl, color: nextColor(), wide: true });
  }
  if (theme.checklist?.length) {
    const items2 =
      theme.checklist.slice(0, 4).join('\n') + (theme.checklist.length > 4 ? '\n…' : '');
    items.push({
      label: `Checklist (${theme.checklist.length} items)\n${items2}`,
      color: nextColor(),
    });
  }
  if (theme.timeline?.length) {
    const phases = theme.timeline
      .map((p: any) => `${p.phase} — ${p.daysBefore}d before`)
      .join('\n');
    items.push({ label: `Timeline\n${phases}`, color: nextColor() });
  }

  items.push({ label: 'Event Ready!', type: 'output' });

  return gridLayout(items);
};

const buildTemplateNodes = (template: any): { nodes: any[]; edges: any[] } => {
  const items: Array<{ label: string; type?: string; color?: string; wide?: boolean }> =
    [];

  items.push({
    label: `${template.name}${template.category ? `\n${template.category} event` : ''}`,
    type: 'input',
  });

  (template.timeline ?? []).forEach((phase: any) => {
    const taskLines = (phase.tasks ?? []).slice(0, 3).join('\n');
    items.push({
      label: `${phase.phase}${phase.daysBefore > 0 ? ` — ${phase.daysBefore}d before` : ' — Day of event'}\n${taskLines}`,
    });
  });

  if (template.checklist?.length) {
    items.push({
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
    items.push({ label: `Budget — $${total} total\n${lines}`, wide: true });
  }

  if (template.vendorNeeds?.length) {
    items.push({
      label: `Vendor Needs\n${template.vendorNeeds.join(' · ')}`,
      wide: true,
    });
  }

  items.push({ label: 'Event Ready!', type: 'output' });

  return gridLayout(items);
};

const Flowchart = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
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

  const ts = () => new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

  const bgColor = () =>
    getComputedStyle(document.documentElement).getPropertyValue('--app-surface').trim() ||
    '#111c33';

  const downloadBlob = (content: string, filename: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const captureImage = async (): Promise<string> => {
    const flowEl =
      (containerRef.current?.querySelector('.react-flow') as HTMLElement) ??
      containerRef.current;
    if (!flowEl) throw new Error('No element');

    const dpr = 2;

    // Read viewport transform so edges are drawn in the right coordinate space
    const viewportEl = flowEl.querySelector('.react-flow__viewport') as HTMLElement;
    const matrix = new DOMMatrix(getComputedStyle(viewportEl).transform);
    const tx = matrix.e;
    const ty = matrix.f;
    const sc = matrix.a; // uniform scale

    // Record actual rendered node dimensions from the DOM before capture
    const nodeRects: Record<string, { w: number; h: number }> = {};
    flowEl.querySelectorAll('.react-flow__node').forEach((el) => {
      const id = el.getAttribute('data-id') ?? '';
      if (id)
        nodeRects[id] = {
          w: (el as HTMLElement).offsetWidth || 200,
          h: (el as HTMLElement).offsetHeight || 80,
        };
    });

    // Capture node content as canvas (edges SVG unreliable via html-to-image)
    const base = await toCanvas(flowEl, { backgroundColor: bgColor(), pixelRatio: dpr });
    const ctx = base.getContext('2d')!;

    // Resolve edge color from CSS variable
    const edgeColor =
      getComputedStyle(document.documentElement).getPropertyValue('--app-muted').trim() ||
      '#94a3b8';

    // Draw each edge as a bezier curve on top of the captured canvas
    ctx.save();
    ctx.scale(dpr, dpr); // match html-to-image's pixelRatio
    ctx.translate(tx, ty);
    ctx.scale(sc, sc);
    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = 1.5;
    ctx.fillStyle = edgeColor;

    edges.forEach((edge: any) => {
      const srcNode = nodes.find((n: any) => n.id === edge.source);
      const tgtNode = nodes.find((n: any) => n.id === edge.target);
      if (!srcNode || !tgtNode) return;

      const sw = nodeRects[edge.source]?.w ?? srcNode.width ?? 200;
      const sh = nodeRects[edge.source]?.h ?? srcNode.height ?? 80;
      const tw = nodeRects[edge.target]?.w ?? tgtNode.width ?? 200;

      const x1 = srcNode.position.x + sw / 2;
      const y1 = srcNode.position.y + sh;
      const x2 = tgtNode.position.x + tw / 2;
      const y2 = tgtNode.position.y;
      const my = (y1 + y2) / 2;

      // Smooth-step bezier
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.bezierCurveTo(x1, my, x2, my, x2, y2);
      ctx.stroke();

      // Arrowhead at target
      const as = 7;
      ctx.save();
      ctx.translate(x2, y2);
      ctx.rotate(Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-as / 2, -as);
      ctx.lineTo(as / 2, -as);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    ctx.restore();
    return base.toDataURL('image/png');
  };

  const handleExportPng = async () => {
    setExportError(null);
    setShowImageMenu(false);
    try {
      const dataUrl = await captureImage();
      const a = document.createElement('a');
      a.download = `eventgo-plan-${ts()}.png`;
      a.href = dataUrl;
      a.click();
    } catch {
      setExportError('Image export failed. Please try again.');
    }
  };

  const handleExportPdf = async () => {
    setExportError(null);
    setShowImageMenu(false);
    try {
      const dataUrl = await captureImage();
      const flowEl =
        (containerRef.current?.querySelector('.react-flow') as HTMLElement) ??
        containerRef.current!;
      const w = flowEl.offsetWidth;
      const h = flowEl.offsetHeight;
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation: w > h ? 'landscape' : 'portrait',
        unit: 'px',
        format: [w, h],
      });
      pdf.addImage(dataUrl, 'PNG', 0, 0, w, h);
      pdf.save(`eventgo-plan-${ts()}.pdf`);
    } catch {
      setExportError('PDF export failed. Please try again.');
    }
  };

  const handleExportJson = () => {
    setShowImageMenu(false);
    const data = JSON.stringify({ nodes: sanitizeNodes(nodes), edges }, null, 2);
    downloadBlob(data, `eventgo-plan-${ts()}.json`, 'application/json');
  };

  const handleExportMd = () => {
    setShowImageMenu(false);
    const lines: string[] = ['# Event Plan\n'];
    nodes.forEach((node) => {
      const raw: string = node.data?.label || '';
      const [title, ...rest] = raw
        .split('\n')
        .map((s: string) => s.trim())
        .filter(Boolean);
      if (node.type === 'input') {
        lines.push(`## ${title}\n`);
        rest.forEach((l) => lines.push(`> ${l}\n`));
      } else if (node.type === 'output') {
        lines.push(`\n---\n\n## ✅ ${title}\n`);
      } else {
        lines.push(`### ${title}`);
        rest.forEach((l) => lines.push(`- ${l}`));
        lines.push('');
      }
    });
    downloadBlob(lines.join('\n'), `eventgo-plan-${ts()}.md`, 'text/markdown');
  };

  const handleExportTxt = () => {
    setShowImageMenu(false);
    const sep = '─'.repeat(40);
    const lines: string[] = ['EVENT PLAN', sep, ''];
    nodes.forEach((node, idx) => {
      const raw: string = node.data?.label || '';
      lines.push(`[${idx + 1}] ${raw.replace(/\n/g, ' | ')}`);
    });
    downloadBlob(lines.join('\n'), `eventgo-plan-${ts()}.txt`, 'text/plain');
  };

  const toggleFullscreen = () => {
    if (!boardRef.current) return;
    if (!document.fullscreenElement) {
      boardRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const proOptions = { hideAttribution: true };

  const toolbarBtnClass =
    'inline-flex items-center gap-1.5 rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2 text-xs font-medium text-[var(--app-text)] transition hover:bg-[var(--app-surface)] focus:outline-none';

  return (
    <div
      ref={boardRef}
      className={`flex w-full flex-col rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] ${isFullscreen ? 'h-screen' : 'h-[60vh] sm:h-[75vh]'}`}
    >
      {exportError && (
        <div className="bg-red-500/20 px-3 py-2 text-xs text-red-400 border-b border-red-500/30">
          {exportError}
        </div>
      )}
      {/* Flow canvas — overflow-hidden here, not on parent, so toolbar dropdowns aren't clipped */}
      <div className="relative flex-1 overflow-hidden" ref={containerRef}>
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

      {/* Toolbar — scrollable on mobile so buttons never wrap off-screen */}
      <div
        className="flex items-center gap-2 overflow-x-auto border-t border-[var(--app-border)] bg-[var(--app-elevated)] px-3 py-2.5 scrollbar-none"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
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

        {/* Fullscreen */}
        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          className={toolbarBtnClass}
        >
          {isFullscreen ? <BiCollapse size={14} /> : <BiExpand size={14} />}
        </button>

        {/* Export dropdown */}
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
            <div className="absolute bottom-full right-0 z-20 mb-2 w-48 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-1.5 shadow-xl">
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--app-muted)]">
                Image
              </p>
              <button
                type="button"
                onClick={handleExportPng}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
              >
                🖼 PNG — board snapshot
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
              >
                📄 PDF — printable document
              </button>
              <div className="my-1 border-t border-[var(--app-border)]" />
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--app-muted)]">
                Data
              </p>
              <button
                type="button"
                onClick={handleExportJson}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
              >
                {'{ }'} JSON — raw board data
              </button>
              <button
                type="button"
                onClick={handleExportMd}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
              >
                # Markdown — structured doc
              </button>
              <button
                type="button"
                onClick={handleExportTxt}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--app-text)] transition hover:bg-[var(--app-elevated)]"
              >
                ≡ TXT — plain text summary
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
