'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { CanvasElement } from '@/hooks/use-canvas-state';
import { CanvasElementComponent } from './canvas-element';
import { getResizeHandle } from '@/lib/canvas-utils';

interface CanvasProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
}

export function Canvas({
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragState, setDragState] = useState<{
    elementId: string;
    startX: number;
    startY: number;
    elementX: number;
    elementY: number;
  } | null>(null);

  const [resizeState, setResizeState] = useState<{
    elementId: string;
    handle: string;
    startX: number;
    startY: number;
    elementX: number;
    elementY: number;
    elementWidth: number;
    elementHeight: number;
  } | null>(null);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelectElement(null);
    }
  };

  const handleDragStart = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      setDragState({
        elementId,
        startX: e.clientX,
        startY: e.clientY,
        elementX: elements.find((el) => el.id === elementId)?.x || 0,
        elementY: elements.find((el) => el.id === elementId)?.y || 0,
      });
    },
    [elements]
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, elementId: string, handle: string) => {
      const element = elements.find((el) => el.id === elementId);
      if (!element) return;

      setResizeState({
        elementId,
        handle,
        startX: e.clientX,
        startY: e.clientY,
        elementX: element.x,
        elementY: element.y,
        elementWidth: element.width,
        elementHeight: element.height,
      });
    },
    [elements]
  );

  useEffect(() => {
    if (!dragState && !resizeState) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (dragState) {
        const deltaX = e.clientX - dragState.startX;
        const deltaY = e.clientY - dragState.startY;

        onUpdateElement(dragState.elementId, {
          x: Math.max(0, dragState.elementX + deltaX),
          y: Math.max(0, dragState.elementY + deltaY),
        });
      } else if (resizeState) {
        const deltaX = e.clientX - resizeState.startX;
        const deltaY = e.clientY - resizeState.startY;
        const handle = resizeState.handle;

        let newX = resizeState.elementX;
        let newY = resizeState.elementY;
        let newWidth = resizeState.elementWidth;
        let newHeight = resizeState.elementHeight;

        if (handle.includes('w')) {
          newX = resizeState.elementX + deltaX;
          newWidth = resizeState.elementWidth - deltaX;
        }
        if (handle.includes('e')) {
          newWidth = resizeState.elementWidth + deltaX;
        }
        if (handle.includes('n')) {
          newY = resizeState.elementY + deltaY;
          newHeight = resizeState.elementHeight - deltaY;
        }
        if (handle.includes('s')) {
          newHeight = resizeState.elementHeight + deltaY;
        }

        newWidth = Math.max(20, newWidth);
        newHeight = Math.max(20, newHeight);
        newX = Math.max(0, newX);
        newY = Math.max(0, newY);

        onUpdateElement(resizeState.elementId, {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });
      }
    };

    const handleMouseUp = () => {
      setDragState(null);
      setResizeState(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, resizeState, onUpdateElement]);

  return (
    <div
      ref={canvasRef}
      className="relative flex-1 bg-white border-l border-gray-200 overflow-hidden cursor-default"
      style={{
        backgroundImage:
          'linear-gradient(0deg, transparent 24%, rgba(200, 200, 200, 0.05) 25%, rgba(200, 200, 200, 0.05) 26%, transparent 27%, transparent 74%, rgba(200, 200, 200, 0.05) 75%, rgba(200, 200, 200, 0.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(200, 200, 200, 0.05) 25%, rgba(200, 200, 200, 0.05) 26%, transparent 27%, transparent 74%, rgba(200, 200, 200, 0.05) 75%, rgba(200, 200, 200, 0.05) 76%, transparent 77%, transparent)',
        backgroundSize: '50px 50px',
        backgroundPosition: '0 0',
      }}
      onClick={handleCanvasClick}
    >
      {elements.map((element) => (
        <CanvasElementComponent
          key={element.id}
          element={element}
          isSelected={element.id === selectedElementId}
          onSelect={onSelectElement}
          onUpdate={onUpdateElement}
          onDelete={onDeleteElement}
          onDragStart={handleDragStart}
          onResizeStart={handleResizeStart}
        />
      ))}
    </div>
  );
}
