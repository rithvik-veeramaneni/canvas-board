'use client';

import { useReducer, useCallback } from 'react';

export interface CanvasElement {
  id: string;
  type: 'rect' | 'text' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  rotation: number;
  fill: string;
  strokeColor: string;
  strokeWidth: number;
  text?: string;
}

export interface CanvasState {
  elements: CanvasElement[];
  selectedElementId: string | null;
}

type CanvasAction =
  | { type: 'ADD_ELEMENT'; payload: CanvasElement }
  | { type: 'UPDATE_ELEMENT'; payload: Partial<CanvasElement> & { id: string } }
  | { type: 'DELETE_ELEMENT'; payload: string }
  | { type: 'SELECT_ELEMENT'; payload: string | null }
  | { type: 'CLEAR_CANVAS' }
  | { type: 'MOVE_TO_FRONT'; payload: string }
  | { type: 'MOVE_TO_BACK'; payload: string };

const initialState: CanvasState = {
  elements: [],
  selectedElementId: null,
};

function canvasReducer(state: CanvasState, action: CanvasAction): CanvasState {
  switch (action.type) {
    case 'ADD_ELEMENT': {
      const maxZIndex = state.elements.length > 0 
        ? Math.max(...state.elements.map(el => el.zIndex)) 
        : 0;
      return {
        ...state,
        elements: [...state.elements, { ...action.payload, zIndex: maxZIndex + 1 }],
        selectedElementId: action.payload.id,
      };
    }

    case 'UPDATE_ELEMENT': {
      return {
        ...state,
        elements: state.elements.map(el =>
          el.id === action.payload.id ? { ...el, ...action.payload } : el
        ),
      };
    }

    case 'DELETE_ELEMENT': {
      return {
        ...state,
        elements: state.elements.filter(el => el.id !== action.payload),
        selectedElementId:
          state.selectedElementId === action.payload ? null : state.selectedElementId,
      };
    }

    case 'SELECT_ELEMENT': {
      return {
        ...state,
        selectedElementId: action.payload,
      };
    }

    case 'CLEAR_CANVAS': {
      return {
        elements: [],
        selectedElementId: null,
      };
    }

    case 'MOVE_TO_FRONT': {
      const maxZIndex = Math.max(...state.elements.map(el => el.zIndex));
      return {
        ...state,
        elements: state.elements.map(el =>
          el.id === action.payload ? { ...el, zIndex: maxZIndex + 1 } : el
        ),
      };
    }

    case 'MOVE_TO_BACK': {
      const minZIndex = Math.min(...state.elements.map(el => el.zIndex));
      return {
        ...state,
        elements: state.elements.map(el =>
          el.id === action.payload ? { ...el, zIndex: minZIndex - 1 } : el
        ),
      };
    }

    default:
      return state;
  }
}

export function useCanvasState() {
  const [state, dispatch] = useReducer(canvasReducer, initialState);

  const addElement = useCallback((element: CanvasElement) => {
    dispatch({ type: 'ADD_ELEMENT', payload: element });
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<Omit<CanvasElement, 'id'>>) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id, ...updates } });
  }, []);

  const deleteElement = useCallback((id: string) => {
    dispatch({ type: 'DELETE_ELEMENT', payload: id });
  }, []);

  const selectElement = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: id });
  }, []);

  const clearCanvas = useCallback(() => {
    dispatch({ type: 'CLEAR_CANVAS' });
  }, []);

  const moveToFront = useCallback((id: string) => {
    dispatch({ type: 'MOVE_TO_FRONT', payload: id });
  }, []);

  const moveToBack = useCallback((id: string) => {
    dispatch({ type: 'MOVE_TO_BACK', payload: id });
  }, []);

  return {
    state,
    addElement,
    updateElement,
    deleteElement,
    selectElement,
    clearCanvas,
    moveToFront,
    moveToBack,
  };
}
