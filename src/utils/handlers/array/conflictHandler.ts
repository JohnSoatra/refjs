import { createCallbackArgs, createProxyTry, toProxiedItems, toRawArgs } from "../../utils";
import { ConflictArrayMethods } from "../../../constants/conflictMethods/array";
import { CacheProxy } from "../../../types/createProxy";
import { OnChangeHandler } from "../../../types/ref";

/**
 * Handles array methods that have multiple behaviors (iteration, mutation, picking, or producing arrays)
 * in reactive proxied arrays. These "conflict methods" include:
 * 
 * - filter, toSorted  : iteration + producer → return new proxied array
 * - find, findLast    : iteration + picking  → return single proxied item
 * - sort              : iteration + mutation → mutates in place, triggers onChange
 * - pop, shift        : mutation + picking  → remove item, return as proxied value
 * - splice            : mutation + producer → remove/replace items, return removed items as proxied array
 * 
 * This handler ensures that the returned values maintain reactivity and properly trigger the
 * onChange callback when mutations occur.
 */
function conflictArrayHandler(
  proxy: any,
  target: any[],
  key: ConflictArrayMethods,
  cache: CacheProxy,
  onChange: OnChangeHandler,
  ...args: any[]
) {
  let value: any;
  switch (key) {
    // iteration methods
    case "filter":
    case "find":
    case "findLast":
    case "sort":
    case "toSorted":
      const [callbackFn, ...restArgs] = createCallbackArgs(cache, onChange, ...args);
      value = (target as any)[key](callbackFn, ...restArgs);
      switch (key) {
        // producer methods
        case "filter":
        case "toSorted":
          return toProxiedItems(value, cache, onChange);
        // picking methods
        case "find":
        case "findLast":
          return createProxyTry(value, cache, onChange);
        // mutation methods
        case "sort":
          onChange({
            target: proxy,
            action: 'sort',
            key: undefined,
            value: args,
            prevValue: undefined
          });
          return proxy;
      }
    // mutation methods
    case "pop":
    case "shift":
    case "splice":
      const rawArgs = toRawArgs(args);
      value = (target as any)[key].apply(target, rawArgs);
      onChange({
        target: proxy,
        action: key,
        key: undefined,
        value: args,
        prevValue: undefined
      });
      switch (key) {
        // picking methods
        case "pop":
        case "shift":
          return createProxyTry(value, cache, onChange, false);
        // producer methods
        case "splice":
          return toProxiedItems(value, cache, onChange);
      }
  }
}

export default conflictArrayHandler;
