import { getRawTry } from "../../utils";

/**
 * Checks whether a key exists in a Map, Set, WeakMap, or WeakSet.
 *
 * - Unwraps the key if it is a proxied object.
 *
 * @param target The collection to check.
 * @param key The key or value to look for.
 * @returns `true` if the collection contains the key/value, `false` otherwise.
 */
export default function hasHandler(
  target: Map<any, any> | Set<any> | WeakMap<any, any> | WeakSet<any>,
  key: object,
) {
  return target.has(getRawTry(key));
}
