// outputNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data?.outputType || 'Text');
  const updateNodeField = useStore((s) => s.updateNodeField);

  useEffect(() => {
    setCurrName(data?.outputName || id.replace('customOutput-', 'output_'));
    setOutputType(data?.outputType || 'Text');
  }, [data?.outputName, data?.outputType, id]);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    updateNodeField(id, 'outputName', e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
    updateNodeField(id, 'outputType', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Output"
      icon="📤"
      handles={[{ type: 'target', position: 'Left', id: 'value' }]}
    >
      <label className="node-field">
        <span>Name</span>
        <input type="text" value={currName} onChange={handleNameChange} />
      </label>
      <label className="node-field">
        <span>Type</span>
        <select value={outputType} onChange={handleTypeChange}>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </label>
    </BaseNode>
  );
};
