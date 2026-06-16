// groupNode.js

import { useState, useEffect, useCallback, useRef } from 'react';
import { useReactFlow } from 'reactflow';
import { useStore } from '../store';

const GROUP_THEMES = {
  Frontend:  { bg: 'rgba(34, 211, 238, 0.10)', border: '#22d3ee', label: '#22d3ee' },
  Backend:   { bg: 'rgba(99, 102, 241, 0.10)', border: '#818cf8', label: '#818cf8' },
  Database:  { bg: 'rgba(52, 211, 153, 0.10)', border: '#34d399', label: '#34d399' },
  Cache:     { bg: 'rgba(251, 146, 60, 0.10)',  border: '#fb923c', label: '#fb923c' },
  Queue:     { bg: 'rgba(244, 114, 182, 0.10)', border: '#f472b6', label: '#f472b6' },
  Custom:    { bg: 'rgba(148, 163, 184, 0.10)', border: '#64748b', label: '#94a3b8' },
};

const DEFAULT_W = 380;
const DEFAULT_H = 260;

export const GroupNode = ({ id, data, style }) => {
  const [label, setLabel] = useState(data?.label || 'Group');
  const [groupType, setGroupType] = useState(data?.groupType || 'Backend');
  const updateNodeField = useStore((s) => s.updateNodeField);
  const updateNodeDimensions = useStore((s) => s.updateNodeDimensions);
  const { getZoom } = useReactFlow();
  const resizingRef = useRef(false);
  const startRef = useRef({ mx: 0, my: 0, w: 0, h: 0 });
  const initialized = useRef(false);

  useEffect(() => {
    if (data?.label != null) setLabel(data.label);
    if (data?.groupType != null) setGroupType(data.groupType);
  }, [data?.label, data?.groupType]);

  // Auto-initialize dimensions for old nodes missing style
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const hasW = (data?.width && parseFloat(data.width) > 100) || (style?.width && parseFloat(style.width) > 100);
      const hasH = (data?.height && parseFloat(data.height) > 60) || (style?.height && parseFloat(style.height) > 60);
      if (!hasW || !hasH) {
        updateNodeDimensions(id, DEFAULT_W, DEFAULT_H);
      }
    }
  }, [id, style, data, updateNodeDimensions]);

  const theme = GROUP_THEMES[groupType] || GROUP_THEMES.Custom;
  const stopProp = useCallback((e) => e.stopPropagation(), []);

  const w = parseFloat(data?.width) || parseFloat(style?.width) || DEFAULT_W;
  const h = parseFloat(data?.height) || parseFloat(style?.height) || DEFAULT_H;

  const onResizeStart = useCallback((e) => {
    e.stopPropagation();
    resizingRef.current = true;
    const zoom = getZoom();
    startRef.current = { mx: e.clientX, my: e.clientY, w, h, zoom };

    const onMove = (ev) => {
      if (!resizingRef.current) return;
      const z = startRef.current.zoom;
      const dx = (ev.clientX - startRef.current.mx) / z;
      const dy = (ev.clientY - startRef.current.my) / z;
      const nw = Math.max(220, startRef.current.w + dx);
      const nh = Math.max(100, startRef.current.h + dy);
      updateNodeDimensions(id, nw, nh);
    };

    const onUp = () => {
      resizingRef.current = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [id, w, h, updateNodeDimensions, getZoom]);

  return (
    <div
      className="group-container"
      style={{
        width: w,
        height: h,
        background: theme.bg,
        border: `2px dashed ${theme.border}55`,
        borderRadius: 14,
      }}
    >
      <div className="group-hdr">
        <span className="group-tag" style={{ background: `${theme.border}22`, color: theme.label, borderColor: `${theme.border}44` }}>
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {data?.tech && (
            <div style={{ 
              display: 'flex', alignItems: 'center', gap: '6px',
              background: `linear-gradient(135deg, ${theme.border}25, ${theme.border}10)`, 
              color: '#f8fafc', 
              border: `1px solid ${theme.border}40`, 
              padding: '3px 10px', 
              borderRadius: '20px', 
              fontSize: '11px', 
              fontWeight: 700,
              fontFamily: 'var(--font)',
              boxShadow: `0 2px 10px ${theme.border}25`,
              backdropFilter: 'blur(8px)'
            }}>
              <span style={{ fontSize: '12px' }}>{
                data.tech.includes('React') ? '⚛️' : 
                data.tech.includes('Python') ? '🐍' : 
                data.tech.includes('Node') ? '🟩' : 
                data.tech.includes('Java') ? '☕' : 
                data.tech.includes('Go') ? '🐹' : 
                data.tech.includes('Next') ? '▲' : 
                data.tech.includes('Tailwind') ? '🌊' : 
                data.tech.includes('HTML') ? '📄' : '✨'
              }</span>
              {data.tech}
            </div>
          )}
          <select
            className="group-type-select nodrag"
            value={groupType}
            onChange={(e) => { setGroupType(e.target.value); updateNodeField(id, 'groupType', e.target.value); }}
            onMouseDown={stopProp}
            style={{ color: theme.label, borderColor: `${theme.border}33` }}
          >
            {Object.keys(GROUP_THEMES).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="group-body" />
      {/* nodrag + nopan ensures React Flow does not intercept mouse events */}
      <div
        className="group-resize-handle nodrag nopan"
        onMouseDown={onResizeStart}
        onPointerDown={onResizeStart}
      >
        <svg width="12" height="12" viewBox="0 0 12 12">
          <line x1="11" y1="1" x2="1" y2="11" stroke={theme.border} strokeWidth="2" opacity="0.8" />
          <line x1="11" y1="5" x2="5" y2="11" stroke={theme.border} strokeWidth="2" opacity="0.8" />
          <line x1="11" y1="9" x2="9" y2="11" stroke={theme.border} strokeWidth="2" opacity="0.8" />
        </svg>
      </div>
    </div>
  );
};
