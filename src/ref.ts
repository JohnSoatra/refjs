import createProxy from './utils/createProxy';
import handleChange from './utils/handleChange';
import { getNow, createOptions } from './utils/utils';
import { Ticks, OnChangeHandler, Ref, RefOptions, ChangeEvent } from './types/ref';

/**
 * Creates a reactive reference object with an onchange callback.
 *
 * The returned object has:
 * - `value`: the reactive value of type `T`. Any changes to this value or nested objects/arrays
 *   will trigger the `onchange` callback.
 * - `onchange`: callback function called whenever `value` changes.
 *
 * Example usage:
 * ```ts
 * const count = ref(0, (event) => console.log(event.value));
 * count.value = 5; // Triggers onchange
 * ```
 *
 * @param initial The initial value of the reactive reference.
 * @param onchange Callback to handle change events.
 * @returns A reactive reference object of type `Ref<T>`.
 */
function ref<T>(initial: T, onchange?: OnChangeHandler): Ref<T>;

/**
 * Creates a reactive reference object with configuration options.
 *
 * The returned object has:
 * - `value`: the reactive value of type `T`.
 * - `onchange`: optional callback provided in options.
 * - `options`: allows configuring:
 *   - `cache`: optional WeakMap used to store raw–proxy mappings. 
 *     Useful when sharing the same reactive identity across multiple refs.
 *   - `maxTick`: maximum number of updates allowed per frame.
 *   - `maxTickMessage`: message displayed when maxTick is exceeded.
 *
 * Note: if you pass a custom `cache`, ensure it was created with `WeakMap<object, object>`.
 * Passing a non-WeakMap or mismatched cache may cause inconsistent reactivity.
 *
 * Example usage:
 * ```ts
 * const count = ref(0, { maxTick: 100, maxTickMessage: 'Too many updates', onchange: (e) => console.log(e) });
 * count.value = 5; // Triggers onchange
 * ```
 *
 * @param initial The initial value of the reactive reference.
 * @param options Configuration object of type `RefOptions`.
 * @returns A reactive reference object of type `Ref<T>`.
 */
function ref<T>(initial: T, options?: RefOptions): Ref<T>;

/**
 * Creates a reactive reference object with an optional undefined initial value.
 *
 * The returned object has:
 * - `value`: initially `undefined` (or default type `T | undefined`).
 * - `onchange`: can be assigned later.
 *
 * Example usage:
 * ```ts
 * const count = ref<number>();
 * count.value = 5; // Triggers onchange if assigned
 * ```
 *
 * @returns A reactive reference object of type `Ref<T | undefined>`.
 */
function ref<T = undefined>(): Ref<T | undefined>;
function ref<T>(initial?: T, onchangeOrOptions?: OnChangeHandler | RefOptions): Ref<T | undefined> {
  const options = createOptions(onchangeOrOptions);
  const cache = options.cache ?? new WeakMap();
  const ticks: Ticks = {
    latest: getNow(),
    tick: 0,
    scheduled: false,
  }
  function onChangeHandler(event: ChangeEvent) {
    handleChange(event, ticks, options);
  }
  return createProxy({ value: initial }, cache, onChangeHandler);
}

export default ref;
