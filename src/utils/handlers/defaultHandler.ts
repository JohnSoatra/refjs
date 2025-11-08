/**
 * Default handler for method calls or property accesses that do not have
 * a specialized reactive handler.
 *
 * - Calls the original method on the target with provided arguments.
 * - Returns the proxy itself if the method returns the target (common in
 *   mutable array methods like `reverse` or `sort`) to maintain chainability.
 * - Otherwise, returns the method's actual result.
 *
 * @param proxy The proxied object for reactive tracking.
 * @param target The original target object.
 * @param key The property or method key being accessed.
 * @param args Arguments to pass to the method.
 * @returns Either the proxy (for chainable methods) or the original result.
 */
export default function defaultHandler(
  proxy: any,
  target: any,
  key: any,
  ...args: any[]
) {
  const result = target[key](...args);
  return result === target ? proxy : result;
}
