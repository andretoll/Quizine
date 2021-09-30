/* 
This is a hook that is used to retrieve the current window size. 
It exposes the current window size. 
*/

import { useState, useEffect } from 'react';

export function useWindowSize() {

    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });

    useEffect(() => {

      function handleResize() {

        setWindowSize({
          width: window.screen.width,
          height: window.screen.height,
        });
      }

      window.addEventListener("resize", handleResize);
      handleResize();

      return () => window.removeEventListener("resize", handleResize);
    }, []);
    
    return windowSize;
  }