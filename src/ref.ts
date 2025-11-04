import Keys from './constants/keys';
import createProxy from './utils/createProxy';
import handleChange from './utils/handleChange';
import { getNow } from './utils/utils';
import { Changes, OnChange, Ref } from './types/ref';

function ref<T>(initial: T, onchange?: OnChange): Ref<T>;
function ref<T = undefined>(): Ref<T | undefined>;
function ref<T>(initial?: T, onchange?: OnChange): Ref<T | undefined> {
  let onChange: OnChange | undefined = onchange;
  const cacheProxy = new WeakMap();
  const cacheShallow = new WeakMap();
  const changes: Changes = {
    latest: getNow(),
    tick: 0,
    scheduled: false,
  }

  return new Proxy(
    createProxy(
      { value: initial },
      cacheProxy,
      cacheShallow,
      (props) => handleChange(changes, onChange, props),
    ),
    {
      get(target, key, receiver) {
        if (key === Keys.OnChange) {
          return onChange;
        }
        return Reflect.get(target, key, receiver);
      },
      set(target, key, newValue, receiver) {
        if (key === Keys.OnChange) {
          onChange = newValue;
          return true;
        }
        return Reflect.set(target, key, newValue, receiver);
      },
    }
  );
}

export default ref;
