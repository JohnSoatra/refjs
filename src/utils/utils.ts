import createProxy from "./createProxy";
import MutationMethods from "../constants/mutationMethods";
import Symbols from "../constants/symbols";
import { OnChange } from "../types/ref";
import { CacheProxy, CacheShallow } from "../types/createProxy";

export function creatable(value: any) {
  return typeof value === 'object' && value !== null;
}

export function isArray(value: any): boolean {
  return Array.isArray(value) || (ArrayBuffer.isView(value) && !(value instanceof DataView));
}

export function isProxy(value: any): boolean {
  return value[Symbols.IsProxy] ?? false;
}

export function getRaw(proxy: any): object | undefined {
  return proxy[Symbols.RawObject];
}

export function mutationMethod(obj: object, key: string) {
  const list = MutationMethods.get(Object.getPrototypeOf(obj).constructor);
  return list ? list.includes(key) : false;
}

export function toProxies(
  cacheProxy: CacheProxy,
  cacheShallow: CacheShallow,
  onChange: OnChange,
  ...args: any[]
) {
  let array: any[] = [];

  for (const each of args) {
    let result;

    if (creatable(each)) {
      if (isProxy(each)) {
        result = each;
      } else if (cacheProxy.has(each)) {
        result = cacheProxy.get(each);
      } else {
        result = createProxy(each, cacheProxy, cacheShallow, onChange, false);
      }
    } else {
      result = each;
    }

    array.push(result);
  }

  return array;
}

export function shallowArray<T>(value: T): T {
  if (Array.isArray(value)) {
    return [...value] as T;
  }
  if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
    return new (value.constructor as any)(value) as T;
  }
  return value;
}

export function getWeakValue(proxy: WeakMap<any, any> | WeakSet<any>, key: object | undefined) {
  if (proxy instanceof WeakMap) {
    return proxy.get(key);
  } else if (proxy.has(key)) {
    return key;
  }
  return undefined;
}

export function nextFrame(callback: () => void) {
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(callback);
  } else {
    setImmediate(callback);
  }
}
export function getNow() {
  if (typeof performance !== 'undefined') {
    return performance.now();
  }
  return Date.now();
}
