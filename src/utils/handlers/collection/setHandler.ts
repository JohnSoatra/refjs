import { removeCacheTry, getRawTry } from "../../utils";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Sets a key-value pair in a Map or WeakMap with reactive tracking.
 *
 * Behavior:
 * - Converts proxied key and value to their raw counterparts.
 * - Only triggers `onChange` if the new value differs from the previous value.
 * - Removes any cached proxy associated with the previous value to prevent memory leaks.
 * - Returns the proxy for chaining.
 *
 * @param proxy The reactive proxy object for change tracking.
 * @param target The Map or WeakMap to update.
 * @param key The key to set (can be proxied).
 * @param value The value to associate with the key (can be proxied).
 * @param cache WeakMap cache storing raw-to-proxy mappings.
 * @param onChange Callback triggered on change events.
 * @returns The proxy object.
 */
export default function setHandler(
  proxy: any,
  target: Map<any, any> | WeakMap<any, any>,
  key: any,
  value: any,
  cache: CacheProxy,
  onChange: OnChangeHandler,
) {
  const rawKey = getRawTry(key);
  const rawValue = getRawTry(value);
  const prevValue = target.get(rawKey);
  if (!Object.is(rawValue, prevValue)) {
    target.set(rawKey, rawValue);
    removeCacheTry(prevValue, cache);
    onChange({
      target: proxy,
      action: 'set',
      key,
      value,
      prevValue,
    });
  }
  return proxy;
}
