export const initialEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    arrowHeadType: 'arrowclosed',
    style: {
      strokeDasharray: '4 ',
    },
  },
  { id: 'e1-3', source: '1', target: '3' },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    animated: true,
    label: 'animated edge',
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    arrowHeadType: 'arrowclosed',
    label: 'edge with arrow head',
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
    type: 'smoothstep',
    label: 'smooth step edge',
  },
  {
    id: 'e5-7',
    source: '5',
    target: '7',
    type: 'step',
    style: { stroke: '#f6ab6c' },
    label: 'a step edge',
    animated: true,
    labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
  },
];

export const initialEdgesForDemoTheme = [
  {
    id: 'e1-2',
    source: '5',
    target: '2',
    arrowHeadType: 'arrowclosed',
  },
  { id: 'e1-3', source: '6', target: '3' },
  {
    id: 'e1-4',
    source: '7',
    target: '4',
  },
  {
    id: 'e1-5',
    source: '4',
    target: '5',
    arrowHeadType: 'arrowclosed',
  },
  {
    id: 'e1-6',
    source: '5',
    target: '6',
  },
  {
    id: 'e1-7',
    source: '6',
    target: '7',
  },
  {
    id: 'e1-8',
    source: '7',
    target: '8',
  },
  {
    id: 'e1-9',
    source: '8',
    target: '9',
  },
  {
    id: 'e1-10',
    source: '9',
    target: '11',
  },
  {
    id: 'e1-11',
    source: '9',
    target: '10',
  },
];
