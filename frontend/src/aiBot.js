// aiBot.js

import { useState, useRef, useEffect, useCallback } from 'react';
import { useStore } from './store';

const GROQ_KEY = process.env.REACT_APP_GROQ_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

const FRONTEND_OPTIONS = ['React', 'HTML/CSS', 'Tailwind CSS', 'Next.js', 'Vue.js', 'Angular'];
const BACKEND_OPTIONS = ['Python (FastAPI)', 'Java (Spring)', 'Node.js (Express)', 'Go (Gin)', 'Ruby (Rails)', 'C# (.NET)'];

const TECH_REASONS = {
  'React': 'Component-driven architecture ideal for dynamic, interactive UIs with massive ecosystem support.',
  'HTML/CSS': 'Lightweight and zero-dependency, perfect for static pages and maximum browser compatibility.',
  'Tailwind CSS': 'Utility-first framework that accelerates styling with consistent design tokens.',
  'Next.js': 'Full-stack React framework with SSR, SSG, and API routes for production-grade performance.',
  'Vue.js': 'Progressive framework with gentle learning curve and excellent reactivity system.',
  'Angular': 'Enterprise-grade framework with built-in DI, routing, and strong TypeScript integration.',
  'Python (FastAPI)': 'Async-first Python framework delivering high performance with automatic API documentation.',
  'Java (Spring)': 'Battle-tested enterprise framework with robust security and microservice patterns.',
  'Node.js (Express)': 'JavaScript end-to-end with non-blocking I/O, ideal for real-time applications.',
  'Go (Gin)': 'Compiled language delivering near-C performance with simple concurrency primitives.',
  'Ruby (Rails)': 'Convention-over-configuration framework for rapid prototyping and developer productivity.',
  'C# (.NET)': 'Microsoft ecosystem with excellent tooling, performance, and enterprise integration.',
};

const FOLLOW_UP_QUESTIONS = [
  { key: 'audience', label: '🎯 Target Audience', options: ['B2B Enterprise', 'B2C Consumer', 'Internal Tool', 'Developer API', 'E-commerce'] },
  { key: 'security', label: '🔒 Security Level', options: ['Basic Auth', 'OAuth 2.0 / JWT', 'Enterprise SSO', 'HIPAA/SOC2 Compliant', 'End-to-end Encrypted'] },
  { key: 'scale', label: '📈 Expected Scale', options: ['Prototype / MVP', '1K-10K users', '10K-100K users', '100K-1M users', '1M+ users'] },
  { key: 'database', label: '🗄️ Data Store', options: ['PostgreSQL', 'MongoDB', 'Redis + SQL', 'DynamoDB', 'Supabase'] },
];

const callGroq = async (messages) => {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
    body: JSON.stringify({ model: MODEL, messages, temperature: 0.7, max_tokens: 4096 }),
  });
  if (!res.ok) throw new Error(`Groq API error: ${res.status}`);
  const data = await res.json();
  return data.choices[0].message.content;
};

const SYSTEM_PROMPT = `You are an expert system architect AI. When asked to generate a project architecture, return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{
  "pipeline": [{"type":"<nodeType>","label":"<name>","data":{}}],
  "systemDesign": [{"type":"<nodeType>","label":"<name>","data":{}}],
  "containers": [{"type":"group","label":"<name>","groupType":"<Frontend|Backend|Database|Cache|Queue>"}],
  "edges": [{"from":"<sourceLabel>","to":"<targetLabel>"}],
  "summary": "<one paragraph description>"
}

Available node types for pipeline: customInput, llm, customOutput, text, note, api, filter, merge, timer
Available node types for systemDesign: client, gateway, loadBalancer, service, worker, database, cache, queue
Available container types: group (with groupType: Frontend, Backend, Database, Cache, Queue)

Generate a complete, production-grade architecture based on the project description, tech choices, and requirements provided. Include realistic connections between components.`;

