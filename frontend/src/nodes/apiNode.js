// apiNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const APINode = ({ id, data }) => {
  const [url, setUrl] = useState(data?.url || 'https://api.example.com');
  const [method, setMethod] = useState(data?.method || 'GET');
  const updateNodeField = useStore((s) => s.updateNodeField);

  useEffect(() => {
    setUrl(data?.url || 'https://api.example.com');
    setMethod(data?.method || 'GET');
  }, [data?.url, data?.method]);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    updateNodeField(id, 'url', e.target.value);
  };

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
    updateNodeField(id, 'method', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      title="API"
      icon="🌐"
      handles={[
        { type: 'target', position: 'Left', id: 'input' },
        { type: 'source', position: 'Right', id: 'response' },
      ]}
    >
      <label className="node-field">
        <span>URL</span>
        <input type="text" value={url} onChange={handleUrlChange} />
      </label>
      <label className="node-field">
        <span>Method</span>
        <select value={method} onChange={handleMethodChange}>
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </label>
    </BaseNode>
  );
};
