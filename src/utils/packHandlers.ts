import lookupArrayHandler from "./handlers/array/lookupHandler";
import mutationArrayHandler from "./handlers/array/mutateHandler";
import addHandler from "./handlers/collection/addHandler";
import deleteHandler from "./handlers/collection/deleteHandler";
import getHandler from "./handlers/collection/getHandler";
import hasHandler from "./handlers/collection/hasHandler";
import setHandler from "./handlers/collection/setHandler";
import defaultHandler from "./handlers/defaultHandler";
import iterationHandler from "./handlers/iterationHandler";
import iteratorHandler from "./handlers/iteratorHandler";
import producerArrayHandler from "./handlers/array/producerHandler";
import { CacheProxy } from "../types/createProxy";
import { OnChangeHandler } from "../types/ref";
import pickingArrayHandler from "./handlers/array/pickingHandler";

/**
 * Packs and binds all handler functions with shared context.
 *
 * Each handler receives the `target`, `key`, `cache`, and `onChange` references,
 * ensuring consistent behavior across mutation, lookup, and iteration operations.
 *
 * @param proxy The proxy instance of the target.
 * @param target The raw target object being proxied.
 * @param key The property key currently being accessed.
 * @param cache WeakMap used for proxy–raw mapping to maintain identity.
 * @param onChange Callback invoked when a reactive change occurs.
 * @returns An object containing all pre-bound handler functions.
 */
export default function packHandlers(
  proxy: any,
  target: any,
  key: any,
  cache: CacheProxy,
  onChange: OnChangeHandler,
) {
  return {
    mutationArrayHandler: (...args: any[]) => mutationArrayHandler(proxy, target, key, cache, onChange, ...args),
    producerArrayHandler: (...args: any[]) => producerArrayHandler(target, key, cache, onChange, ...args),
    iterationHandler: (...args: any[]) => iterationHandler(target, key, cache, onChange, ...args),
    iteratorHandler: () => iteratorHandler(target, key, cache, onChange),
    lookupArrayHandler: (...args: any[]) => lookupArrayHandler(target, key, ...args),
    pickingArrayHandler: (...args: any[]) => pickingArrayHandler(target, key, cache, onChange, ...args),
    getHandler: (getKey: any) => getHandler(target, getKey, cache, onChange),
    setHandler: (setKey: any, setValue: any) => setHandler(proxy, target, setKey, setValue, cache, onChange),
    addHandler: (addValue: any) => addHandler(proxy, target, addValue, onChange),
    hasHandler: (hasKey: any) => hasHandler(target, hasKey),
    deleteHandler: (deleteKey: any) => deleteHandler(proxy, target, deleteKey, cache, onChange),
    defaultHandler: (...args: any[]) => defaultHandler(proxy, target, key, ...args),
  }
}
