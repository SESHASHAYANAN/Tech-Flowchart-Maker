// toolbar.js

import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {

    return (
        <div className="toolbar">
            <div className="toolbar-nodes">
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                <DraggableNode type='note' label='Note' />
                <DraggableNode type='api' label='API' />
                <DraggableNode type='filter' label='Filter' />
                <DraggableNode type='merge' label='Merge' />
                <DraggableNode type='timer' label='Timer' />
            </div>
        </div>
    );
};
