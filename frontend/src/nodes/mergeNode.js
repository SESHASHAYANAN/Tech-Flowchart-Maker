// mergeNode.js

import { BaseNode } from './BaseNode';

export const MergeNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      title="Merge"
      icon="🔀"
      handles={[
        { type: 'target', position: 'Left', id: 'inputA', style: { top: '33%' } },
        { type: 'target', position: 'Left', id: 'inputB', style: { top: '66%' } },
        { type: 'source', position: 'Right', id: 'merged' },
      ]}
    >
      <span className="node-description">Merges two inputs into one output.</span>
    </BaseNode>
  );
};
