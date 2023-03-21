import { type Vector2d } from 'konva/lib/types';
import { useState, useEffect, type RefObject } from 'react';

export default function useDimensions(ref: RefObject<HTMLElement>) {
  const [dimensions, setDimensions] = useState<{width: number, height: number, scale: Vector2d}>();
  const [initialDimensions, setInitialDimensions] = useState<{width: number, height: number}>();

  useEffect(() => {
    const container = ref.current
    if (!container) {
      return ;
    }
    if (!initialDimensions) {
      setInitialDimensions({width: ref.current?.offsetWidth, height: ref.current?.offsetHeight})
    }
    
    function handleResize() {
      const scale = (container?.offsetWidth??0)/(initialDimensions?.width??1)
      console.log(initialDimensions);
      console.log(container?.offsetWidth);
      console.log(scale);
      
      // setDimensions({width: (initialDimensions?.width??1) * scale, height: (initialDimensions?.height??1) * scale, scale: {x: scale, y: scale}});
      setDimensions({width: (initialDimensions?.width??1) * scale, height: (initialDimensions?.height??1) * scale, scale: {x: scale, y: scale}});
    }
    
    handleResize()

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ref, initialDimensions]);

  return dimensions;
}