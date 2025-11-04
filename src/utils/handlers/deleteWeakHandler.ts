import createProxy from "../createProxy";
import { creatable, getRaw, getWeakValue, isProxy } from "../utils";
import { OnChange } from "../../types/ref";
import { CacheProxy, CacheShallow } from "../../types/createProxy";

export default function deleteWeakMapHandler(
  proxy: any,
  target: WeakMap<any, any> | WeakSet<any>,
  key: object,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChange,
) {
  let prevValue = getWeakValue(proxy, key);
  let deleted = target.delete(key);

  if (!deleted && creatable(key)) {
    if (isProxy(key)) {
      const rawKey = getRaw(key);
      prevValue = getWeakValue(proxy, rawKey);
      deleted = target.delete(rawKey);
    } else {
      const proxyValue = createProxy(key, cacheProxy, cacheShallow, onChange, false);
      prevValue = getWeakValue(proxy, proxyValue);
      deleted = target.delete(proxyValue);
    }
  }

  if (deleted) {
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
