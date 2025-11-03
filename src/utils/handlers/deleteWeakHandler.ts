import createProxy, { CacheProxy, CacheShallow } from "../createProxy";
import { creatable, getRaw, isProxy } from "../utils";
import { OnChange } from "../../ref";

export default function deleteWeakMapHandler(
  proxy: any,
  value: WeakMap<any, any> | WeakSet<any>,
  key: object,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChange | undefined,
) {
  let deleted = value.delete(key);

  if (!deleted && creatable(key)) {
    if (isProxy(key)) {
      deleted = value.delete(getRaw(key));
    } else {
      deleted = value.delete(createProxy(key, cacheProxy, cacheShallow, onChange));
    }
  }

  if (deleted) {
    onChange?.({
      target: proxy,
      action: 'delete',
      key,
      value: undefined
    });
  }

  return deleted;
}
