import { createProxyTry, getRawTry } from "../../utils";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Handles getting a value from a Map or WeakMap.
 *
 * Behavior:
 * - Converts a proxied key to its raw value to correctly access the Map/WeakMap.
 * - If the retrieved value is creatable (object/array), wraps it in a proxy to maintain reactivity.
 * - Does not modify the original collection.
 *
 * @param target The original Map or WeakMap.
 * @param key The key to retrieve.
 * @param cache WeakMap cache of raw ↔ proxy objects.
 * @param onChange Callback triggered when nested proxies are accessed.
 * @returns The proxied value associated with the key, or undefined if not found.
 */
export default function getHandler(
  target: Map<any, any> | WeakMap<any, any>,
  key: any,
  cache: CacheProxy,
  onChange: OnChangeHandler,
) {
  const rawKey = getRawTry(key);
  const value = target.get(rawKey);
  return createProxyTry(value, cache, onChange);
}
