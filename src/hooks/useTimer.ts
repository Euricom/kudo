import { useRef } from "react";

const useTimer = () => {
  const start = useRef(0);
  const startTimer = () => {
    start.current = performance.now();
  };
  const stopTimer = () => {
    return performance.now() - start.current;
  };
  return { startTimer, stopTimer };
};

export default useTimer;
