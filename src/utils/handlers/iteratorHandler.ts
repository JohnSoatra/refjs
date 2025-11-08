import { createProxiedIterator } from "../utils";
import { IteratorMethods } from "../../constants/iteratorMethods";
import { TypedArray } from "../../types/types";
import { CacheProxy } from "../../types/createProxy";
import { OnChangeHandler } from "../../types/ref";

/**
 * Wraps an iterator (from Array, TypedArray, Map, or Set) in a proxied version
 * so that values yielded during iteration remain reactive.
 *
 * @param target The iterable target (Array, TypedArray, Map, or Set).
 * @param key The iterator method (e.g., Symbol.iterator, 'entries', 'values').
 * @param cache WeakMap used for raw–proxy mapping to preserve identity.
 * @param onChange Callback triggered when mutations occur during iteration.
 * @returns A proxied iterator that yields reactive values.
 */
export default function iteratorHandler(
  target: any[] | TypedArray | Map<any, any> | Set<any>,
  key: IteratorMethods,
  cache: CacheProxy,
  onChange: OnChangeHandler,
): Iterator<any> & Iterable<any> {
  const iterator = target[key]() as Iterator<any>;
  return createProxiedIterator(iterator, cache, onChange);
}
