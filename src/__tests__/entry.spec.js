import entry from '../entry';

const envs = {
  modernBrowsersDev: {
    target: { browsers: 'modern' },
    production: false,
  },

  modernBrowsersProd: {
    target: { browsers: 'modern' },
    production: true,
  },

  legacyBrowsersDev: {
    target: { browsers: 'legacy' },
    production: false,
  },

  legacyBrowsersProd: {
    target: { browsers: 'legacy' },
    production: true,
  },

  nodeProd: {
    target: { node: 'current' },
    production: true,
  },
};

describe('entry', () => {
  describe('should produce correct entries with default options', () => {
    it('for modern browsers in production mode', () => {
      expect(
        entry(envs.modernBrowsersProd, { index: 'index.js' })
      ).toMatchSnapshot();
    });
    it('for modern browsers in development mode', () => {
      expect(
        entry(envs.modernBrowsersDev, { index: 'index.js' })
      ).toMatchSnapshot();
    });
    it('for legacy browsers in production mode', () => {
      expect(
        entry(envs.legacyBrowsersProd, { index: 'index.js' })
      ).toMatchSnapshot();
    });
    it('for legacy browsers in development mode', () => {
      expect(
        entry(envs.legacyBrowsersDev, { index: 'index.js' })
      ).toMatchSnapshot();
    });
  });
});
