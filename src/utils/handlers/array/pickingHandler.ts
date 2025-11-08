import Keys from "../../../constants/keys";
import { createCallbackArgs, createProxyTry } from "../../utils";
import { PickingArrayMethods } from "../../../constants/pickingMethods/array";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Handles "picking" methods on arrays, such as `at`, `find`, and `findLast`.
 *
 * - Unwraps proxied arguments before calling the native method.
 * - Proxies returned objects if necessary.
 * - Returns `undefined` or the proxied result.
 *
 * @param target The target array.
 * @param key The picking method name.
 * @param cache WeakMap cache for proxies.
 * @param onChange Callback triggered when nested proxies are accessed.
 * @param args Arguments for the picking method.
 * @returns The proxied value returned by the picking method.
 */
function pickingArrayHandler(
  target: any[],
  key: PickingArrayMethods,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  let value: any;
  if (key === Keys.At) {
    value = target.at(args[0]);
  } else {
    const [predicate, ...restArgs] = createCallbackArgs(cache, onChange, ...args);
    value = target[key](predicate, ...restArgs);
  }
  return createProxyTry(value, cache, onChange);
}

export default pickingArrayHandler;
