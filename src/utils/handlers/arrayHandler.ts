import createProxy from "../createProxy";
import { creatable, isProxy, shallowArray } from "../utils";
import { OnChangeHandler } from "../../types/ref";
import { CacheProxy, CacheShallow } from "../../types/createProxy";

export default function arrayHandler(
  target: any,
  key: any,
  value: any[],
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChangeHandler,
) {
  let shallow: any[];

  if (cacheShallow.has(value)) {
    shallow = cacheShallow.get(value);
  } else {
    shallow = shallowArray(value) as any[];
    target[key] = shallow;
    cacheShallow.set(value, shallow);
  }

  for (let index = 0; index < shallow.length; index++) {
    const each = shallow[index];

    if (creatable(each) && !isProxy(each)) {
      if (cacheProxy.has(each)) {
        shallow[index] = cacheProxy.get(each);
      } else {
        shallow[index] = createProxy(each, cacheProxy, cacheShallow, onChange);
      }
    }
  }

  return createProxy(shallow, cacheProxy, cacheShallow, onChange);
}
