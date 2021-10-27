import React from "react";

interface DimensionType {
  width: number;
  height: number;
}

export default function useWindowDimensions(debounce = 0) {
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const [state, setState] = React.useState<DimensionType>({
    width: window.innerWidth ?? 0,
    height: window.innerHeight ?? 0,
  });
  const resize = React.useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setState({ width: window.innerWidth, height: window.innerHeight });
    }, debounce);
  }, [debounce]);

  React.useEffect(() => {
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  });
  return state;
}
