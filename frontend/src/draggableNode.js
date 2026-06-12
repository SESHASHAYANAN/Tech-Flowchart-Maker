// draggableNode.js

import { useStore } from './store';

export const DraggableNode = ({ type, label }) => {
    const createNode = useStore((state) => state.createNode);

    const onDragStart = (event, nodeType) => {
      const appData = { nodeType };
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    const handleClick = () => {
      createNode(type);
    };
  
    return (
      <div
        className="draggable-node"
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        onClick={handleClick}
        draggable
      >
          <span>{label}</span>
      </div>
    );
  };