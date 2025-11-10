import { getRawTry } from "../../utils";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Handles adding a value to a Set or WeakSet.
 *
 * Behavior:
 * - Converts proxied values to raw objects to avoid double-proxy issues.
 * - Only triggers `onChange` if the value was not already present in the Set/WeakSet.
 * - Returns the proxy itself for fluent use.
 *
 * @param proxy The proxied Set/WeakSet.
 * @param target The original Set or WeakSet.
 * @param value The value to add.
 * @param onChange Callback triggered if a new value is added.
 * @returns The proxied Set/WeakSet.
 */
export default function addHandler(
  proxy: any,
  target: Set<any> | WeakSet<any>,
  value: any,
  onChange: OnChangeHandler,
) {
  const rawValue = getRawTry(value);
  const hasValue = target.has(rawValue);
  if (!hasValue) {
    target.add(rawValue);
    onChange({
      target: proxy,
      action: 'add',
      key: value,
      value,
      prevValue: undefined,
    });
  }
  return proxy;
}
