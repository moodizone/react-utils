import React from "react";

type DirectionType = "up" | "down" | "idle";
interface StateType {
  direction: DirectionType;
  scrollY: number;
}

function scrollReducer(prevState: StateType, scrollY: number): StateType {
  if (scrollY === prevState.scrollY) return { scrollY, direction: "idle" };
  else if (scrollY > prevState.scrollY) return { scrollY, direction: "down" };
  else if (scrollY < prevState.scrollY) return { scrollY, direction: "up" };
  else throw Error(`Unhandled action : ${scrollY}`);
}

/**
 * This method use for detecting vertical scrolling direction
 * @param debounce in milliseconds. Default value is `0`
 *
 * @return
 * - scrollY: `window.scrollY`
 * - direction: Scrolling direction. Default is `idle`
 */
export default function useScrollDirection(debounce = 0): StateType {
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const [state, action] = React.useReducer(scrollReducer, {
    direction: "idle",
    scrollY: window.scrollY ?? 0,
  });
  const scroll = React.useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      action(window.scrollY);
    }, debounce);
  }, [debounce]);

  React.useEffect(() => {
    window.addEventListener("scroll", scroll);
    return () => window.removeEventListener("scroll", scroll);
  }, [scroll]);

  return state;
}
