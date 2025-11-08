export type PickingArrayMethods =
  | 'at'
  | 'find'
  | 'findLast'
  | 'pop'
  | 'shift'
  | 'unshift';

const PickingArrayMethods = new Set<PickingArrayMethods>([
  'at',
  'find',
  'findLast',
  'pop',
  'shift',
  'unshift',
]);

export default PickingArrayMethods;
