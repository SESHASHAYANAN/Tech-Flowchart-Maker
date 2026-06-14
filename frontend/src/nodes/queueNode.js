// queueNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const QueueNode = ({ id, data }) => {
  const [broker, setBroker] = useState(data?.broker || 'RabbitMQ');
  const updateNodeField = useStore((s) => s.updateNodeField);

  useEffect(() => {
    setBroker(data?.broker || 'RabbitMQ');
  }, [data?.broker]);

  return (
    <BaseNode
      id={id} title="Queue" icon="📨"
      handles={[
        { type: 'target', position: 'Left', id: 'enqueue' },
        { type: 'source', position: 'Right', id: 'dequeue' },
      ]}
      className="node-queue"
    >
      <label className="node-field">
        <span>Broker</span>
        <select value={broker} onChange={(e) => { setBroker(e.target.value); updateNodeField(id, 'broker', e.target.value); }}>
          <option value="RabbitMQ">RabbitMQ</option>
          <option value="Kafka">Kafka</option>
          <option value="SQS">AWS SQS</option>
          <option value="Redis Pub/Sub">Redis Pub/Sub</option>
          <option value="NATS">NATS</option>
        </select>
      </label>
      <div className="sysnode-queue-visual">
        <span className="queue-dot" /><span className="queue-dot" /><span className="queue-dot" />
      </div>
    </BaseNode>
  );
};
