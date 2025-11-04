import createProxy from "../createProxy";
import { creatable, getRaw, isProxy } from "../utils";
import { OnChange } from "../../types/ref";
import { CacheProxy, CacheShallow } from "../../types/createProxy";

export default function hasWeakMapHandler(
  value: WeakMap<any, any> | WeakSet<any>,
  key: object,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChange,
) {
  let hasValue = value.has(key);

  if (!hasValue && creatable(key)) {
    if (isProxy(key)) {
      hasValue = value.has(getRaw(key));
    } else {
      hasValue = value.has(createProxy(key, cacheProxy, cacheShallow, onChange, false));
    }
  }

  return hasValue;
}
