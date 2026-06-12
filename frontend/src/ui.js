// ui.js

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap, Panel } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { NoteNode } from './nodes/noteNode';
import { APINode } from './nodes/apiNode';
import { FilterNode } from './nodes/filterNode';
import { MergeNode } from './nodes/mergeNode';
import { TimerNode } from './nodes/timerNode';
import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  note: NoteNode,
  api: APINode,
  filter: FilterNode,
  merge: MergeNode,
  timer: TimerNode,
};

const nodeLabels = {
  customInput: 'Input', llm: 'LLM', customOutput: 'Output', text: 'Text',
  note: 'Note', api: 'API', filter: 'Filter', merge: 'Merge', timer: 'Timer',
};

const minimapColors = {
  customInput: '#22d3ee', customOutput: '#f97316', llm: '#a78bfa',
  text: '#6366f1', note: '#facc15', api: '#34d399',
  filter: '#f472b6', merge: '#60a5fa', timer: '#fb923c',
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  savedVersions: state.savedVersions,
  saveVersion: state.saveVersion,
  loadVersion: state.loadVersion,
  renameVersion: state.renameVersion,
  deleteVersion: state.deleteVersion,
  autosave: state.autosave,
  restoreAutosave: state.restoreAutosave,
  clearCanvas: state.clearCanvas,
});

const formatTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [showSaves, setShowSaves] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [status, setStatus] = useState('');

  const {
    nodes, edges, getNodeID, addNode,
    onNodesChange, onEdgesChange, onConnect,
    savedVersions, saveVersion, loadVersion, renameVersion, deleteVersion,
    autosave, restoreAutosave, clearCanvas,
  } = useStore(selector, shallow);

  useEffect(() => { restoreAutosave(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) autosave();
  }, [nodes, edges, autosave]);

  const flash = (msg) => { setStatus(msg); setTimeout(() => setStatus(''), 2000); };

  const handleSave = () => {
    saveVersion(reactFlowInstance?.getViewport());
    flash('Saved ✓');
  };

  const handleLoad = (id) => {
    const entry = loadVersion(id);
    if (entry?.viewport && reactFlowInstance) {
      reactFlowInstance.setViewport(entry.viewport);
    }
    setShowSaves(false);
    flash('Loaded ✓');
  };

  const handleRename = (id) => {
    if (editName.trim()) {
      renameVersion(id, editName.trim());
      setEditingId(null);
      setEditName('');
    }
  };

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    if (event?.dataTransfer?.getData('application/reactflow')) {
      const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      const type = appData?.nodeType;
      if (!type) return;
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const nodeID = getNodeID(type);
      addNode({ id: nodeID, type, position, data: { id: nodeID, nodeType: type } });
    }
  }, [reactFlowInstance, getNodeID, addNode]); // eslint-disable-line react-hooks/exhaustive-deps

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} style={{ flex: 1, width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
      >
        <Background color="#333" gap={gridSize} />
        <Controls />
        <MiniMap
          style={{ background: '#1a1a2e' }}
          nodeColor={(n) => minimapColors[n.type] || '#6366f1'}
          nodeStrokeColor="transparent"
          maskColor="rgba(0, 0, 0, 0.7)"
          zoomable
          pannable
          nodeComponent={({ x, y, width, height, color, id }) => {
            const node = nodes.find((n) => n.id === id);
            const label = node ? (nodeLabels[node.type] || node.type) : '';
            return (
              <g transform={`translate(${x}, ${y})`}>
                <rect width={width} height={height} rx={4} fill={color} opacity={0.85} />
                <text
                  x={width / 2} y={height / 2 + 1}
                  textAnchor="middle" dominantBaseline="central"
                  fill="#fff" fontSize={Math.min(14, width * 0.35)}
                  fontWeight="600" fontFamily="Inter, sans-serif"
                >
                  {label}
                </text>
              </g>
            );
          }}
        />
        <Panel position="top-right">
          <div className="save-panel-wrap">
            <div className="save-panel">
              <button className="save-btn" onClick={handleSave}>💾 Save</button>
              <button className="save-btn" onClick={() => setShowSaves(!showSaves)}>
                📂 Load {savedVersions.length > 0 && <span className="save-badge">{savedVersions.length}</span>}
              </button>
              <button className="save-btn save-btn-danger" onClick={() => { clearCanvas(); flash('Cleared'); }}>🗑 Clear</button>
              {status && <span className="save-status">{status}</span>}
            </div>
            {showSaves && (
              <div className="saves-list">
                {savedVersions.length === 0 && <div className="saves-empty">No saved versions yet</div>}
                {savedVersions.map((s) => (
                  <div key={s.id} className="saves-item">
                    {editingId === s.id ? (
                      <div className="saves-rename">
                        <input
                          className="saves-rename-input"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleRename(s.id)}
                          autoFocus
                        />
                        <button className="saves-action" onClick={() => handleRename(s.id)}>✓</button>
                        <button className="saves-action" onClick={() => setEditingId(null)}>✕</button>
                      </div>
                    ) : (
                      <>
                        <div className="saves-info" onClick={() => handleLoad(s.id)}>
                          <span className="saves-name">{s.name}</span>
                          <span className="saves-meta">{s.nodes.length}N · {s.edges.length}E · {formatTime(s.timestamp)}</span>
                        </div>
                        <button className="saves-action" onClick={() => { setEditingId(s.id); setEditName(s.name); }} title="Rename">✏️</button>
                        <button className="saves-action saves-action-del" onClick={() => deleteVersion(s.id)} title="Delete">🗑</button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};
