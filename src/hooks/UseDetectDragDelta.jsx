import { useState } from 'react';


export function useDetectDragDelta () {
  const [mouseDownPosition, setMouseDownPosition] = useState({ x: null, y: null });
  const [dragDelta, setDragDelta] = useState({ x: null, y: null });

  const dragOnMouseDown = (event) => {
    setMouseDownPosition({ 
      x: event.clientX - event.target.offsetLeft,
      y: event.clientY - event.target.offsetTop
    })
  }

  const dragOnMouseUp = (event) => {
    setDragDelta({ 
      x: (event.clientX - event.target.offsetLeft) - mouseDownPosition.x,
      y: (event.clientY - event.target.offsetTop) - mouseDownPosition.y
    })
  }

  return [dragDelta, dragOnMouseDown, dragOnMouseUp];
}