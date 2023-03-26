export const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: {
      label: (
        <>
          Welcome to{' '}
          <strong>
            <span className="text-red-500">EventGO</span>
          </strong>
        </>
      ),
    },
    position: { x: 200, y: 0 },
  },
  {
    id: '2',
    type: 'output',
    data: {
      label: (
        <>
          Just a visitor{' '}
          <strong>
            <span className="text-red-500">👋</span>
          </strong>
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
          You are an{' '}
          <strong>
            <span className="text-green-500">event Planner</span>
          </strong>
        </>
      ),
    },
    position: { x: 300, y: 100 },
    style: {
      background: '#D6D5E6',
      color: '#333',
      border: '1px solid #222138',
      width: 180,
    },
  },
  {
    id: '4',
    position: { x: 200, y: 200 },
    data: {
      label: 'Than you can',
    },
  },
  {
    id: '5',
    type: 'output',
    data: {
      label: 'Create Schedule for events and share it with your friends',
    },
    position: { x: 230, y: 315 },
  },
  {
    id: '6',
    type: 'output',
    data: {
      label: (
        <>
          Having trouble with event designing? <br />
          <strong>
            <span className="text-blue-500">let AI help you</span>
          </strong>
        </>
      ),
    },
    position: { x: 70, y: 325 },
  },
  {
    id: '7',
    type: 'output',
    data: {
      label: (
        <>
          Plan Your Whole event here and save and share it with help of{' '}
          <span className="text-green-500">React-flow and AI</span>
        </>
      ),
    },
    position: { x: 400, y: 320 },
  },
];
