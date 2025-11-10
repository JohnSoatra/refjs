import { proxiedFunc } from "../utils";
import { CacheProxy } from "../../types/createProxy";
import { OnChangeHandler } from "../../types/ref";

/**
 * Default handler for method calls or property accesses that do not have
 * a specialized reactive handler.
 *
 * Behavior:
 * - Wraps the original method using `proxiedFunc` to ensure returned values
 *   are properly proxied if they are objects/arrays.
 * - For mutable methods (e.g., Array.reverse, Array.sort) that return
 *   the original array, the proxy is returned from cache to maintain
 *   reference consistency.
 * - For methods returning new objects/arrays (e.g., Array.slice), a new
 *   proxy is created for the result, preserving reactivity.
 * - Primitives are returned as-is.
 *
 * @param proxy The reactive proxy wrapping the target.
 * @param target The original target object.
 * @param key The property or method key being accessed.
 * @param cache WeakMap used to store raw-to-proxy mappings for identity preservation.
 * @param onChange Callback triggered for reactive mutations.
 * @param args Arguments to pass to the method.
 * @returns Either a reactive proxy or the primitive result.
 */
export default function defaultHandler(
  proxy: any,
  target: any,
  key: any,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  // Wraps the original function so that its result is always proxied if necessary
  const func = proxiedFunc(target[key], proxy, cache, onChange);
  return func(...args);
}
