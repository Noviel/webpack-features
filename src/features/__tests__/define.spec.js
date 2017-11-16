import define from '../define';

import { callFeature, envs } from '../../fixtures';

describe('define', () => {
  it('should set correct NODE_ENV based on the `env.production`', () => {
    expect(
      callFeature(define).plugins[0].definitions['process.env.NODE_ENV']
    ).toBe('"production"');
    expect(
      callFeature(define, {}, [], envs.modernBrowsersDev).plugins[0]
        .definitions['process.env.NODE_ENV']
    ).toBe('"development"');
  });

  it('should override NODE_ENV', () => {
    expect(
      callFeature(define, { NODE_ENV: 'TEST' }).plugins[0].definitions[
        'process.env.NODE_ENV'
      ]
    ).toBe('"TEST"');
  });

  it('should not define NODE_ENV if it set to `false`', () => {
    expect(
      callFeature(define, { NODE_ENV: false }).plugins[0].definitions
    ).not.toHaveProperty('process.env.NODE_ENV');
  });

  it('should add primitive values to definitions', () => {
    expect(
      callFeature(define, { VALUE: 100, SECOND: true, THIRD: 'THIRD' })
        .plugins[0].definitions
    ).toMatchSnapshot();
  });

  it('should set a prefix for the every definition except NODE_ENV', () => {
    expect(
      callFeature(define, { $prefix: 'custom_prefix.', VALUE: 500 }).plugins[0]
        .definitions
    ).toMatchSnapshot();
  });
});
