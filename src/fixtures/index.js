// @flow
import applyPlugins from '../lib/apply-plugins';

import type { Env, Target } from '../lib/types';

export const targets: { [string]: { [string]: Target } } = {
  browsers: {
    trueValue: {
      name: 'browsers',
      value: true,
    },
    modern: {
      name: 'browsers',
      value: 'modern',
    },
    legacy: {
      name: 'browsers',
      value: 'legacy',
    },
    custom: {
      name: 'browsers',
      value: 'Chrome > 60',
    },
  },
  node: {
    trueValue: {
      name: 'node',
      value: true,
    },
    current: {
      name: 'node',
      value: 'current',
    },
    custom: {
      name: 'node',
      value: '6.7.0',
    },
  },
};

export const envs: { [string]: Env } = {
  modernBrowsersDev: {
    target: targets.browsers.modern,
    production: false,
  },

  modernBrowsersProd: {
    target: targets.browsers.modern,
    production: true,
  },

  legacyBrowsersProd: {
    target: targets.browsers.legacy,
    production: true,
  },

  legacyBrowsersDev: {
    target: targets.browsers.legacy,
    production: false,
  },

  nodeProd: {
    target: targets.node.current,
    production: true,
  },
};

export const defaultEnv = envs.modernBrowsersProd;

export const callFeature = (
  feature: any,
  options: any = {},
  plugins: any = [],
  env: Env = defaultEnv
) => feature(env, options, { plugins, next: applyPlugins });

const targetName = (target: Target): string => {
  return `${typeof target.value === 'string'
    ? `${target.value}`
    : ''} ${target.name}`;
};

export const captionForEnv = (env: Env) => {
  return `for ${targetName(env.target)} in ${env.production
    ? 'production'
    : 'development'} mode`;
};

export const createTestForEnv = (env: Env) => {};
