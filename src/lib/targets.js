// @flow
import type { TargetValue, Target } from './types';

export const targets = {
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
  node: '8.4',
};

export function getTargetValue(target: Target): TargetValue {
  if (target.value === true) {
    if (target.name === 'node') {
      return targets.node;
    } else {
      return targets.browsers['modern'];
    }
  } else {
    if (
      target.name === 'browsers' &&
      (target.value === 'modern' || target.value === 'legacy')
    ) {
      return targets.browsers[target.value];
    } else {
      return target.value;
    }
  }
}
