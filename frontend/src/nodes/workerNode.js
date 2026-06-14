// workerNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const WorkerNode = ({ id, data }) => {
  const [concurrency, setConcurrency] = useState(data?.concurrency || '4');
  const updateNodeField = useStore((s) => s.updateNodeField);

  useEffect(() => {
    setConcurrency(data?.concurrency || '4');
  }, [data?.concurrency]);

  return (
    <BaseNode
      id={id} title="Worker" icon="⚙️"
      handles={[
        { type: 'target', position: 'Left', id: 'task' },
        { type: 'source', position: 'Right', id: 'result' },
      ]}
      className="node-worker"
    >
      <label className="node-field">
        <span>Concurrency</span>
        <input type="number" min={1} value={concurrency} onChange={(e) => { setConcurrency(e.target.value); updateNodeField(id, 'concurrency', e.target.value); }} />
      </label>
    </BaseNode>
  );
};
