import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

export const TextUpdaterNode = () => {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="text-updater-node">
      <div className="border-2 border-solid border-green-500 rounded-sm text-red-500 flex flex-col text-center">
        <label htmlFor="text">Theme</label>
        <input
          id="text"
          name="text"
          onChange={onChange}
          className="nodrag px-1"
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
      <div className="border-2 border-solid border-green-500 rounded-sm text-red-500 flex flex-col text-center">
        <label htmlFor="data">Details</label>
        <textarea
          id="data"
          name="data"
          onChange={onChange}
          className="nodrag px-1 h-auto"
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
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />

      <div className="border-2 border-solid border-green-500 rounded-sm text-red-500 flex flex-col text-center">
        <input
          id="data"
          name="data"
          onChange={onChange}
          className="nodrag px-1"
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
      <div className="border-2 border-solid border-green-500 rounded-sm text-red-500 flex flex-col text-center">
        <input
          id="data"
          name="data"
          onChange={onChange}
          className="nodrag px-1"
          placeholder="node name"
        />
      </div>
    </div>
  );
};

const Nodes = { TextStrip, NodeWithText, NodeWithSAD, TextUpdaterNode };
export default Nodes;
