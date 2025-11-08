import { createProxyTry, getRawTry } from "../../utils";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Handles getting a value from a Map or WeakMap.
 *
 * - Unwraps the key if it is proxied.
 * - Returns the value wrapped in a proxy if applicable.
 *
 * @param target The original Map or WeakMap.
 * @param key The key to retrieve.
 * @param cache WeakMap cache of raw ↔ proxy objects.
 * @param onChange Callback triggered for nested proxies.
 * @returns The proxied value associated with the key, or undefined if not found.
 */
export default function getHandler(
  target: Map<any, any> | WeakMap<any, any>,
  key: any,
  cache: CacheProxy,
  onChange: OnChangeHandler,
) {
  return createProxyTry(target.get(getRawTry(key)), cache, onChange);
}
