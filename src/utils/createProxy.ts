import Keys from "../constants/keys";
import Symbols from "../constants/symbols";
import packHandlers from "./packHandlers";
import {
  isArray,
  isProxy,
  isMapCollection,
  isSetCollection,
  isCollection,
  isIterationMethod,
  isIteratorMethod,
  isLookupMethod,
  isMutationMethod,
  isForbiddenKey,
  isProducerMethod,
  removeCacheTry,
  isPickingMethod
} from "./utils";
import { CacheProxy } from "../types/createProxy";
import { OnChangeHandler } from "../types/ref";

/**
 * Recursively creates a reactive Proxy around an object, array, or collection.
 *
 * Features:
 * - Reuses cached proxies to maintain reference consistency.
 * - Automatically packs specialized handlers for arrays, maps, and sets.
 * - Triggers `onChange` when properties or collections are mutated.
 * - Safely skips forbidden or internal keys (like Symbols.RawObject).
 *
 * @param content Target object or collection to proxy.
 * @param cache WeakMap used to store raw-to-proxy mappings for identity preservation.
 * @param onChange Callback triggered when reactive mutations occur.
 * @param saveProxy Whether to store the proxy in cache (defaults to true).
 * @returns A reactive Proxy wrapping the original content.
 */
export default function createProxy<T extends Record<string, any>>(
  content: T,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  saveProxy?: boolean,
) {
  if (isProxy(content)) {
    return content;
  }
  const cachedProxy = cache.get(content);
  if (cachedProxy) {
    return cachedProxy;
  }
  const proxy = new Proxy(content, {
    get(target: any, key, receiver) {
      if (key === Symbols.IsProxy) return true;
      if (key === Symbols.RawObject) return content;
      let value: any;
      try { value = Reflect.get(target, key, receiver); }
      catch { value = Reflect.get(target, key); }
      if (
        !(isForbiddenKey(key) || value === undefined || value === null) &&
        (
          isArray(value) ||
          typeof value === 'object' ||
          typeof value === 'function'
        )
      ) {
        if (isArray(value) || typeof value === 'object') return createProxy(value, cache, onChange);
        const handlers = packHandlers(proxy, target, key, cache, onChange);
        if (isMutationMethod(target, key)) return handlers.mutationArrayHandler;
        if (isProducerMethod(target, key)) return handlers.producerArrayHandler;
        if (isIterationMethod(target, key)) return handlers.iterationHandler;
        if (isIteratorMethod(target, key)) return handlers.iteratorHandler;
        if (isLookupMethod(target, key)) return handlers.lookupArrayHandler;
        if (isPickingMethod(target, key)) return handlers.pickingArrayHandler;
        if (isMapCollection(target)) {
          if (key === Keys.Get) return handlers.getHandler;
          if (key === Keys.Set) return handlers.setHandler;
        }
        if (isSetCollection(target) && key === Keys.Add) return handlers.addHandler;
        if (isCollection(target)) {
          if (key === Keys.Has) return handlers.hasHandler;
          if (key === Keys.Delete) return handlers.deleteHandler;
        }
        return handlers.defaultHandler;
      }
      return value;
    },
    set(target, key, newValue, receiver) {
      if (isForbiddenKey(key)) return true;
      const prevValue = target[key];
      if (!Object.is(prevValue, newValue)) {
        const result = Reflect.set(target, key, newValue, receiver);
        if (result) {
          removeCacheTry(prevValue, cache);
          onChange({
            target: proxy,
            action: 'set',
            key,
            value: newValue,
            prevValue,
          });
        }
        return result;
      };
      return true;
    },
    deleteProperty(target, key) {
      if (isForbiddenKey(key)) return true;
      const hasKey = Object.prototype.hasOwnProperty.call(target, key);
      if (hasKey) {
        const prevValue = target[key];
        const result = Reflect.deleteProperty(target, key);
        if (result) {
          removeCacheTry(prevValue, cache);
          onChange({
            target: proxy,
            action: 'delete',
            key,
            value: undefined,
            prevValue
          });
        }
        return result;
      };
      return true;
    }
  });
  if (saveProxy ?? true) {
    cache.set(content, proxy);
  }
  return proxy;
}
