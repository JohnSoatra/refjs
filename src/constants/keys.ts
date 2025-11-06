const Keys = {
  Get: 'get',
  Set: 'set',
  Add: 'add',
  Has: 'has',
  Delete: 'delete',
  OnChange: 'onchange',
  ForbiddenKeys: ['__proto__', 'constructor', 'prototype'] as string[],
} as const;

export default Keys;
