import entry from '../entry';

import { envs } from '../../fixtures';

describe('entry', () => {
  describe('should produce correct entries with default options', () => {
    const entryOpts = { entries: { index: 'index.js' } };
    it('for modern browsers in production mode', () => {
      expect(entry(envs.modernBrowsersProd, entryOpts)).toMatchSnapshot();
    });
    it('for modern browsers in development mode', () => {
      expect(entry(envs.modernBrowsersDev, entryOpts)).toMatchSnapshot();
    });
    it('for legacy browsers in production mode', () => {
      expect(entry(envs.legacyBrowsersProd, entryOpts)).toMatchSnapshot();
    });
    it('for legacy browsers in development mode', () => {
      expect(entry(envs.legacyBrowsersDev, entryOpts)).toMatchSnapshot();
    });
  });

  describe('should work with `entries` arguments', () => {
    it('object', () => {
      expect(entry(envs.modernBrowsersDev, { entries: { main: 'index.js' } })).toMatchSnapshot();  
    })
    it('string', () => {
      expect(entry(envs.modernBrowsersDev, { entries: 'index.js' })).toMatchSnapshot();
    })
 });
});
