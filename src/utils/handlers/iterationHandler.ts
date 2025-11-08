import { createCallbackArgs } from "../utils";
import { IterationArrayMethods } from "../../constants/iterationMethods/array";
import { IterationMapMethods } from "../../constants/iterationMethods/map";
import { IterationSetMethods } from "../../constants/iterationMethods/set";
import { TypedArray } from "../../types/types";
import { CacheProxy } from "../../types/createProxy";
import { OnChangeHandler } from "../../types/ref";

type IterationKey<T> =
  T extends any[] ?
  IterationArrayMethods :
  T extends Map<any, any> ?
  IterationMapMethods :
  IterationSetMethods;

/**
* Handles iteration methods like `forEach`, `map`, `filter`, `some`, `every`, etc.
* for Arrays, TypedArrays, Maps, and Sets — ensuring their callbacks receive
* proxied (reactive) elements.
*
* @param target The iterable object (Array, TypedArray, Map, or Set).
* @param key The iteration method key (e.g., 'map', 'forEach', 'filter').
* @param cache WeakMap used for maintaining raw–proxy identity mapping.
* @param onChange Callback triggered when mutations occur within iteration.
* @param args Original arguments passed to the iteration method.
* @returns The result of the iteration method, preserving reactivity.
*/
export default function iterationHandler<T extends any[] | TypedArray | Map<any, any> | Set<any>>(
  target: T,
  key: IterationKey<T>,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const [callbackFn, ...restArgs] = createCallbackArgs(cache, onChange, ...args);
  return (target as any)[key](callbackFn, ...restArgs);
}
