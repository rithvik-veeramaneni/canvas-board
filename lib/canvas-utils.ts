import { CanvasElement } from '@/hooks/use-canvas-state';

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

export function createRectElement(x: number, y: number): CanvasElement {
  return {
    id: generateId(),
    type: 'rect',
    x,
    y,
    width: 120,
    height: 80,
    zIndex: 0,
    rotation: 0,
    fill: '#3b82f6',
    strokeColor: '#1e40af',
    strokeWidth: 2,
  };
}

export function createTextElement(x: number, y: number): CanvasElement {
  return {
    id: generateId(),
    type: 'text',
    x,
    y,
    width: 200,
    height: 40,
    zIndex: 0,
    rotation: 0,
    fill: '#000000',
    strokeColor: 'transparent',
    strokeWidth: 0,
    text: 'Double click to edit',
  };
}

export function createImageElement(x: number, y: number): CanvasElement {
  return {
    id: generateId(),
    type: 'image',
    x,
    y,
    width: 150,
    height: 150,
    zIndex: 0,
    rotation: 0,
    fill: '#f3f4f6',
    strokeColor: '#d1d5db',
    strokeWidth: 1,
  };
}

export function isPointInRect(
  px: number,
  py: number,
  x: number,
  y: number,
  width: number,
  height: number
): boolean {
  return px >= x && px <= x + width && py >= y && py <= y + height;
}

export function getResizeHandle(
  px: number,
  py: number,
  x: number,
  y: number,
  width: number,
  height: number,
  handleSize: number = 8
): string | null {
  const halfHandle = handleSize / 2;

  if (Math.abs(px - x) < halfHandle && Math.abs(py - y) < halfHandle) return 'nw';
  if (Math.abs(px - (x + width)) < halfHandle && Math.abs(py - y) < halfHandle) return 'ne';
  if (Math.abs(px - x) < halfHandle && Math.abs(py - (y + height)) < halfHandle) return 'sw';
  if (Math.abs(px - (x + width)) < halfHandle && Math.abs(py - (y + height)) < halfHandle)
    return 'se';

  if (Math.abs(px - x) < halfHandle && py > y + halfHandle && py < y + height - halfHandle)
    return 'w';
  if (Math.abs(px - (x + width)) < halfHandle && py > y + halfHandle && py < y + height - halfHandle)
    return 'e';
  if (Math.abs(py - y) < halfHandle && px > x + halfHandle && px < x + width - halfHandle)
    return 'n';
  if (Math.abs(py - (y + height)) < halfHandle && px > x + halfHandle && px < x + width - halfHandle)
    return 's';

  return null;
}
