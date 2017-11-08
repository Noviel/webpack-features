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

export const captionForEnv = env => {
  return `for ${env.target.browsers} browsers in ${env.production
    ? 'production'
    : 'development'} mode`;
};

export const createTestForEnv = env => {};