/**
 * Describes a change event triggered by a reactive Ref.
 */
export type ChangeEvent = {
  /** The Ref object whose value changed. */
  target: any;
  /** The type of change, e.g., 'set', 'delete', or a mutation method name. */
  action: string | symbol;
  /** The property key being changed, usually 'value'. */
  key: any;
  /** The new value after the change. */
  value: any;
  /** The previous value before the change. */
  prevValue: any;
};

/**
 * Callback called whenever a Ref's value changes.
 */
export type OnChangeHandler = (event: ChangeEvent) => void;

/**
 * A reactive reference object.
 *
 * @template T The type of the stored value.
 */
export type Ref<T> = {
  /**
   * The reactive value. Reading or updating `.value` will trigger
   * the `onchange` callback if provided.
   */
  value: T;
  /**
   * Optional callback triggered when `.value` changes.
   */
  onchange: OnChangeHandler | undefined;
};

export type Changes = {
  latest: number;
  tick: number;
  scheduled: boolean;
}
