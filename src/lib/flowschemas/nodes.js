import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

export const TextUpdaterNode = () => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node">
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

export const NodeWithSAD = ({ isConnectable }) => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node">
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

export const NodeWithText = ({ isConnectable }) => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node">
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

export const TextStrip = () => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node">
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
