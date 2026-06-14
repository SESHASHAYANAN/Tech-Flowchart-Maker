// databaseNode.js

import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

export const DatabaseNode = ({ id, data }) => {
  const [dbType, setDbType] = useState(data?.dbType || 'SQL');
  const [vendor, setVendor] = useState(data?.vendor || 'PostgreSQL');
  const [dbName, setDbName] = useState(data?.dbName || 'main_db');
  const updateNodeField = useStore((s) => s.updateNodeField);

  useEffect(() => {
    setDbType(data?.dbType || 'SQL');
    setVendor(data?.vendor || 'PostgreSQL');
    setDbName(data?.dbName || 'main_db');
  }, [data?.dbType, data?.vendor, data?.dbName]);

  const vendors = dbType === 'SQL'
    ? ['PostgreSQL', 'MySQL', 'SQLite', 'MSSQL', 'Oracle']
    : ['MongoDB', 'DynamoDB', 'Cassandra', 'Redis', 'CouchDB'];

  const handleTypeChange = (e) => {
    setDbType(e.target.value);
    updateNodeField(id, 'dbType', e.target.value);
    const newVendor = e.target.value === 'SQL' ? 'PostgreSQL' : 'MongoDB';
    setVendor(newVendor);
    updateNodeField(id, 'vendor', newVendor);
  };

  return (
    <div className="sysnode sysnode-database">
      <div className="sysnode-shape sysnode-cylinder">
        <div className="cylinder-top" />
        <div className="cylinder-body">
          <span className="sysnode-icon">🗄️</span>
          <span className="sysnode-label">Database</span>
        </div>
      </div>
      <div className="sysnode-fields">
        <label className="node-field">
          <span>Type</span>
          <select value={dbType} onChange={handleTypeChange}>
            <option value="SQL">SQL</option>
            <option value="NoSQL">NoSQL</option>
          </select>
        </label>
        <label className="node-field">
          <span>Vendor</span>
          <select value={vendor} onChange={(e) => { setVendor(e.target.value); updateNodeField(id, 'vendor', e.target.value); }}>
            {vendors.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </label>
        <label className="node-field">
          <span>Name</span>
          <input type="text" value={dbName} onChange={(e) => { setDbName(e.target.value); updateNodeField(id, 'dbName', e.target.value); }} />
        </label>
        <div className="sysnode-badge">{dbType}</div>
      </div>
      <Handle type="target" position={Position.Left} id={`${id}-in`} className="handle-target" />
      <Handle type="source" position={Position.Right} id={`${id}-out`} className="handle-source" />
    </div>
  );
};
