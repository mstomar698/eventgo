import { useState } from 'react';

export default function FlowForm() {
  const [nodes, setNodes] = useState([]);

  const handleAddNode = () => {
    setNodes((prevNodes: any) => [
      ...prevNodes,
      {
        id: String(Math.random()),
        data: { label: 'New node' },
        position: { x: 0, y: 0 },
      },
    ]);
  };

  const handleSaveFlow = async () => {
    try {
      const response = await fetch('/api/flow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes }),
      });

      if (response.ok) {
        console.log('Flow saved');
      } else {
        console.log('Flow not saved');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-green-500 text-red-500">
      <h1>Create Flow</h1>
      <button onClick={handleAddNode}>Add Node</button>
      <div>
        {nodes.map((node: any) => (
          <div key={node.id}>
            <input
              title="sa"
              type="text"
              value={node.data.label}
              onChange={(e) =>
                setNodes((prevNodes: any) =>
                  prevNodes.map((n: any) =>
                    n.id === node.id
                      ? { ...n, data: { label: e.target.value } }
                      : n
                  )
                )
              }
            />
          </div>
        ))}
      </div>
      <button onClick={handleSaveFlow}>Save Flow</button>
    </div>
  );
}
