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
    style: {
      stroke: 'hsl(204, 91.66666666666669%, 52.94117647058824%)',
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
            <span className="text-red-500">Byee!👋</span>
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
            <span className="text-green-500">event planner</span>
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
      label: (
        <>
          <div>
            for event planners
            <br />
            <span className="text-green-500 font-semibold">we provide</span>
          </div>
        </>
      ),
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
          AI generated <br />
          <strong>
            <a className="text-blue-500" href="/recommend">
              recommendations
            </a>
          </strong>
        </>
      ),
    },
    position: { x: 0, y: 335 },
  },
  {
    id: 'n7',
    type: 'output',
    data: {
      label: (
        <>
          <a className="text-orange-500" href="/schedule">
            Scheduling
          </a>{' '}
          and <br />
          <a className="text-green-500" href="/planner">
            planning events
          </a>
        </>
      ),
    },
    position: { x: 400, y: 335 },
  },
  {
    id: 'n8',
    type: 'output',
    data: {
      label: (
        <>
          <div className="justify-center items-center  text-[20px]">
            or just <br />
            <Link href={'#main'} className="text-active active:text-secondary">
              Dive In😁
            </Link>
          </div>
        </>
      ),
    },
    position: { x: 200, y: 325 },
  },
];

export { heroEdges, heroNodes };
