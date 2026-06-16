// submit.js

import { useStore } from './store';

export const SubmitButton = () => {
    const toggleAIPanel = useStore((s) => s.toggleAIPanel);

    return (
        <div className="submit-bar">
            <button className="submit-btn" type="button" onClick={toggleAIPanel}>
              🤖 Our AI
            </button>
        </div>
    );
};
