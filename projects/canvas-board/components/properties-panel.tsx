'use client';

import { CanvasElement } from '@/hooks/use-canvas-state';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface PropertiesPanelProps {
  element: CanvasElement | null;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  onMoveToFront: () => void;
  onMoveToBack: () => void;
}

export function PropertiesPanel({
  element,
  onUpdate,
  onMoveToFront,
  onMoveToBack,
}: PropertiesPanelProps) {
  if (!element) {
    return (
      <div className="w-64 bg-slate-50 border-l border-gray-200 p-4 flex items-center justify-center">
        <p className="text-sm text-gray-500">No element selected</p>
      </div>
    );
  }

  const handleNumberChange = (field: keyof CanvasElement, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      onUpdate({ [field]: num });
    }
  };

  const handleColorChange = (field: string, value: string) => {
    onUpdate({ [field]: value } as any);
  };

  return (
    <div className="w-64 bg-slate-50 border-l border-gray-200 flex flex-col p-4 overflow-y-auto">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Properties</h2>

      <div className="space-y-4">
        {/* Position */}
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-2">Position</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">X</label>
              <Input
                type="number"
                value={element.x}
                onChange={(e) => handleNumberChange('x', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">Y</label>
              <Input
                type="number"
                value={element.y}
                onChange={(e) => handleNumberChange('y', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-2">Size</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-600">W</label>
              <Input
                type="number"
                value={element.width}
                onChange={(e) => handleNumberChange('width', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">H</label>
              <Input
                type="number"
                value={element.height}
                onChange={(e) => handleNumberChange('height', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Colors */}
        {element.type !== 'image' && (
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">Fill Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={element.fill}
                onChange={(e) => handleColorChange('fill', e.target.value)}
                className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <Input
                type="text"
                value={element.fill}
                onChange={(e) => handleColorChange('fill', e.target.value)}
                className="flex-1 h-8 text-sm"
              />
            </div>
          </div>
        )}

        {element.type === 'rect' && (
          <>
            <div>
              <label className="text-xs font-medium text-gray-700 block mb-2">Stroke Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={element.strokeColor}
                  onChange={(e) => handleColorChange('strokeColor', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  type="text"
                  value={element.strokeColor}
                  onChange={(e) => handleColorChange('strokeColor', e.target.value)}
                  className="flex-1 h-8 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 block mb-2">Stroke Width</label>
              <Input
                type="number"
                value={element.strokeWidth}
                onChange={(e) => handleNumberChange('strokeWidth', e.target.value)}
                min="0"
                max="10"
                className="h-8 text-sm"
              />
            </div>
          </>
        )}

        {element.type === 'text' && (
          <>
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-700 block mb-2">Text Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={element.fill}
                  onChange={(e) => handleColorChange('fill', e.target.value)}
                  className="w-10 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <Input
                  type="text"
                  value={element.fill}
                  onChange={(e) => handleColorChange('fill', e.target.value)}
                  className="flex-1 h-8 text-sm"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium text-gray-700 block mb-2">Content</label>
              <Textarea
                value={element.text || ''}
                onChange={(e) => onUpdate({ text: e.target.value })}
                className="h-24 text-sm"
              />
            </div>
          </>
        )}

        {/* Rotation */}
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-2">Rotation</label>
          <Input
            type="number"
            value={element.rotation}
            onChange={(e) => handleNumberChange('rotation', e.target.value)}
            min="0"
            max="360"
            className="h-8 text-sm"
          />
        </div>

        {/* Layering */}
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-2">Layering</label>
          <div className="flex gap-2">
            <Button
              onClick={onMoveToFront}
              variant="outline"
              size="sm"
              className="flex-1 h-8"
            >
              <ChevronUp size={14} />
              Front
            </Button>
            <Button
              onClick={onMoveToBack}
              variant="outline"
              size="sm"
              className="flex-1 h-8"
            >
              <ChevronDown size={14} />
              Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
