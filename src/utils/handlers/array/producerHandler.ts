import Keys from "../../../constants/keys";
import { createCallbackArgs, toProxiedItems, toRawArgs } from "../../utils";
import { ProducerArrayMethods } from "../../../constants/producerMethods/array";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Handles "producer" methods on arrays, such as `concat`, `slice`, `flat`,
 * `splice`, and the newer immutable methods like `toSorted`, `toReversed`, `toSpliced`, `with`.
 *
 * - Unwraps proxied arguments before calling the native method.
 * - Proxies returned arrays or objects.
 * - Does not mutate the original array for immutable methods.
 *
 * @param target The target array.
 * @param key The producer method name.
 * @param cache WeakMap cache for proxies.
 * @param onChange Callback triggered when nested proxies are accessed.
 * @param args Arguments for the producer method.
 * @returns The proxied array returned by the producer method.
 */
function producerArrayHandler(
  target: any[],
  key: ProducerArrayMethods,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  let value: any[];
  if (key === Keys.ToSorted) {
    const [compareFn] = createCallbackArgs(cache, onChange, args[0]);
    value = target.toSorted(compareFn);
  } else {
    const rawArgs = toRawArgs(args);
    value = target[key].apply(target, rawArgs);
  }
  return toProxiedItems(value, cache, onChange);
}

export default producerArrayHandler;
