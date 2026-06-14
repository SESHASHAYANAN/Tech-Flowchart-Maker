// gatewayNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const GatewayNode = ({ id, data }) => {
  const [provider, setProvider] = useState(data?.provider || 'Nginx');
  const updateNodeField = useStore((s) => s.updateNodeField);

  useEffect(() => {
    setProvider(data?.provider || 'Nginx');
  }, [data?.provider]);

  return (
    <BaseNode
      id={id} title="API Gateway" icon="🚪"
      handles={[
        { type: 'target', position: 'Left', id: 'request' },
        { type: 'source', position: 'Right', id: 'route' },
      ]}
      className="node-gateway"
    >
      <label className="node-field">
        <span>Provider</span>
        <select value={provider} onChange={(e) => { setProvider(e.target.value); updateNodeField(id, 'provider', e.target.value); }}>
          <option value="Nginx">Nginx</option>
          <option value="Kong">Kong</option>
          <option value="AWS API GW">AWS API Gateway</option>
          <option value="Traefik">Traefik</option>
          <option value="Custom">Custom</option>
        </select>
      </label>
    </BaseNode>
  );
};
