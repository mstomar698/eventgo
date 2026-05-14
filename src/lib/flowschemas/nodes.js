import { useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

const nodeWrap = 'relative min-w-[140px]';
const nodeBox =
  'rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] p-2 text-[var(--app-text)] flex flex-col text-center';
const inputCls =
  'nodrag mt-1 rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-1 text-xs text-[var(--app-text)] outline-none focus:ring-1 focus:ring-[var(--app-accent)] w-full';

const NodeDeleteButton = ({ nodeId }) => {
  const { setNodes } = useReactFlow();
  return (
    <button
      onClick={() => setNodes((nds) => nds.filter((n) => n.id !== nodeId))}
      className="absolute -right-2 -top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 text-xs font-bold"
      title="Delete node"
      type="button"
    >
      ×
    </button>
  );
};

const useUpdateLabel = (id) => {
  const { setNodes } = useReactFlow();
  return (value) =>
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: value } } : n))
    );
};

export const TextUpdaterNode = ({ id, data }) => {
  const updateLabel = useUpdateLabel(id);
  return (
    <div className={nodeWrap}>
      <NodeDeleteButton nodeId={id} />
      <div className={nodeBox}>
        <label className="text-xs font-semibold text-[var(--app-muted)]">Theme</label>
        <input
          className={inputCls}
          placeholder="e.g. Summer Vacation"
          value={data.label || ''}
          onChange={(e) => updateLabel(e.target.value)}
        />
      </div>
    </div>
  );
};

export const NodeWithSAD = ({ id, data, isConnectable }) => {
  const updateLabel = useUpdateLabel(id);
  return (
    <div className={nodeWrap}>
      <NodeDeleteButton nodeId={id} />
      <div className={nodeBox}>
        <label className="text-xs font-semibold text-[var(--app-muted)]">Details</label>
        <textarea
          className={`${inputCls} resize-none`}
          rows={3}
          placeholder="Add details…"
          value={data.label || ''}
          onChange={(e) => updateLabel(e.target.value)}
        />
      </div>
      <Handle
        type="target"
        position={Position.Top}
        id="a"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export const NodeWithText = ({ id, data, isConnectable }) => {
  const updateLabel = useUpdateLabel(id);
  return (
    <div className={nodeWrap}>
      <NodeDeleteButton nodeId={id} />
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className={nodeBox}>
        <input
          className={inputCls}
          placeholder="Node label"
          value={data.label || ''}
          onChange={(e) => updateLabel(e.target.value)}
        />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export const TextStrip = ({ id, data }) => {
  const updateLabel = useUpdateLabel(id);
  return (
    <div className={nodeWrap}>
      <NodeDeleteButton nodeId={id} />
      <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-accent)]/10 px-3 py-1.5">
        <input
          className="nodrag bg-transparent text-xs font-semibold text-[var(--app-accent)] outline-none w-full text-center"
          placeholder="Label"
          value={data.label || ''}
          onChange={(e) => updateLabel(e.target.value)}
        />
      </div>
    </div>
  );
};

export const ImageNode = ({ id, data, isConnectable }) => {
  const { setNodes } = useReactFlow();
  const [error, setError] = useState('');

  const updateLabel = (value) =>
    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: value } } : n))
    );

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 250 * 1024) {
      setError('Image must be under 250 KB');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onload = (ev) =>
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, imageUrl: ev.target.result } } : n
        )
      );
    reader.readAsDataURL(file);
  };

  return (
    <div className={`${nodeWrap} max-w-[220px]`}>
      <NodeDeleteButton nodeId={id} />
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div className={nodeBox}>
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt="node"
            className="nodrag max-h-36 w-full rounded object-cover"
          />
        ) : (
          <label className="nodrag flex cursor-pointer flex-col items-center gap-1 rounded border-2 border-dashed border-[var(--app-border)] p-3 text-xs text-[var(--app-muted)] hover:border-[var(--app-accent)]">
            <span>📷 Upload image</span>
            <span className="text-[10px]">Max 250 KB</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        )}
        {error && <p className="mt-1 text-[10px] text-red-400">{error}</p>}
        <input
          className={`${inputCls} mt-1`}
          placeholder="Caption (optional)"
          value={data.label || ''}
          onChange={(e) => updateLabel(e.target.value)}
        />
        {data.imageUrl && (
          <button
            type="button"
            className="nodrag mt-1 text-[10px] text-[var(--app-muted)] hover:text-red-400"
            onClick={() =>
              setNodes((nds) =>
                nds.map((n) =>
                  n.id === id ? { ...n, data: { ...n.data, imageUrl: undefined } } : n
                )
              )
            }
          >
            Remove image
          </button>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
};

const Nodes = { TextStrip, NodeWithText, NodeWithSAD, TextUpdaterNode, ImageNode };
export default Nodes;
