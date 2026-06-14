// serviceNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const ServiceNode = ({ id, data }) => {
  const [serviceName, setServiceName] = useState(data?.serviceName || 'auth-service');
  const [protocol, setProtocol] = useState(data?.protocol || 'REST');
  const updateNodeField = useStore((s) => s.updateNodeField);

  useEffect(() => {
    setServiceName(data?.serviceName || 'auth-service');
    setProtocol(data?.protocol || 'REST');
  }, [data?.serviceName, data?.protocol]);

  return (
    <BaseNode
      id={id} title="Service" icon="🔧"
      handles={[
        { type: 'target', position: 'Left', id: 'in' },
        { type: 'source', position: 'Right', id: 'out' },
      ]}
      className="node-service"
    >
      <label className="node-field">
        <span>Name</span>
        <input type="text" value={serviceName} onChange={(e) => { setServiceName(e.target.value); updateNodeField(id, 'serviceName', e.target.value); }} />
      </label>
      <label className="node-field">
        <span>Protocol</span>
        <select value={protocol} onChange={(e) => { setProtocol(e.target.value); updateNodeField(id, 'protocol', e.target.value); }}>
          <option value="REST">REST</option>
          <option value="gRPC">gRPC</option>
          <option value="GraphQL">GraphQL</option>
          <option value="WebSocket">WebSocket</option>
        </select>
      </label>
    </BaseNode>
  );
};
