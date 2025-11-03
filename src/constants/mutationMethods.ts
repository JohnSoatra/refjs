const MutationMethods = new Map<any, string[]>([
  [Map, ['set', 'delete', 'clear']],
  [Set, ['add', 'delete', 'clear']],
  [WeakMap, ['set', 'delete']],
  [WeakSet, ['add', 'delete']],
  [Date, ['setDate', 'setFullYear', 'setHours', 'setMilliseconds', 'setMinutes', 'setMonth', 'setSeconds', 'setTime', 'setUTCDate', 'setUTCFullYear', 'setUTCHours', 'setUTCMilliseconds', 'setUTCMinutes', 'setUTCMonth', 'setUTCSeconds', 'setYear']],
  [Array, ['copyWithin', 'fill', 'pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift']],
  [Int8Array, ['copyWithin', 'fill', 'reverse', 'set', 'sort'],],
  [Int16Array, ['copyWithin', 'fill', 'reverse', 'set', 'sort'],],
  [Int32Array, ['copyWithin', 'fill', 'reverse', 'set', 'sort'],],
  [BigInt64Array, ['copyWithin', 'fill', 'reverse', 'set', 'sort'],],
  [BigUint64Array, ['copyWithin', 'fill', 'reverse', 'set', 'sort'],],
  [Float32Array, ['copyWithin', 'fill', 'reverse', 'set', 'sort'],],
  [Float64Array, ['copyWithin', 'fill', 'reverse', 'set', 'sort'],],
  [Uint8Array, ['copyWithin', 'fill', 'reverse', 'set', 'sort'],],
  [Uint8ClampedArray, ['copyWithin', 'fill', 'reverse', 'set', 'sort'],],
  [Uint16Array, ['copyWithin', 'fill', 'reverse', 'set', 'sort'],],
  [Uint32Array, ['copyWithin', 'fill', 'reverse', 'set', 'sort']],
]);

export default MutationMethods;
