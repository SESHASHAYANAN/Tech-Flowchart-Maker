// BaseNode.js

import { Handle, Position } from 'reactflow';

const positionMap = {
  Left: Position.Left,
  Right: Position.Right,
  Top: Position.Top,
  Bottom: Position.Bottom,
};

export const BaseNode = ({ id, title, icon, handles = [], children, className = '' }) => {
  return (
    <div className={`base-node ${className}`}>
      <div className="node-header">
        {icon && <span className="node-icon">{icon}</span>}
        <span className="node-title">{title}</span>
      </div>
      {children && <div className="node-body">{children}</div>}
      {handles.map((h, i) => (
        <Handle
          key={h.id || `${id}-handle-${i}`}
          type={h.type}
          position={positionMap[h.position] || h.position}
          id={`${id}-${h.id}`}
          style={h.style}
          className={`handle-${h.type}`}
        />
      ))}
    </div>
  );
};
