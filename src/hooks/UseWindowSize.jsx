import { useState, useEffect, useRef } from 'react';


export function useWindowSize () {
  const windowInnerHeight = useRef(window.innerHeight);
  const windowInnerWidth = useRef(window.innerWidth);

  const [windowSize, setWindowSize] = useState({
    height: windowInnerHeight.current,
    width: windowInnerWidth.current,
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []); 
  
  return windowSize;
}
