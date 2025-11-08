import { getWeakValue, getRawTry, removeCacheTry, isMapCollection } from "../../utils";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Handles deleting a key/value from Map, Set, WeakMap, or WeakSet.
 *
 * - Unwraps the key if it is proxied.
 * - Removes cached proxies related to the key and, for Map, the value.
 * - Triggers the `onChange` callback if deletion succeeds.
 *
 * @param proxy The proxied collection.
 * @param target The original collection (Map, Set, WeakMap, WeakSet).
 * @param key The key to delete.
 * @param cache WeakMap cache of raw ↔ proxy objects.
 * @param onChange Callback triggered after deletion.
 * @returns `true` if the key/value was deleted, `false` otherwise.
 */
export default function deleteHandler(
  proxy: any,
  target: Map<any, any> | Set<any> | WeakMap<any, any> | WeakSet<any>,
  key: any,
  cache: CacheProxy,
  onChange: OnChangeHandler,
) {
  const rawKey = getRawTry(key);
  const prevValue = getWeakValue(target, rawKey);
  const deleted = target.delete(rawKey);
  if (deleted) {
    removeCacheTry(rawKey, cache);
    if (isMapCollection(target)) {
      removeCacheTry(prevValue, cache);
    }
    onChange({
      target: proxy,
      action: 'delete',
      key,
      value: undefined,
      prevValue
    });
  }
  return deleted;
}
