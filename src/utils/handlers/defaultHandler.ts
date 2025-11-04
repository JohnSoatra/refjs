import { toProxies } from "../utils";
import { OnChangeHandler } from "../../types/ref";
import { CacheProxy, CacheShallow } from "../../types/createProxy";

export default function defaultHandler(
  proxy: object,
  target: object,
  key: string | symbol,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const result = (target  as any)[key](...toProxies(
    cacheProxy,
    cacheShallow,
    onChange,
    ...args
  ));

  return result === target ? proxy : result;
}
