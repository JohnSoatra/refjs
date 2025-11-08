import { removeCacheTry, getRawTry } from "../../utils";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Sets a key-value pair in a Map or WeakMap with reactive tracking.
 *
 * - Unwraps the key and value if they are proxied objects.
 * - Triggers `onChange` if the value changes.
 * - Cleans up the previous value from the cache if applicable.
 *
 * @param proxy The proxied object for change tracking.
 * @param target The Map or WeakMap to update.
 * @param key The key to set.
 * @param value The value to associate with the key.
 * @param cache The WeakMap cache storing raw-to-proxy mappings.
 * @param onChange Callback triggered on change events.
 * @returns The proxied object for chaining.
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
