import { createProxyTry, getRawTry } from "../../utils";
import { CacheProxy, CacheShallow } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

export default function getHandler(
  target: Map<any, any> | WeakMap<any, any>,
  key: any,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChangeHandler,
) {
  return createProxyTry(target.get(getRawTry(key)), cacheProxy, cacheShallow, onChange);
}
