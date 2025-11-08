export type ProducerArrayMethods =
  | 'concat'
  | 'filter'
  | 'flat'
  | 'slice'
  | 'splice'
  | 'toReversed'
  | 'toSorted'
  | 'toSpliced'
  | 'with';

const ProducerArrayMethods = new Set<ProducerArrayMethods>([
  'concat',
  'filter',
  'flat',
  'slice',
  'splice',
  'toReversed',
  'toSorted',
  'toSpliced',
  'with',
]);

export default ProducerArrayMethods;
