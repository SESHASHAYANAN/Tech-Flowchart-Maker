// filterNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const FilterNode = ({ id, data }) => {
  const [operator, setOperator] = useState(data?.operator || 'contains');
  const updateNodeField = useStore((s) => s.updateNodeField);

  useEffect(() => {
    setOperator(data?.operator || 'contains');
  }, [data?.operator]);

  const handleChange = (e) => {
    setOperator(e.target.value);
    updateNodeField(id, 'operator', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="Filter"
      icon="🔍"
      handles={[
        { type: 'target', position: 'Left', id: 'input' },
        { type: 'source', position: 'Right', id: 'output' },
      ]}
    >
      <label className="node-field">
        <span>Operator</span>
        <select value={operator} onChange={handleChange}>
          <option value="contains">Contains</option>
          <option value="equals">Equals</option>
          <option value="startsWith">Starts With</option>
          <option value="regex">Regex</option>
        </select>
      </label>
    </BaseNode>
  );
};
