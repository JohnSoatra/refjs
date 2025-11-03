import Keys from './constants/keys';
import createProxy from './utils/createProxy';

export type OnChange = (changes: {
  target: any;
  action: string | symbol;
  key: any;
  value: any;
}) => void;

export type Ref<T> = {
  value: T;
  onchange: OnChange | undefined;
};

function ref<T>(initial: T, onchange?: OnChange): Ref<T>;
function ref<T = undefined>(): Ref<T | undefined>;
function ref<T>(initial?: T, onchange?: OnChange): Ref<T | undefined> {
  let onChange: Ref<T>['onchange'] = onchange;
  const cacheProxy = new WeakMap();
  const cacheShallow = new WeakMap();

  return new Proxy(
    createProxy({ value: initial }, cacheProxy, cacheShallow, onChange), {
    get(target, key, receiver) {
      if (key === Keys.OnChange) {
        return onChange;
      }
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      if (key === Keys.OnChange) {
        onChange = value;
        return true;
      }
      return Reflect.set(target, key, value, receiver);
    },
  });
}

export default ref;
