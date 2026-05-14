import { useCallback } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

const NodeDeleteButton = ({ nodeId }) => {
  const { setNodes } = useReactFlow();
  return (
    <button
      onClick={() => setNodes((nds) => nds.filter((node) => node.id !== nodeId))}
      className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 text-xs font-bold"
      title="Delete node"
      type="button"
    >
      ×
    </button>
  );
};

export const TextUpdaterNode = ({ id }) => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node relative">
      <NodeDeleteButton nodeId={id} />
      <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] p-2 text-[var(--app-text)] flex flex-col text-center">
        <label htmlFor="text" className="text-xs font-semibold text-[var(--app-muted)]">
          Theme
        </label>
        <input
          id="text"
          name="text"
          onChange={onChange}
          className="nodrag mt-1 rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-1 text-xs text-[var(--app-text)] outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
          placeholder="Summer Vacation"
        />
      </div>
    </div>
  );
};

export const NodeWithSAD = ({ id, isConnectable }) => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node relative">
      <NodeDeleteButton nodeId={id} />
      <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] p-2 text-[var(--app-text)] flex flex-col text-center">
        <label htmlFor="data" className="text-xs font-semibold text-[var(--app-muted)]">
          Details
        </label>
        <textarea
          id="data"
          name="data"
          onChange={onChange}
          className="nodrag mt-1 h-auto rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-1 text-xs text-[var(--app-text)] outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
          placeholder="Some Data"
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

export const NodeWithText = ({ id, isConnectable }) => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node relative">
      <NodeDeleteButton nodeId={id} />
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] p-2 text-[var(--app-text)] flex flex-col text-center">
        <input
          id="data"
          name="data"
          onChange={onChange}
          className="nodrag rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-1 text-xs text-[var(--app-text)] outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
          placeholder="node name"
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

export const TextStrip = ({ id }) => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node relative">
      <NodeDeleteButton nodeId={id} />
      <div className="rounded-lg border border-[var(--app-border)] bg-[var(--app-elevated)] p-2 text-[var(--app-text)] flex flex-col text-center">
        <input
          id="data"
          name="data"
          onChange={onChange}
          className="nodrag rounded border border-[var(--app-border)] bg-[var(--app-surface)] px-2 py-1 text-xs text-[var(--app-text)] outline-none focus:ring-1 focus:ring-[var(--app-accent)]"
          placeholder="node name"
        />
      </div>
    </div>
  );
};

const Nodes = { TextStrip, NodeWithText, NodeWithSAD, TextUpdaterNode };
export default Nodes;
