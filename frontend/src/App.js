import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { AIBot } from './aiBot';

function App() {
  return (
    <div className="app">
      <PipelineToolbar />
      <PipelineUI />
      <SubmitButton />
      <AIBot />
    </div>
  );
}

export default App;
