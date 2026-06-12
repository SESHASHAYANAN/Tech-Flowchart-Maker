// submit.js

import { useState } from 'react';
import { useStore } from './store';

export const SubmitButton = () => {
    const [result, setResult] = useState(null);

    const handleSubmit = async () => {
      const { nodes, edges } = useStore.getState();
      try {
        const res = await fetch('http://localhost:8000/pipelines/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nodes, edges }),
        });
        const data = await res.json();
        setResult(data);
        setTimeout(() => setResult(null), 5000);
      } catch (err) {
        setResult({ error: err.message });
        setTimeout(() => setResult(null), 5000);
      }
    };

    return (
        <div className="submit-bar">
            <button className="submit-btn" type="button" onClick={handleSubmit}>
              Submit Pipeline
            </button>
            {result && (
              <div className={`toast ${result.error ? 'toast-error' : 'toast-success'}`}>
                {result.error ? (
                  <span>⚠ Connection error: {result.error}</span>
                ) : (
                  <>
                    <span className="toast-item"><strong>Nodes:</strong> {result.num_nodes}</span>
                    <span className="toast-divider">•</span>
                    <span className="toast-item"><strong>Edges:</strong> {result.num_edges}</span>
                    <span className="toast-divider">•</span>
                    <span className="toast-item"><strong>DAG:</strong> {result.is_dag ? '✓ Yes' : '✗ No'}</span>
                  </>
                )}
              </div>
            )}
        </div>
    );
};
