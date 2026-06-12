// textNode.js

import { useState, useMemo, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const textareaRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 200, height: 80 });
  const updateNodeField = useStore((s) => s.updateNodeField);

  useEffect(() => {
    setCurrText(data?.text || '{{input}}');
  }, [data?.text]);

  const handleChange = (e) => {
    setCurrText(e.target.value);
    updateNodeField(id, 'text', e.target.value);
  };

  const variables = useMemo(() => {
    const vars = [];
    let match;
    while ((match = VAR_REGEX.exec(currText)) !== null) {
      if (!vars.includes(match[1])) vars.push(match[1]);
    }
    return vars;
  }, [currText]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const newHeight = Math.max(80, el.scrollHeight + 60);
    const newWidth = Math.max(200, Math.min(400, currText.length * 3 + 200));
    setDimensions({ width: newWidth, height: newHeight });
  }, [currText]);

  return (
    <div className="base-node node-text" style={{ minWidth: dimensions.width, minHeight: dimensions.height }}>
      <div className="node-header">
        <span className="node-icon">📝</span>
        <span className="node-title">Text</span>
      </div>
      <div className="node-body">
        <label className="node-field">
          <span>Text</span>
          <textarea
            ref={textareaRef}
            value={currText}
            onChange={handleChange}
            rows={1}
            className="node-textarea"
          />
        </label>
      </div>
      {variables.map((v, i) => (
        <Handle
          key={`${id}-var-${v}`}
          type="target"
          position={Position.Left}
          id={`${id}-${v}`}
          style={{ top: `${((i + 1) / (variables.length + 1)) * 100}%` }}
          className="handle-target"
        />
      ))}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        className="handle-source"
      />
    </div>
  );
};
