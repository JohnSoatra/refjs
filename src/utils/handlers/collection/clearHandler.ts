import { isMapCollection, removeCacheTry } from "../../utils";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Removes cached proxies for a Map or Set and its entries/values.
 *
 * - For Map, removes both keys and values from the cache.
 * - For Set, removes each value from the cache.
 *
 * @param target The original Map or Set to clear from cache.
 * @param cache WeakMap cache storing raw ↔ proxy objects.
 */
function clearFromCache(target: Map<any, any> | Set<any>, cache: CacheProxy) {
  removeCacheTry(target, cache);
  if (isMapCollection(target)) {
    for (const [key, value] of target) {
      removeCacheTry(key, cache);
      removeCacheTry(value, cache);
    }
  } else {
    for (const value of target) {
      removeCacheTry(value, cache);
    }
  }
}

/**
 * Handles the `clear()` method for reactive Map/Set.
 *
 * - Clears the collection.
 * - Removes all entries from the proxy cache.
 * - Triggers the `onChange` callback if the collection was non-empty.
 *
 * @param proxy The reactive proxy wrapping the collection.
 * @param target The original Map or Set being cleared.
 * @param cache WeakMap cache storing raw ↔ proxy objects.
 * @param onChange Callback triggered on mutation.
 */
export default function clearHandler(
  proxy: any,
  target: Map<any, any> | Set<any>,
  cache: CacheProxy,
  onChange: OnChangeHandler,
) {
  if (target.size > 0) {
    target.clear();
    clearFromCache(target, cache);
    onChange({
      target: proxy,
      action: 'clear',
      key: undefined,
      value: undefined,
      prevValue: undefined,
    });
  }
}
