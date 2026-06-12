// noteNode.js

import { useState, useEffect } from 'react';
import { BaseNode } from './BaseNode';
import { useStore } from '../store';

export const NoteNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || 'Add a note...');
  const updateNodeField = useStore((s) => s.updateNodeField);

  useEffect(() => {
    setText(data?.text || 'Add a note...');
  }, [data?.text]);

  const handleChange = (e) => {
    setText(e.target.value);
    updateNodeField(id, 'text', e.target.value);
  };

  return (
    <BaseNode id={id} title="Note" icon="📌" handles={[]} className="node-note">
      <textarea
        className="node-textarea"
        value={text}
        onChange={handleChange}
        rows={3}
      />
    </BaseNode>
  );
};
