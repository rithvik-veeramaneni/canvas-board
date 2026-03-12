'use client';

import { useCanvasState } from '@/hooks/use-canvas-state';
import { createRectElement, createTextElement, createImageElement } from '@/lib/canvas-utils';
import { Toolbar } from './toolbar';
import { Canvas } from './canvas';
import { PropertiesPanel } from './properties-panel';

export function CanvasEditor() {
  const {
    state,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    clearCanvas,
    moveToFront,
    moveToBack,
  } = useCanvasState();

  const selectedElement = state.elements.find((el) => el.id === state.selectedElementId);

  const handleAddRect = () => {
    const newElement = createRectElement(100, 100);
    addElement(newElement);
  };

  const handleAddText = () => {
    const newElement = createTextElement(100, 150);
    addElement(newElement);
  };

  const handleAddImage = () => {
    const newElement = createImageElement(100, 250);
    addElement(newElement);
  };

  const handleDeleteSelected = () => {
    if (state.selectedElementId) {
      deleteElement(state.selectedElementId);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Toolbar */}
      <Toolbar
        onAddRect={handleAddRect}
        onAddText={handleAddText}
        onAddImage={handleAddImage}
        onClearCanvas={clearCanvas}
        hasSelectedElement={!!state.selectedElementId}
        onDeleteSelected={handleDeleteSelected}
      />

      {/* Canvas */}
      <Canvas
        elements={state.elements}
        selectedElementId={state.selectedElementId}
        onSelectElement={selectElement}
        onUpdateElement={updateElement}
        onDeleteElement={deleteElement}
      />

      {/* Properties Panel */}
      <PropertiesPanel
        element={selectedElement || null}
        onUpdate={(updates) => {
          if (state.selectedElementId) {
            updateElement(state.selectedElementId, updates);
          }
        }}
        onMoveToFront={() => {
          if (state.selectedElementId) {
            moveToFront(state.selectedElementId);
          }
        }}
        onMoveToBack={() => {
          if (state.selectedElementId) {
            moveToBack(state.selectedElementId);
          }
        }}
      />
    </div>
  );
}
