// timerNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const TimerNode = ({ id, data }) => {
  const [seconds, setSeconds] = useState(data?.seconds || 5);
  const updateNodeField = useStore((s) => s.updateNodeField);

  useEffect(() => {
    setSeconds(data?.seconds !== undefined ? data.seconds : 5);
  }, [data?.seconds]);

  const handleChange = (e) => {
    const val = Number(e.target.value);
    setSeconds(val);
    updateNodeField(id, 'seconds', val);
  };

  return (
    <BaseNode
      id={id}
      title="Timer"
      icon="⏱️"
      handles={[
        { type: 'target', position: 'Left', id: 'trigger' },
        { type: 'source', position: 'Right', id: 'output' },
      ]}
    >
      <label className="node-field">
        <span>Delay (s)</span>
        <input
          type="number"
          min={0}
          value={seconds}
          onChange={handleChange}
        />
      </label>
    </BaseNode>
  );
};
