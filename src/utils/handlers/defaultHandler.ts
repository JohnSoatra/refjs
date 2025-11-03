import { CacheProxy, CacheShallow } from "../createProxy";
import { toProxies } from "../utils";
import { OnChange } from "../../ref";

export default function defaultHandler(
  proxy: object,
  target: object,
  key: string | symbol,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChange | undefined,
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
