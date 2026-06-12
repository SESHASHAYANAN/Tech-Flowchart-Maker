// llmNode.js

import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  return (
    <BaseNode
      id={id}
      title="LLM"
      icon="🤖"
      handles={[
        { type: 'target', position: 'Left', id: 'system', style: { top: '33%' } },
        { type: 'target', position: 'Left', id: 'prompt', style: { top: '66%' } },
        { type: 'source', position: 'Right', id: 'response' },
      ]}
    >
      <span className="node-description">This is a LLM.</span>
    </BaseNode>
  );
};
