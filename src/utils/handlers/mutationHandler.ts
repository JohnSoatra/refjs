import { CacheProxy, CacheShallow } from "../createProxy";
import { toProxies } from "../utils";
import { OnChange } from "../../ref";

export default function mutationHandler(
  proxy: object,
  target: object,
  key: string,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChange | undefined,
  ...args: any[]
) {
  const props = toProxies(
    cacheProxy,
    cacheShallow,
    onChange,
    ...args
  )
  const result = (target  as any)[key](...props);

  onChange?.({
    target: proxy,
    action: key,
    key: undefined,
    value: props
  });

  return result === target ? proxy : result;
}
