import Keys from "../../../constants/keys";
import { createCallbackArgs, createProxyTry, toProxiedItems, toRawArgs } from "../../utils";
import { MutationArrayMethods } from "../../../constants/mutationMethods/array";
import { MutationTypedArrayMethods } from "../../../constants/mutationMethods/typedArray";
import { CacheProxy } from "../../../types/createProxy";
import { TypedArray } from "../../../types/types";
import { OnChangeHandler } from "../../../types/ref";

type MutationKey<T> = T extends any[] ?
  MutationArrayMethods :
  MutationTypedArrayMethods;

/**
* Handles mutation methods on arrays or typed arrays.
*
* Supports `push`, `pop`, `shift`, `splice`, `sort`, `fill`, `copyWithin`, etc.
* - Ensures arguments are unwrapped from proxies.
* - Proxies returned items for methods like `splice`, `pop`, `shift`.
* - Triggers `onChange` after mutation.
*
* @param proxy The reactive proxy object wrapping the target.
* @param target The target array or typed array being mutated.
* @param key The mutation method name.
* @param cache WeakMap cache for proxies.
* @param onChange Callback triggered after mutation.
* @param args Arguments for the mutation method.
* @returns The result of the mutation, or the proxy itself if mutated in-place.
*/
function mutationArrayHandler<T extends any[] | TypedArray>(
  proxy: any,
  target: T,
  key: MutationKey<T>,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  let result: any;
  let assigned: boolean | undefined;
  if (Array.isArray(target)) {
    if (key === Keys.Sort) {
      const [compareFn] = createCallbackArgs(cache, onChange, args[0]);
      result = target.sort(compareFn);
      assigned = true;
    } else if (key === Keys.Splice) {
      const [start, deleteCount, ...items] = toRawArgs(args);
      const newArray = target.splice(start, deleteCount, ...items);
      result = toProxiedItems(newArray, cache, onChange);
      assigned = true;
    } else if (key === Keys.Pop || key === Keys.Shift) {
      const deletedItem = (target as any)[key]();
      result = createProxyTry(deletedItem, cache, onChange, false);
      assigned = true;
    }
  }
  if (!assigned) {
    const rawArgs = toRawArgs(args);
    result = (target as any)[key].apply(target, rawArgs);
  }
  onChange({
    target: proxy,
    action: key,
    key: undefined,
    value: args,
    prevValue: undefined
  });
  return result === target ? proxy : result;
}

export default mutationArrayHandler;
