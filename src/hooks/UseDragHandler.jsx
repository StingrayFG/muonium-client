import { useEffect, useState } from 'react';


export function useDragHandler (lowerDeltaLimit = 10, doNotResetDelta = false) {
  const [mouseDownPosition, setMouseDownPosition] = useState({ x: null, y: null });
  const [dragDelta, setDragDelta] = useState({ x: null, y: null });
  const [isHolding, setIsHolding] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [usedLowerDeltaLimit, setUsedLowerDeltaLimit] = useState(lowerDeltaLimit);
  
  const startDragging = (event) => {
    setIsHolding(true);
    setMouseDownPosition({ 
      x: event.clientX,
      y: event.clientY
    })
  }

  const updateDragging = (event) => {
    if (isHolding) {
      const newDragDelta = { 
        x: event.clientX - mouseDownPosition.x,
        y: event.clientY - mouseDownPosition.y
      }
  
      setDragDelta(newDragDelta);
  
      if (((newDragDelta.x * newDragDelta.x) + (newDragDelta.y * newDragDelta.y) > 
      (usedLowerDeltaLimit * usedLowerDeltaLimit)) && isHolding && !isDragging) {
        setIsDragging(true);
      }
    }
  }

  const stopDragging = () => {
    setIsHolding(false);  
  }

  useEffect(() => {
    if (!isHolding) {
      setIsDragging(false);
      if (!doNotResetDelta) { 
        setDragDelta({ x: null, y: null }) 
      };
    }
  }, [isHolding])

  const updateDelta = (delta) => {
    setUsedLowerDeltaLimit(delta);
  }

  return [isHolding, isDragging, dragDelta, startDragging, updateDragging, stopDragging, updateDelta];
}
