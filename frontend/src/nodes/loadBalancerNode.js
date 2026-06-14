// loadBalancerNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const LoadBalancerNode = ({ id, data }) => {
  const [algorithm, setAlgorithm] = useState(data?.algorithm || 'Round Robin');
  const updateNodeField = useStore((s) => s.updateNodeField);

  useEffect(() => {
    setAlgorithm(data?.algorithm || 'Round Robin');
  }, [data?.algorithm]);

  return (
    <BaseNode
      id={id} title="Load Balancer" icon="⚖️"
      handles={[
        { type: 'target', position: 'Left', id: 'incoming' },
        { type: 'source', position: 'Right', id: 'server1', style: { top: '33%' } },
        { type: 'source', position: 'Right', id: 'server2', style: { top: '66%' } },
      ]}
      className="node-lb"
    >
      <label className="node-field">
        <span>Algorithm</span>
        <select value={algorithm} onChange={(e) => { setAlgorithm(e.target.value); updateNodeField(id, 'algorithm', e.target.value); }}>
          <option value="Round Robin">Round Robin</option>
          <option value="Least Connections">Least Connections</option>
          <option value="IP Hash">IP Hash</option>
          <option value="Weighted">Weighted</option>
        </select>
      </label>
    </BaseNode>
  );
};
