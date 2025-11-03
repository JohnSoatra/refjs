import createProxy, { CacheProxy, CacheShallow } from "../createProxy";
import { creatable, getRaw, isProxy } from "../utils";
import { OnChange } from "../../ref";

export default function getWeakMapHandler(
  value: WeakMap<any, any>,
  key: object,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChange | undefined,
) {
  let result = value.get(key);

  if (!result && creatable(key)) {
    if (isProxy(key)) {
      result = value.get(getRaw(key));
    } else {
      result = value.get(createProxy(key, cacheProxy, cacheShallow, onChange));
    }
  }

  if (creatable(result)) {
    return createProxy(result, cacheProxy, cacheShallow, onChange);
  }

  return result;
}
