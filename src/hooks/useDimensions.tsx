import { useState, useEffect, type RefObject } from 'react';

export default function useDimensions(ref: RefObject<HTMLElement>) {
  const [dimensions, setDimensions] = useState<{width: number, height: number}>();


  useEffect(() => {
    console.log('UseDemension');
    const container = ref.current
    if (!container) {
      return ;
    }
    console.log('UseDemension 1');
    // handleResize()
    
    function handleResize() {
      console.log('UseDemension resize');
      
      setDimensions({width: container?.offsetWidth??0, height: container?.offsetHeight??0});
      console.log(dimensions);
      
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [ref]);

  return dimensions;
}