// @flow
import type { TargetValue, Target } from './types';

export const targets = {
  browsers: {
    modern: ['>0.25%', 'not ie 11', 'not op_mini all'],
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
