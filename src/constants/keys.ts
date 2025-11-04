const Keys = {
  Get: 'get',
  Has: 'has',
  Delete: 'delete',
  OnChange: 'onchange',
  ForbiddenKeys: ['__proto__', 'constructor', 'prototype'] as string[],
} as const;

export default Keys;
