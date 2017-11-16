import applyPlugins from '../lib/apply-plugins';

export const envs = {
  modernBrowsersDev: {
    target: { browsers: 'modern' },
    production: false,
  },

  modernBrowsersProd: {
    target: { browsers: 'modern' },
    production: true,
  },

  legacyBrowsersProd: {
    target: { browsers: 'legacy' },
    production: true,
  },

  legacyBrowsersDev: {
    target: { browsers: 'legacy' },
    production: false,
  },

  nodeProd: {
    target: { node: 'current' },
    production: true,
  },
};

export const defaultEnv = envs.modernBrowsersProd;

export const callFeature = (
  feature,
  options = {},
  plugins = [],
  env = defaultEnv
) => feature(env, options, { plugins, next: applyPlugins });

const targetName = target =>
  target.browsers
    ? `${target.browsers} browsers`
    : target.node ? `${target.node} node` : 'unknown taget';

export const captionForEnv = env => {
  return `for ${targetName(env.target)} in ${env.production
    ? 'production'
    : 'development'} mode`;
};

export const createTestForEnv = env => {};
