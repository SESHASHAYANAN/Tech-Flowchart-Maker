// clientNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const ClientNode = ({ id, data }) => {
  const [platform, setPlatform] = useState(data?.platform || 'Web');
  const updateNodeField = useStore((s) => s.updateNodeField);

  useEffect(() => {
    setPlatform(data?.platform || 'Web');
  }, [data?.platform]);

  return (
    <BaseNode
      id={id} title="Client" icon="🖥️"
      handles={[
        { type: 'source', position: 'Right', id: 'request' },
      ]}
      className="node-client"
    >
      <label className="node-field">
        <span>Platform</span>
        <select value={platform} onChange={(e) => { setPlatform(e.target.value); updateNodeField(id, 'platform', e.target.value); }}>
          <option value="Web">Web Browser</option>
          <option value="Mobile">Mobile App</option>
          <option value="Desktop">Desktop App</option>
          <option value="IoT">IoT Device</option>
        </select>
      </label>
    </BaseNode>
  );
};
