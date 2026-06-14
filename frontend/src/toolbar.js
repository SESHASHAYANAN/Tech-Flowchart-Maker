// toolbar.js

import { useState } from 'react';
import { DraggableNode } from './draggableNode';

const TABS = [
  {
    id: 'pipeline',
    label: '⚡ Pipeline',
    nodes: [
      { type: 'customInput', label: 'Input' },
      { type: 'llm', label: 'LLM' },
      { type: 'customOutput', label: 'Output' },
      { type: 'text', label: 'Text' },
      { type: 'note', label: 'Note' },
      { type: 'api', label: 'API' },
      { type: 'filter', label: 'Filter' },
      { type: 'merge', label: 'Merge' },
      { type: 'timer', label: 'Timer' },
    ],
  },
  {
    id: 'system',
    label: '🏗️ System Design',
    nodes: [
      { type: 'client', label: 'Client' },
      { type: 'gateway', label: 'API Gateway' },
      { type: 'loadBalancer', label: 'Load Balancer' },
      { type: 'service', label: 'Service' },
      { type: 'worker', label: 'Worker' },
      { type: 'database', label: 'Database' },
      { type: 'cache', label: 'Cache' },
      { type: 'queue', label: 'Queue' },
    ],
  },
  {
    id: 'containers',
    label: '📦 Containers',
    nodes: [
      { type: 'group', label: 'Group Box' },
    ],
  },
];

export const PipelineToolbar = () => {
  const [activeTab, setActiveTab] = useState('pipeline');
  const active = TABS.find((t) => t.id === activeTab);

  return (
    <div className="toolbar">
      <div className="toolbar-inner">
        <div className="tab-switcher">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="toolbar-nodes">
          {active.nodes.map((n) => (
            <DraggableNode key={n.type} type={n.type} label={n.label} />
          ))}
        </div>
      </div>
    </div>
  );
};
