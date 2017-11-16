const targets = {
  browsers: {
    modern: [
      'last 2 Chrome versions',
      'not Chrome < 60',
      'last 2 Safari versions',
      'not Safari < 10.1',
      'last 2 iOS versions',
      'not iOS < 10.3',
      'last 2 Firefox versions',
      'not Firefox < 54',
      'last 2 Edge versions',
      'not Edge < 15',
    ],
    legacy: ['> 1%', 'last 2 versions', 'Firefox ESR'],
  },
  defaultNode: '8.4',
};

export function getBrowsers(value) {
  if (value === true) {
    value = 'modern';
  }
  if (value === 'legacy' || value === 'modern') {
    return targets.browsers[value];
  } else if (typeof value === 'string') {
    return value;
  }
  return null;
}

export function getNode(value) {
  if (value === true) {
    return targets.defaultNode;
  } else if (typeof value === 'string') {
    return value;
  }
  return null;
}
