import entry from '../entry';

import { envs } from '../../fixtures';

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