export const AIBot = () => {
  const isOpen = useStore((s) => s.aiPanelOpen);
  const toggleAIPanel = useStore((s) => s.toggleAIPanel);
  const setAIPanelOpen = useStore((s) => s.setAIPanelOpen);
  const [step, setStep] = useState('prompt');
  const [prompt, setPrompt] = useState('');
  const [selections, setSelections] = useState({});
  const [frontend, setFrontend] = useState('');
  const [backend, setBackend] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const chatEndRef = useRef(null);
  const addNode = useStore((s) => s.addNode);
  const getNodeID = useStore((s) => s.getNodeID);

  const scrollToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(scrollToBottom, [messages, scrollToBottom]);

  const addMsg = (role, text) => setMessages((prev) => [...prev, { role, text, ts: Date.now() }]);

  const handlePromptSubmit = () => {
    if (!prompt.trim()) return;
    addMsg('user', prompt);
    addMsg('bot', "Great idea! Let me ask a few questions to design the best architecture for you.");
    setStep('followup');
  };

  const handleFollowUpSelect = (key, value) => {
    setSelections((prev) => ({ ...prev, [key]: value }));
    addMsg('user', `${key}: ${value}`);
  };

  const handleFollowUpDone = () => {
    if (Object.keys(selections).length === 0) {
      addMsg('bot', "Please select at least one option to continue.");
      return;
    }
    addMsg('bot', "Now pick your preferred tech stack:");
    setStep('techstack');
  };

  const handleGenerate = async () => {
    if (!frontend || !backend) {
      setError('Please select both frontend and backend technologies.');
      return;
    }
    setError('');
    addMsg('user', `Frontend: ${frontend}, Backend: ${backend}`);
    addMsg('bot', '🔄 Generating your architecture... This takes a few seconds.');
    setStep('generating');
    setLoading(true);

    const userMessage = `
Project: ${prompt}
Frontend: ${frontend}
Backend: ${backend}
${Object.entries(selections).map(([k, v]) => `${k}: ${v}`).join('\n')}

Generate a complete system architecture for this project.`;

    try {
      const raw = await callGroq([
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ]);

      let cleaned = raw.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }
      const arch = JSON.parse(cleaned);
      setResult(arch);
      addMsg('bot', `✅ Architecture generated! ${arch.summary || ''}`);
      setStep('result');
    } catch (err) {
      addMsg('bot', `❌ Error: ${err.message}. Please try again.`);
      setStep('techstack');
    }
    setLoading(false);
  };

  const spawnOnCanvas = () => {
    if (!result) return;
    const nodeMap = {};
    const allNodes = [];

    const SLOT = 250;      // generous slot height — fits ANY node type
    const SLOT_W = 220;    // node width budget
    const GAP = 30;        // gap between nodes
    const HPAD = 30;       // horizontal padding inside container
    const VTOP = 55;       // vertical top padding (header space)
    const VBOT = 30;       // vertical bottom padding
    const CGAP = 60;       // gap between containers

    // ── Bucket nodes into groups ──
    const assign = (t) => {
      if (t === 'client') return 'Frontend';
      if (t === 'database') return 'Database';
      if (t === 'cache') return 'Cache';
      if (t === 'queue') return 'Queue';
      return 'Backend';
    };

    const groups = {};
    (result.containers || []).forEach((c) => {
      const g = c.groupType || 'Custom';
      if (!groups[g]) groups[g] = { meta: c, items: [] };
    });
    (result.systemDesign || []).forEach((n) => {
      const g = assign(n.type);
      if (!groups[g]) groups[g] = { meta: { label: g, groupType: g }, items: [] };
      groups[g].items.push(n);
    });
    if (result.pipeline?.length > 0) {
      groups['Pipeline'] = { meta: { label: 'Pipeline', groupType: 'Custom' }, items: result.pipeline, pipe: true };
    }

    // ── Lay out containers + children with absolute coords ──
    let cx = 50, cy = 50, maxH = 0;

    Object.entries(groups).forEach(([g, bucket]) => {
      const items = bucket.items;
      const isPipe = bucket.pipe || false;
      const cols = isPipe ? Math.max(items.length, 1) : Math.min(items.length || 1, 2);
      const rows = Math.max(1, Math.ceil(items.length / cols));

      const cw = HPAD * 2 + cols * SLOT_W + (cols - 1) * GAP;
      const ch = VTOP + VBOT + rows * SLOT + (rows - 1) * GAP;

      // Wrap row
      if (cx + cw > 1800 && cx > 50) { cx = 50; cy += maxH + CGAP; maxH = 0; }

      // Tech badge
      let tech = null;
      if (g === 'Frontend') tech = frontend;
      if (g === 'Backend') tech = backend;
      if (g === 'Database') tech = selections.database || null;
      if (isPipe) tech = 'AI Agent';

      // Container node — pass dimensions through BOTH style AND data
      const cid = getNodeID('group');
      nodeMap[bucket.meta.label] = cid;
      allNodes.push({
        id: cid, type: 'group', position: { x: cx, y: cy },
        data: { id: cid, nodeType: 'group', label: bucket.meta.label, groupType: bucket.meta.groupType || 'Custom', tech, width: cw, height: ch },
        style: { width: cw, height: ch },
        zIndex: -1,
      });

      // Child nodes — absolute positions inside container bounds
      items.forEach((n, i) => {
        const id = getNodeID(n.type);
        nodeMap[n.label] = id;
        const col = i % cols;
        const row = Math.floor(i / cols);
        allNodes.push({
          id, type: n.type,
          position: { x: cx + HPAD + col * (SLOT_W + GAP), y: cy + VTOP + row * (SLOT + GAP) },
          data: { id, nodeType: n.type, ...n.data },
        });
      });

      cx += cw + CGAP;
      maxH = Math.max(maxH, ch);
    });

    // ── Single batch update — avoids React Flow parent-child timing issues ──
    const { nodes: existingNodes, edges: existingEdges } = useStore.getState();
    const newEdges = [...existingEdges];
    (result.edges || []).forEach((e) => {
      const src = nodeMap[e.from], tgt = nodeMap[e.to];
      if (src && tgt) {
        newEdges.push({
          id: `e-${src}-${tgt}`,
          source: src, target: tgt,
          type: 'smoothstep', animated: true,
          markerEnd: { type: 'arrow', height: '20px', width: '20px' },
        });
      }
    });

    useStore.setState({ nodes: [...existingNodes, ...allNodes], edges: newEdges });
    addMsg('bot', '🎉 All nodes placed on canvas! Drag, edit, and connect them freely.');
  };

  const reset = () => {
    setStep('prompt');
    setPrompt('');
    setSelections({});
    setFrontend('');
    setBackend('');
    setResult(null);
    setError('');
    setMessages([]);
  };

  return (
    <>
      {/* Toggle tab on RIGHT edge */}
      <button
        className={`ai-toggle ${isOpen ? 'ai-toggle-open' : ''}`}
        onClick={toggleAIPanel}
        title={isOpen ? 'Close AI Panel' : 'Open AI Architect'}
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Right-side sliding panel */}
      <div className={`ai-panel ${isOpen ? 'ai-panel-open' : ''}`}>
        <div className="ai-header">
          <div className="ai-header-title">
            <span className="ai-logo">🤖</span>
            <span>AI Architect</span>
          </div>
          <div className="ai-header-actions">
            <button className="ai-reset-btn" onClick={reset} title="Start Over">↺</button>
            <button className="ai-close-btn" onClick={() => setAIPanelOpen(false)} title="Close Panel">✕</button>
          </div>
        </div>

        <div className="ai-chat">
          {messages.length === 0 && (
            <div className="ai-welcome">
              <div className="ai-welcome-icon">🏗️</div>
              <h3>Describe Your Project</h3>
              <p>I'll generate a complete system architecture with pipelines, services, and containers.</p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`ai-msg ai-msg-${m.role}`}>
              <span className="ai-msg-avatar">{m.role === 'user' ? '👤' : '🤖'}</span>
              <div className="ai-msg-text">{m.text}</div>
            </div>
          ))}

          {/* Follow-up questions */}
          {step === 'followup' && (
            <div className="ai-options-block">
              {FOLLOW_UP_QUESTIONS.map((q) => (
                <div key={q.key} className="ai-option-group">
                  <div className="ai-option-label">{q.label}</div>
                  <div className="ai-chips">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        className={`ai-chip ${selections[q.key] === opt ? 'ai-chip-active' : ''}`}
                        onClick={() => handleFollowUpSelect(q.key, opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button className="ai-action-btn" onClick={handleFollowUpDone}>Continue →</button>
            </div>
          )}

          {/* Tech stack selection */}
          {step === 'techstack' && (
            <div className="ai-options-block">
              <div className="ai-option-group">
                <div className="ai-option-label">⚡ Frontend Framework</div>
                <div className="ai-chips">
                  {FRONTEND_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      className={`ai-chip ${frontend === opt ? 'ai-chip-active' : ''}`}
                      onClick={() => setFrontend(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="ai-option-group">
                <div className="ai-option-label">🔧 Backend Framework</div>
                <div className="ai-chips">
                  {BACKEND_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      className={`ai-chip ${backend === opt ? 'ai-chip-active' : ''}`}
                      onClick={() => setBackend(opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              {error && <div className="ai-error">{error}</div>}
              <button className="ai-action-btn" onClick={handleGenerate} disabled={loading}>
                {loading ? '⏳ Generating...' : '🚀 Generate Architecture'}
              </button>
            </div>
          )}

          {/* Loading */}
          {step === 'generating' && (
            <div className="ai-loading">
              <div className="ai-spinner" />
              <span>Consulting the AI architect...</span>
            </div>
          )}

          {/* Result with tech stack display */}
          {step === 'result' && result && (
            <div className="ai-result">
              {/* Tech Stack Used */}
              <div className="ai-techstack-display">
                <div className="ai-tech-card">
                  <div className="ai-tech-card-header">
                    <span className="ai-tech-icon">⚡</span>
                    <span className="ai-tech-label">Frontend</span>
                  </div>
                  <div className="ai-tech-name">{frontend}</div>
                  <div className="ai-tech-reason">{TECH_REASONS[frontend] || ''}</div>
                </div>
                <div className="ai-tech-card">
                  <div className="ai-tech-card-header">
                    <span className="ai-tech-icon">🔧</span>
                    <span className="ai-tech-label">Backend</span>
                  </div>
                  <div className="ai-tech-name">{backend}</div>
                  <div className="ai-tech-reason">{TECH_REASONS[backend] || ''}</div>
                </div>
              </div>

              {/* Stats */}
              <div className="ai-result-summary">
                <div className="ai-result-stats">
                  <div className="ai-stat"><span className="ai-stat-num">{(result.pipeline || []).length}</span><span className="ai-stat-label">Pipeline</span></div>
                  <div className="ai-stat"><span className="ai-stat-num">{(result.systemDesign || []).length}</span><span className="ai-stat-label">System</span></div>
                  <div className="ai-stat"><span className="ai-stat-num">{(result.containers || []).length}</span><span className="ai-stat-label">Containers</span></div>
                  <div className="ai-stat"><span className="ai-stat-num">{(result.edges || []).length}</span><span className="ai-stat-label">Edges</span></div>
                </div>
              </div>

              <button className="ai-action-btn ai-spawn-btn" onClick={spawnOnCanvas}>
                ✨ Place on Canvas
              </button>
              <button className="ai-secondary-btn" onClick={reset}>
                Start New Project
              </button>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        {step === 'prompt' && (
          <div className="ai-input-area">
            <textarea
              className="ai-input"
              placeholder="Describe your project... e.g. 'E-commerce platform with payment processing, user auth, and recommendations'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePromptSubmit(); } }}
              rows={3}
            />
            <button className="ai-send-btn" onClick={handlePromptSubmit} disabled={!prompt.trim()}>
              →
            </button>
          </div>
        )}
      </div>
    </>
  );
};
