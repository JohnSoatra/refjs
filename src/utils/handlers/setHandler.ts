import createProxy from "../createProxy";
import { creatable, isProxy } from "../utils";
import { OnChangeHandler } from "../../types/ref";
import { CacheProxy, CacheShallow } from "../../types/createProxy";

export default function setHandler(
  target: any,
  key: any,
  value: Set<any>,
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChangeHandler,
) {
  let shallow: Set<any>;

  if (cacheShallow.has(value)) {
    shallow = cacheShallow.get(value);
  } else {
    shallow = new Set(value);
    target[key] = shallow;
    cacheShallow.set(value, shallow);
  }

  for (const each of shallow) {
    if (creatable(each) && !isProxy(each)) {
      let newValue;

      if (cacheProxy.has(each)) {
        newValue = cacheProxy.get(each);
      } else {
        newValue = createProxy(each, cacheProxy, cacheShallow, onChange);
      }

      shallow.delete(each);
      shallow.add(newValue);
    }
  }

  return createProxy(shallow, cacheProxy, cacheShallow, onChange);
}
