import React from "react";

type DirectionType = "up" | "down" | "idle";
interface StateType {
  counter: number;
  direction: DirectionType;
}

function wheelReducer(prevState: StateType, deltaY: number): StateType {
  if (deltaY === 0)
    return { direction: "idle", counter: (prevState.counter + 1) % 2 };
  if (deltaY > 0)
    return { direction: "down", counter: (prevState.counter + 1) % 2 };
  if (deltaY < 0)
    return { direction: "up", counter: (prevState.counter + 1) % 2 };
  else throw Error(`Unhandled action : ${deltaY}`);
}

/**
 * This method use for detecting vertical wheel direction. Useful for non-scrolling view ports.
 *
 * @param debounce in milliseconds. Default value is `0`
 *
 * @return
 * - direction: Scrolling direction. Default is `idle`
 */
export default function useWheelDirection(debounce = 0): DirectionType {
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const [state, action] = React.useReducer(wheelReducer, {
    direction: "idle",
    counter: 0,
  });
  const wheel = React.useCallback(
    ({ deltaY }: WheelEvent) => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        action(deltaY);
      }, debounce);
    },
    [debounce]
  );

  React.useEffect(() => {
    window.addEventListener("wheel", wheel);
    return () => window.removeEventListener("wheel", wheel);
  }, [wheel]);

  return state.direction;
}
