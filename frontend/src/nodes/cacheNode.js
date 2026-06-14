// cacheNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const CacheNode = ({ id, data }) => {
  const [engine, setEngine] = useState(data?.engine || 'Redis');
  const [ttl, setTtl] = useState(data?.ttl || '3600');
  const updateNodeField = useStore((s) => s.updateNodeField);

  useEffect(() => {
    setEngine(data?.engine || 'Redis');
    setTtl(data?.ttl || '3600');
  }, [data?.engine, data?.ttl]);

  return (
    <BaseNode
      id={id} title="Cache" icon="⚡"
      handles={[
        { type: 'target', position: 'Left', id: 'read' },
        { type: 'source', position: 'Right', id: 'hit' },
      ]}
      className="node-cache"
    >
      <label className="node-field">
        <span>Engine</span>
        <select value={engine} onChange={(e) => { setEngine(e.target.value); updateNodeField(id, 'engine', e.target.value); }}>
          <option value="Redis">Redis</option>
          <option value="Memcached">Memcached</option>
          <option value="Varnish">Varnish</option>
          <option value="CDN">CDN Edge</option>
        </select>
      </label>
      <label className="node-field">
        <span>TTL (s)</span>
        <input type="number" min={0} value={ttl} onChange={(e) => { setTtl(e.target.value); updateNodeField(id, 'ttl', e.target.value); }} />
      </label>
    </BaseNode>
  );
};
