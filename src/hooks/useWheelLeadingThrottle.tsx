import React from "react";

/**
 * Throttle at leading edge of calling (usable for desktop devices).
 * @param callback
 * @param time In milliseconds
 * @param deps Dependency for callback updating
 */
export default function useWheelLeadingThrottle(
  callback: (d: string) => Promise<unknown>,
  time: number,
  deps: React.DependencyList
) {
  const timeout = React.useRef<ReturnType<typeof setTimeout>>();
  const isThrottlePause = React.useRef<boolean>(false);
  const throttle = React.useCallback(async ({ deltaY }: WheelEvent) => {
    if (isThrottlePause.current) return;
    isThrottlePause.current = true;
    let direction = "idle";
    if (deltaY > 0) direction = "down";
    else if (deltaY < 0) direction = "up";
    await callback(direction);
    timeout.current = setTimeout(() => {
      isThrottlePause.current = false;
    }, time);
    // deps is responsible for updating callback
    /* eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, deps);

  React.useEffect(() => {
    window.addEventListener("wheel", throttle);
    return () => {
      window.removeEventListener("wheel", throttle);
    };
  }, [throttle]);
}
