// inputNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data?.inputType || 'Text');
  const updateNodeField = useStore((s) => s.updateNodeField);

  useEffect(() => {
    setCurrName(data?.inputName || id.replace('customInput-', 'input_'));
    setInputType(data?.inputType || 'Text');
  }, [data?.inputName, data?.inputType, id]);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    updateNodeField(id, 'inputName', e.target.value);
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
    updateNodeField(id, 'inputType', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Input"
      icon="📥"
      handles={[{ type: 'source', position: 'Right', id: 'value' }]}
    >
      <label className="node-field">
        <span>Name</span>
        <input type="text" value={currName} onChange={handleNameChange} />
      </label>
      <label className="node-field">
        <span>Type</span>
        <select value={inputType} onChange={handleTypeChange}>
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </label>
    </BaseNode>
  );
};
