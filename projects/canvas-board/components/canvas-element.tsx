'use client';

import { CanvasElement } from '@/hooks/use-canvas-state';
import { useRef, useState } from 'react';

interface CanvasElementProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<CanvasElement>) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.MouseEvent, id: string) => void;
  onResizeStart: (e: React.MouseEvent, id: string, handle: string) => void;
}

export function CanvasElementComponent({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDragStart,
  onResizeStart,
}: CanvasElementProps) {
  const [isEditingText, setIsEditingText] = useState(false);
  // store a ref to the textarea so we can focus/selection
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  // mousedown used for drag start; ignore multi-clicks so double‑click
  // can be processed separately without kicking off a drag operation.
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.detail > 1) return; // don't drag when part of dblclick
    onDragStart(e, element.id);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    console.log('handleDoubleClick fired for', element.id, element.type);
    if (element.type === 'text') {
      e.stopPropagation();
      setIsEditingText(true);
      // Focus the text element after state update
      setTimeout(() => {
        if (textInputRef.current) {
          // focus and select all text in textarea
          textInputRef.current.focus();
          textInputRef.current.setSelectionRange(0, textInputRef.current.value.length);
        }
      }, 0);
    }
  };

  const handleTextChange = (text: string) => {
    onUpdate(element.id, { text });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete') {
      e.preventDefault();
      onDelete(element.id);
    }
  };

  const renderElement = () => {
    switch (element.type) {
      case 'rect':
        // element container already positions and sizes us; just
        // render a full‑size div for the rectangle itself
        return (
          <div
            className="absolute"
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: element.fill,
              border: `${element.strokeWidth}px solid ${element.strokeColor}`,
              transform: `rotate(${element.rotation}deg)`,
              cursor: 'move',
            }}
            onClick={handleClick}
            onMouseDown={(e) => {
              e.stopPropagation();
              onDragStart(e, element.id);
            }}
          />
        );

      case 'text':
        return isEditingText ? (
          // textarea is placed inside the outer wrapper, so make its
          // position relative to that container rather than duplicating
          // element.x/element.y offsets (which caused it to drift away
          // from the resize handles).
          <textarea
            ref={textInputRef}
            autoFocus
            value={element.text} // controlled so value always matches state
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              color: element.fill,
              zIndex: element.zIndex + 100,
              fontFamily: 'sans-serif',
              fontSize: '16px',
              padding: '4px 8px',
              border: '2px solid #3b82f6',
              boxSizing: 'border-box',
              resize: 'none',
              backgroundColor: 'white',
            }}
            onChange={(e) => {
              handleTextChange(e.target.value);
            }}
            onBlur={() => {
              setIsEditingText(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsEditingText(false);
              }
            }}
          />
        ) : (
          <div
            className="absolute font-sans"
            style={{
              left: 0,
              top: 0,
              width: '100%',
              height: '100%', // container handles size
              color: element.fill,
              cursor: 'move',
              wordWrap: 'break-word',
              whiteSpace: 'pre-wrap',
              padding: '4px 8px',
              boxSizing: 'border-box', // include padding in width/height
              overflow: 'hidden', // prevent overflow when text is larger than box
            }}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onMouseDown={handleMouseDown}
          >
            {element.text || 'Click to edit'}
          </div>
        );

      case 'image':
        return (
          <div
            className="absolute bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-400"
            style={{
              width: '100%',
              height: '100%',
              cursor: 'move',
            }}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
          >
            <span className="text-gray-500 text-sm">Image Placeholder</span>
          </div>
        );

      default:
        return null;
    }
  };

  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    onResizeStart(e, element.id, handle);
  };

  const renderResizeHandles = () => {
    if (!isSelected) return null;

    const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
    const handleSize = 8;
    const handleOffset = handleSize / 2;

    const positions: { [key: string]: { top: string; left: string } } = {
      nw: { top: `-${handleOffset}px`, left: `-${handleOffset}px` },
      n: { top: `-${handleOffset}px`, left: `calc(50% - ${handleOffset}px)` },
      ne: { top: `-${handleOffset}px`, right: `-${handleOffset}px` },
      e: { top: `calc(50% - ${handleOffset}px)`, right: `-${handleOffset}px` },
      se: { bottom: `-${handleOffset}px`, right: `-${handleOffset}px` },
      s: { bottom: `-${handleOffset}px`, left: `calc(50% - ${handleOffset}px)` },
      sw: { bottom: `-${handleOffset}px`, left: `-${handleOffset}px` },
      w: { top: `calc(50% - ${handleOffset}px)`, left: `-${handleOffset}px` },
    };

    return handles.map((handle) => (
      <div
        key={handle}
        className="absolute bg-blue-500 border border-white rounded-sm"
        style={{
          width: `${handleSize}px`,
          height: `${handleSize}px`,
          cursor: `${handle}-resize`,
          ...positions[handle],
        }}
        onMouseDown={(e) => handleResizeStart(e, handle)}
      />
    ));
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        zIndex: element.zIndex,
      }}
    >
      {renderElement()}
      {isSelected && (
        <>
          <div
            className="absolute w-full h-full border-2 border-blue-500 pointer-events-none"
            style={{
              boxSizing: 'border-box',
            }}
          />
          <div className="absolute w-full h-full pointer-events-auto">
            {renderResizeHandles()}
          </div>
        </>
      )}
    </div>
  );
}
