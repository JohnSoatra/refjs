import createProxy from "../createProxy";
import { creatable, getRaw, isProxy } from "../utils";
import { OnChange } from "../../types/ref";
import { CacheProxy, CacheShallow } from "../../types/createProxy";

export default function getWeakMapHandler(
  value: WeakMap<any, any>,
  key: object,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChange,
) {
  let result = value.get(key);

  if (!result && creatable(key)) {
    if (isProxy(key)) {
      result = value.get(getRaw(key));
    } else {
      result = value.get(createProxy(key, cacheProxy, cacheShallow, onChange, false));
    }
  }

  if (creatable(result)) {
    return createProxy(result, cacheProxy, cacheShallow, onChange);
  }

  return result;
}
