export const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: {
      label: (
        <>
          Welcome to <strong>React Flow!</strong>
        </>
      ),
    },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: {
      label: (
        <>
          This is a <strong>default node</strong>
        </>
      ),
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: {
      label: (
        <>
          This one has a <strong>custom style</strong>
        </>
      ),
    },
    position: { x: 400, y: 100 },
    style: {
      background: '#D6D5E6',
      color: '#333',
      border: '1px solid #222138',
      width: 180,
    },
  },
  {
    id: '4',
    position: { x: 250, y: 200 },
    data: {
      label: 'Another default node',
    },
  },
  {
    id: '5',
    data: {
      label: 'Node id: 5',
    },
    position: { x: 250, y: 325 },
  },
  {
    id: '6',
    type: 'output',
    data: {
      label: (
        <>
          An <strong>output node</strong>
        </>
      ),
    },
    position: { x: 100, y: 480 },
  },
  {
    id: '7',
    type: 'output',
    data: { label: 'Another output node' },
    position: { x: 400, y: 450 },
  },
];

export const initialNodesForDemoTheme = [
  {
    id: '1',
    type: 'textUpdater',
    position: { x: 400, y: 0 },
    data: { value: 123 },
  },
  {
    id: '2',
    type: 'nodesad',
    position: { x: 100, y: 200 },
    data: { value: 123 },
  },
  {
    id: '3',
    type: 'nodesad',
    position: { x: 300, y: 200 },
    data: { value: 123 },
  },
  {
    id: '4',
    type: 'nodesad',
    position: { x: 500, y: 200 },
    data: { value: 123 },
  },
  {
    id: '5',
    type: 'input',
    data: {
      label: (
        <>
          Summer <strong>Starts!</strong>
        </>
      ),
    },
    position: { x: 100, y: 50 },
  },
  {
    id: '6',
    data: {
      label: (
        <>
          Prepare <strong>Schedule</strong>
        </>
      ),
    },
    position: { x: 300, y: 80 },
  },
  {
    id: '7',
    data: {
      label: (
        <>
          Have a <strong>Trip</strong>
        </>
      ),
    },
    position: { x: 500, y: 100 },
    style: {
      background: '#D6D5E6',
      color: '#333',
      border: '1px solid #222138',
      width: 180,
    },
  },
  {
    id: '8',
    position: { x: 700, y: 150 },
    data: {
      label: (
        <>
          Take Big <strong>Rest</strong>
        </>
      ),
    },
  },
  {
    id: '9',
    data: {
      label: (
        <>
          !! Complete <strong>HomeWork</strong>
        </>
      ),
    },
    position: { x: 700, y: 220 },
  },
  {
    id: '10',
    type: 'output',
    data: {
      label: (
        <>
          Summer <strong>Ends</strong>
        </>
      ),
    },
    position: { x: 700, y: 320 },
  },
  {
    id: '11',
    type: 'nodesad',
    data: {
      label: (
        <>
          Summer <strong>Ends</strong>
        </>
      ),
    },
    position: { x: 500, y: 320 },
  },
];
