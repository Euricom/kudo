import { type Vector2d } from 'konva/lib/types';
import { useState, useEffect, type RefObject } from 'react';

export default function useDimensions(ref: RefObject<HTMLElement>) {
  const [dimensions, setDimensions] = useState<{width?: number, height?: number, scale?: Vector2d}>();
  const [initialDimensions, setInitialDimensions] = useState<{width: number, height: number}>();

  useEffect(() => {
    const container = ref.current
    if (!container) {
      return ;
    }
    if (!initialDimensions) {
      setInitialDimensions({width: 1500, height: 1000})
    }
    
    function handleResize() {
      const scale = (container?.offsetWidth??0)/(initialDimensions?.width??1)
      setDimensions({width: initialDimensions?.width, height: initialDimensions?.height, scale: {x: scale, y: scale}});
    }
    
    handleResize()

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ref, initialDimensions]);

  return dimensions;
}