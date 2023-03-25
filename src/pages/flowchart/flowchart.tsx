import { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  addEdge,
} from 'reactflow';
import Link from 'next/link';
import 'reactflow/dist/style.css';
import { IoIosArrowDropup } from 'react-icons/io';
import { BsCheck, BsX } from 'react-icons/bs';
import classnames from 'classnames';
import html2canvas from 'html2canvas';
import { initialNodes } from '../../lib/flowschemas/initialnodes';
import { initialEdges } from '../../lib/flowschemas/initialedges';
import { BiArrowToLeft } from 'react-icons/bi';

const Flowchart = () => {
  const containerRef: any = useRef(null);
  const flowRef: any = useRef(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [nodeCount, setNodeCount] = useState(nodes.length);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const toggleDropdown = () => setIsOpen((prevState) => !prevState);

  const selectOption = (option: string) => {
    setSelectedOption(option);
    toggleDropdown();
  };

  const handleColorClick = () => {
    const container = containerRef.current;
    const imageWidth = container.offsetWidth;
    const imageHeight = container.offsetHeight;
    selectOption('Colored Image');
    html2canvas(container, { width: imageWidth, height: imageHeight }).then(
      (canvas) => {
        const dataURL = canvas.toDataURL('image/png');
        const img = new Image();
        img.src = dataURL;

        const link = document.createElement('a');
        link.download = 'flowColored.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        navigator.clipboard
          .writeText(dataURL)
          .then(() => console.log('Image copied to clipboard'))
          .catch((err) =>
            console.error('Could not copy image to clipboard:', err)
          );
      }
    );
  };
  const handleFlowClick = () => {
    const container = flowRef.current;
    const imageWidth = container.offsetWidth;
    const imageHeight = container.offsetHeight;
    selectOption('FlowChart Image');
    html2canvas(container, { width: imageWidth, height: imageHeight }).then(
      (canvas) => {
        const dataURL = canvas.toDataURL('image/png');
        const img = new Image();
        img.src = dataURL;

        const link = document.createElement('a');
        link.download = 'flowChart.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        navigator.clipboard
          .writeText(dataURL)
          .then(() => console.log('Image copied to clipboard'))
          .catch((err) =>
            console.error('Could not copy image to clipboard:', err)
          );
      }
    );
  };

  // retrieve node changes from local state
  useEffect(() => {
    const savedElements: any = JSON.stringify(
      localStorage.getItem('flowElements')
    );
    if (savedElements) {
      let savedElements2 = JSON.parse(savedElements);
      // console.log(savedElements2);
      // setNodes(savedElements);
      // const nodeIds = savedElements2//.map((el: any) =>
      //parseInt(el.id.split('-')[1])
      //);
      // setNodeCount(Math.max(...nodeIds));
      // console.log(nodeIds);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flowElements', JSON.stringify(nodes));
  }, [nodes]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds: any): any => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds: any): any => applyEdgeChanges(changes, eds)),
    []
  );

  //make connection
  const onConnect = useCallback(
    (params: any) => setEdges((eds: any): any => addEdge(params, eds)),
    []
  );

  // Add new node
  const handleAddNode = (event: any) => {
    event.preventDefault();
    const newNode = {
      id: (nodes.length + 1).toString(),
      data: { label: <>{`Node ${nodes.length + 1}`}</> },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    };

    setNodes((prevElements) => [...prevElements, newNode]);
    setNodeCount((prevCount) => prevCount + 1);
  };
  const handleAddText = (event: any) => {
    event.preventDefault();
    const newNode = {
      id: (nodes.length + 1).toString(),
      data: { label: <>{`Text ${nodes.length + 1}`}</> },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    };

    setNodes((prevElements) => [...prevElements, newNode]);
    setNodeCount((prevCount) => prevCount + 1);
  };
  const handleAddDetails = (event: any) => {
    event.preventDefault();
    const newNode = {
      id: (nodes.length + 1).toString(),
      data: { label: <>{`Details ${nodes.length + 1}`}</> },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    };

    setNodes((prevElements) => [...prevElements, newNode]);
    setNodeCount((prevCount) => prevCount + 1);
  };

  const proOptions = { hideAttribution: true };

  return (
    <div
      className="h-full max-sm:h-screen max-md:h-screen overflow-y-auto w-full my-1 flex flex-col text-center items-center justify-center  border-2 border-solid border-orange-500 rounded-sm text-white bg-gray-700"
      ref={containerRef}
    >
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        proOptions={proOptions}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        ref={flowRef}
      >
        <Background />
        <Controls />
        <div className="justify-between flex w-20 border-2 border-solid border-red-500">
          <span className="ml-0.5">{'theme'}</span>
          {/*NOTE: add redirected theme here  */}
          <span className="ml-0.5 border border-solid border-green-500">
            {nodeCount}
          </span>
        </div>
      </ReactFlow>
      <div className="w-full space-x-8 flex flex-row justify-between items-center p-0.5">
        <div className="relative p-0.5 max-sm:p-0 flex flex-row space-x-4 w-3/5 max-sm:w-full">
          <button
            onClick={handleAddNode}
            className="border-2 border-solid max-sm:p-0 border-red-500 p-1 text-xs flex items-center justify-center w-full py-2  font-medium text-gray-800 transition-colors duration-150 bg-gray-700 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray"
          >
            Add Event
          </button>
          <button
            onClick={handleAddText}
            className="border-2 border-solid max-sm:p-0 border-red-500 p-1 text-xs flex items-center justify-center w-full py-2  font-medium text-gray-800 transition-colors duration-150 bg-gray-700 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray"
          >
            Add Text
          </button>
          <button
            onClick={handleAddDetails}
            className="border-2 border-solid max-sm:p-1 border-red-500 p-1 text-xs flex items-center justify-center w-full py-2  font-medium text-gray-800 transition-colors duration-150 bg-gray-700 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray"
          >
            Add Details
          </button>
          <Link
            href="/"
            className="border-2 border-solid max-sm:p-1 border-red-500 p-1 text-xs flex items-center justify-center w-full py-2  font-medium text-gray-800 transition-colors duration-150 bg-gray-700 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray"
          >
            <button className="flex flex-row justify-between space-x-1">
              <BiArrowToLeft name="arrow-left" className="text-xl" />
              <span className="my-0.5">Home</span>
            </button>
          </Link>
        </div>
        <div className="relative p-0.5 ">
          <button
            className="border-2 border-solid border-red-500 p-1 text-xs flex items-center justify-center w-full py-2  font-medium text-gray-800 transition-colors duration-150 bg-gray-700 rounded-lg hover:bg-black focus:outline-none focus:shadow-outline-gray"
            onClick={toggleDropdown}
          >
            {selectedOption || (
              <>
                <span className="max-sm:hidden mr-1">Take</span> Image
              </>
            )}
            <IoIosArrowDropup className="ml-2 text-lg" />
          </button>
          {isOpen && (
            <div className="border-2 border-solid border-red-500 fixed bottom-20 left-3/4 max-sm:left-2/4 right-5 z-10 w-full py-2 mt-1 bg-gray-700 rounded-md shadow-lg">
              <button
                className={classnames(
                  'w-full px-4 py-2 text-left hover:bg-black focus:outline-none',
                  {
                    'bg-gray-700': selectedOption === 'Option 1',
                  }
                )}
                onClick={() => handleColorClick()}
              >
                <span className="mr-2">
                  {selectedOption === 'Colored Image' && (
                    <BsCheck className="inline-block w-4 h-4 text-green-500 max-sm:text-xs" />
                  )}
                </span>
                Colored Image
              </button>
              <button
                className={classnames(
                  'w-full px-4 py-2 text-left hover:bg-black focus:outline-none',
                  {
                    'bg-gray-700': selectedOption === 'Option 2',
                  }
                )}
                onClick={() => handleFlowClick()}
              >
                <span className="mr-2">
                  {selectedOption === 'FlowChart Image' && (
                    <BsCheck className="inline-block w-4 h-4 text-green-500" />
                  )}
                </span>
                FlowChart Image
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flowchart;
