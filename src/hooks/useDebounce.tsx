import React from "react";

type ReadyState = "inProgress" | "finished" | "idle";

/**
 *
 * @param fn It should be use within `React.useCallback` if it change during render.
 *
 * @param debounce in milliseconds. Default value is `0`
 *
 * @param deps It's trigger list and execute fn on changing.
 *
 * @return isReady Indicate current task state.
 *
 * @example
 * [isReady] = useDebounce(()=>fetchAPI(searchTerm), 300 , [searchTerm])
 */
export default function useDebounce(
  fn: Function,
  debounce = 0,
  deps: React.DependencyList
) {
  const callback = React.useRef<Function>(fn);
  const timeout = React.useRef<ReturnType<typeof setTimeout>>();
  const ready = React.useRef<ReadyState>("idle");
  const isReady = React.useCallback(() => ready.current, []);

  React.useEffect(() => {
    ready.current = "inProgress";
    timeout.current && clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      ready.current = "finished";
      callback.current();
    }, debounce);
  }, [debounce, deps]);

  return [isReady];
}
