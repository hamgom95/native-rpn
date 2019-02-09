import React from "react";

/**
 * Hook to move item between used / unused list.
 */
export function useSwitchList(initUsed = [], initUnused = []) {
    const [used, setUsed] = React.useState(initUsed);
    const [unused, setUnused] = React.useState(initUnused);
  
    const toUsed = React.useCallback((op) => {
      setUsed(used => [op, ...used]);
      setUnused(unused => unused.filter(item => item !== op));
    }, []);
  
    const toUnused = React.useCallback((op) => {
      setUsed(used => used.filter(item => item !== op));
      setUnused(unused => [...unused, op]);
    }, []);
  
    const toggle = React.useCallback((op) => {
      if (used.includes(op)) {
        toUnused(op);
        return true;
      } else if (unused.includes(op)) {
        toUsed(op);
        return true;
      }
      return false;
    }, []);
  
    return { used, unused, setUsed, setUnused, toUsed, toUnused, toggle };
  }
  