import { toProxies } from "../utils";
import { OnChangeHandler } from "../../types/ref";
import { CacheProxy, CacheShallow } from "../../types/createProxy";

export default function mutationHandler(
  proxy: object,
  target: object,
  key: string,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const props = toProxies(
    cacheProxy,
    cacheShallow,
    onChange,
    ...args
  )
  const result = (target  as any)[key](...props);

  onChange({
    target: proxy,
    action: key,
    key: undefined,
    value: props,
    prevValue: undefined
  });

  return result === target ? proxy : result;
}
