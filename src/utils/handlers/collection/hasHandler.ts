import { getRawTry } from "../../utils";

/**
 * Checks whether a key exists in a Map, Set, WeakMap, or WeakSet.
 *
 * Behavior:
 * - Converts a proxied key to its raw value to ensure proper lookup.
 * - Works with all supported collections: Map, Set, WeakMap, WeakSet.
 * - Returns a boolean indicating presence.
 *
 * @param target The collection to check.
 * @param key The key or value to look for.
 * @returns `true` if the collection contains the key/value, `false` otherwise.
 */
export default function hasHandler(
  target: Map<any, any> | Set<any> | WeakMap<any, any> | WeakSet<any>,
  key: object,
) {
  const rawKey = getRawTry(key);
  return target.has(rawKey);
}
