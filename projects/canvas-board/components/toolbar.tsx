'use client';

import { Button } from '@/components/ui/button';
import {
  Plus,
  Type,
  Image as ImageIcon,
  Trash2,
  RotateCw,
} from 'lucide-react';

interface ToolbarProps {
  onAddRect: () => void;
  onAddText: () => void;
  onAddImage: () => void;
  onClearCanvas: () => void;
  hasSelectedElement: boolean;
  onDeleteSelected: () => void;
}

export function Toolbar({
  onAddRect,
  onAddText,
  onAddImage,
  onClearCanvas,
  hasSelectedElement,
  onDeleteSelected,
}: ToolbarProps) {
  return (
    <div className="w-64 bg-slate-50 border-r border-gray-200 flex flex-col p-4 gap-4 overflow-y-auto">
      <div className="border-b pb-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Elements</h2>
        <div className="flex flex-col gap-2">
          <Button
            onClick={onAddRect}
            variant="outline"
            className="justify-start gap-2 text-sm h-9"
          >
            <Plus size={16} />
            Add Rectangle
          </Button>
          <Button
            onClick={onAddText}
            variant="outline"
            className="justify-start gap-2 text-sm h-9"
          >
            <Type size={16} />
            Add Text
          </Button>
          <Button
            onClick={onAddImage}
            variant="outline"
            className="justify-start gap-2 text-sm h-9"
          >
            <ImageIcon size={16} />
            Add Image
          </Button>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Selected Element</h3>
        <div className="flex flex-col gap-2">
          <Button
            onClick={onDeleteSelected}
            disabled={!hasSelectedElement}
            variant="destructive"
            className="justify-start gap-2 text-sm h-9"
          >
            <Trash2 size={16} />
            Delete
          </Button>
        </div>
      </div>

      <div className="border-b pb-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Canvas</h3>
        <Button
          onClick={onClearCanvas}
          variant="outline"
          className="justify-start gap-2 text-sm h-9 w-full text-red-600 hover:text-red-700"
        >
          <RotateCw size={16} />
          Clear Canvas
        </Button>
      </div>

      <div className="pt-2 text-xs text-gray-500">
        <p className="font-semibold mb-2">Tips:</p>
        <ul className="space-y-1">
          <li>• Click to select elements</li>
          <li>• Drag to move</li>
          <li>• Drag handles to resize</li>
          <li>• Delete key to remove</li>
          <li>• Double-click text to edit</li>
        </ul>
      </div>
    </div>
  );
}
