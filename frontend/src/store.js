// store.js

import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';

const SAVES_KEY = 'pipeline-saves';
const AUTOSAVE_KEY = 'pipeline-autosave';

let idCounter = {};

const getNextID = (type) => {
  idCounter[type] = (idCounter[type] || 0) + 1;
  return `${type}-${idCounter[type]}`;
};

const syncCounters = (nodes) => {
  idCounter = {};
  nodes.forEach((n) => {
    const match = n.id.match(/^(.+)-(\d+)$/);
    if (match) {
      const [, type, num] = match;
      idCounter[type] = Math.max(idCounter[type] || 0, parseInt(num, 10));
    }
  });
};

const readSaves = () => {
  try { return JSON.parse(localStorage.getItem(SAVES_KEY)) || []; }
  catch { return []; }
};

const writeSaves = (saves) => localStorage.setItem(SAVES_KEY, JSON.stringify(saves));

export const useStore = create((set, get) => ({
  nodes: [],
  edges: [],
  savedVersions: readSaves(),

  getNodeID: (type) => getNextID(type),

  addNode: (node) => {
    set((state) => ({ nodes: [...state.nodes, node] }));
  },

  createNode: (type) => {
    const id = getNextID(type);
    const count = get().nodes.length;
    set((state) => ({
      nodes: [...state.nodes, {
        id,
        type,
        position: { x: 250 + (count % 5) * 60, y: 150 + Math.floor(count / 5) * 80 + (count % 3) * 30 },
        data: { id, nodeType: type },
      }],
    }));
  },

  onNodesChange: (changes) => {
    set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) }));
  },

  onEdgesChange: (changes) => {
    set((state) => ({ edges: applyEdgeChanges(changes, state.edges) }));
  },

  onConnect: (connection) => {
    set((state) => ({
      edges: addEdge({
        ...connection,
        type: 'smoothstep',
        animated: true,
        markerEnd: { type: MarkerType.Arrow, height: '20px', width: '20px' },
      }, state.edges),
    }));
  },

  updateNodeField: (nodeId, fieldName, fieldValue) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, [fieldName]: fieldValue } }
          : node
      ),
    }));
  },

  saveVersion: (viewport) => {
    const { nodes, edges, savedVersions } = get();
    const entry = {
      id: Date.now().toString(36),
      name: `Untitled ${savedVersions.length + 1}`,
      timestamp: new Date().toISOString(),
      nodes, edges,
      viewport: viewport || { x: 0, y: 0, zoom: 1 },
    };
    const updated = [entry, ...savedVersions];
    writeSaves(updated);
    set({ savedVersions: updated });
  },

  loadVersion: (id) => {
    const saves = readSaves();
    const entry = saves.find((s) => s.id === id);
    if (!entry) return null;
    syncCounters(entry.nodes);
    set({ nodes: entry.nodes, edges: entry.edges, savedVersions: saves });
    return entry;
  },

  renameVersion: (id, newName) => {
    const updated = readSaves().map((s) => s.id === id ? { ...s, name: newName } : s);
    writeSaves(updated);
    set({ savedVersions: updated });
  },

  deleteVersion: (id) => {
    const updated = readSaves().filter((s) => s.id !== id);
    writeSaves(updated);
    set({ savedVersions: updated });
  },

  autosave: () => {
    const { nodes, edges } = get();
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify({ nodes, edges }));
  },

  restoreAutosave: () => {
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (!raw) return false;
      const { nodes, edges } = JSON.parse(raw);
      syncCounters(nodes);
      set({ nodes, edges, savedVersions: readSaves() });
      return true;
    } catch { return false; }
  },

  clearCanvas: () => {
    idCounter = {};
    set({ nodes: [], edges: [] });
  },
}));
