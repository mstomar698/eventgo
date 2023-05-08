import Link from 'next/link';

const heroEdges: any[] = [
  {
    id: 'e1',
    source: 'n1',
    target: 'n2',
    arrowHeadType: 'arrowclosed',
    style: {
      strokeDasharray: '4 ',
      stroke: 'hsl(204, 58%, 39%)',
    },
  },
  {
    id: 'e2',
    animated: true,
    style: {
      stroke: 'hsl(204, 58%, 39%)',
    },
    source: 'n1',
    target: 'n3',
  },
  {
    id: 'e3',
    source: 'n3',
    target: 'n4',
    style: {
      stroke: 'hsl(204, 58%, 39%)',
    },
    animated: true,
    label: 'you are at the right place 🏠',
  },
  {
    id: 'e4',
    source: 'n4',
    target: 'n8',
    animated: true,
    style: {
      stroke: 'hsl(204, 58%, 39%)',
    },
    arrowHeadType: 'arrowclosed',
  },
  {
    id: 'e6',
    source: 'n4',
    style: {
      stroke: 'hsl(204, 58%, 39%)',
    },
    animated: true,
    target: 'n6',
  },
  {
    id: 'e7',
    source: 'n4',
    style: {
      stroke: 'hsl(204, 58%, 39%)',
    },
    animated: true,
    target: 'n7',
  },
];

const heroNodes: any[] = [
  {
    id: 'n1',
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
    id: 'n2',
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
    id: 'n3',
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
    id: 'n4',
    position: { x: 200, y: 200 },
    data: {
      label: 'Than you can',
    },
  },
  // {
  //   id: 'n5',
  //   type: 'output',
  //   data: {
  //     label: 'Create Schedule for events and share it with your friends',
  //   },
  //   position: { x: 230, y: 315 },
  // },
  {
    id: 'n6',
    type: 'output',
    data: {
      label: (
        <>
          Having trouble with event designing? <br />
          <strong>
            <a className="text-blue-500" href="#">
              let AI help you
            </a>
          </strong>
        </>
      ),
    },
    position: { x: 70, y: 325 },
  },
  {
    id: 'n7',
    type: 'output',
    data: {
      label: (
        <>
          Plan Your Whole event here and save and share it with help of{' '}
          <a className="text-green-500" href="#">
            React-flow and AI
          </a>
        </>
      ),
    },
    position: { x: 400, y: 320 },
  },
  {
    id: 'n8',
    type: 'output',
    data: {
      label: (
        <>
          <div className="justify-center items-center flex text-[24px]">
            <Link href={'#main'} className="text-active">
              Start Now !
            </Link>
          </div>
        </>
      ),
    },
    position: { x: 230, y: 338 },
  },
];

export { heroEdges, heroNodes };
