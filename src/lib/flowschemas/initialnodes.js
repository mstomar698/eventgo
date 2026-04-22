export const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: {
      label: 'Summer Ends',
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
    type: 'input',
    data: {
      label: 'Event Concept',
    },
    position: { x: 100, y: 0 },
  },
  {
    id: '2',
    data: {
      label: 'Set Date & Time',
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    data: {
      label: 'Choose Venue',
    },
    position: { x: 300, y: 100 },
  },
  {
    id: '4',
    data: {
      label: 'Create Guest List',
    },
    position: { x: 500, y: 100 },
  },
  {
    id: '5',
    data: {
      label: 'Plan Budget',
    },
    position: { x: 100, y: 200 },
  },
  {
    id: '6',
    data: {
      label: 'Book Vendors',
    },
    position: { x: 300, y: 200 },
  },
  {
    id: '7',
    data: {
      label: 'Send Invitations',
    },
    position: { x: 500, y: 200 },
  },
  {
    id: '8',
    data: {
      label: 'Plan Menu & Decor',
    },
    position: { x: 100, y: 300 },
  },
  {
    id: '9',
    data: {
      label: 'Create Timeline',
    },
    position: { x: 300, y: 300 },
  },
  {
    id: '10',
    data: {
      label: 'Day-Of Checklist',
    },
    position: { x: 500, y: 300 },
  },
  {
    id: '11',
    type: 'output',
    data: {
      label: 'Event Ready!',
    },
    position: { x: 300, y: 400 },
  },
];
