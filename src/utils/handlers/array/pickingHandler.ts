import { createProxyTry, toRawArgs } from "../../utils";
import { PickingArrayMethods } from "../../../constants/pickingMethods/array";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Handles "picking" methods on arrays, currently only `at`.
 *
 * Behavior:
 * - Converts proxied arguments to raw values before calling the native method.
 * - Wraps the returned value in a proxy if it's a creatable object.
 * - Returns `undefined` or the proxied result.
 *
 * @param target The target array.
 * @param key The picking method name.
 * @param cache WeakMap cache for proxies.
 * @param onChange Callback triggered for reactive tracking.
 * @param args Arguments passed to the picking method.
 * @returns The proxied value returned by the picking method.
 */
function pickingArrayHandler(
  target: any[],
  key: PickingArrayMethods,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const rawArgs = toRawArgs(args);
  const value = (target as any)[key].apply(target, rawArgs);
  return createProxyTry(value, cache, onChange);
}

export default pickingArrayHandler;
