import { toRawArgs } from "../../utils";
import { MutationArrayMethods } from "../../../constants/mutationMethods/array";
import { MutationTypedArrayMethods } from "../../../constants/mutationMethods/typedArray";
import { TypedArray } from "../../../types/types";
import { OnChangeHandler } from "../../../types/ref";

type MutationKey<T> = T extends any[] ?
  MutationArrayMethods :
  MutationTypedArrayMethods;

/**
 * Handles mutation methods on arrays or typed arrays.
 *
 * Supports `push`, `pop`, `shift`, `splice`, `sort`, `fill`, `copyWithin`, etc.
 * - Converts proxied arguments to raw values.
 * - Triggers `onChange` after mutation.
 *
 * @param proxy The reactive proxy object wrapping the target.
 * @param target The target array or typed array being mutated.
 * @param key The mutation method name.
 * @param onChange Callback triggered after mutation.
 * @param args Arguments for the mutation method.
 * @returns The result of the mutation, or the proxy itself if mutated in-place.
 */
function mutationArrayHandler<T extends any[] | TypedArray>(
  proxy: any,
  target: T,
  key: MutationKey<T>,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  const rawArgs = toRawArgs(args);
  const result = (target as any)[key].apply(target, rawArgs);
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
