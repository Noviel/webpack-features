import createBootstrapLoader from '../loaders/bootstrap-loader';

describe('createBootstrapLoader', () => {
  it('should throw with undefined configFile', () => {
    expect(() => createBootstrapLoader())
      .toThrow();
  });

  it('should throw with non-string configFile', () => {
    expect(() => createBootstrapLoader(420))
      .toThrow();
  });

  it('should produce a string', () => {
    expect(typeof createBootstrapLoader('configFile'))
      .toBe('string');
  });

  it('should apply replacer', () => {
    const replacer = (loader, env) => {
      return 'replaced';
    };

    expect(createBootstrapLoader('configFile', {}, replacer))
      .toBe('replaced');
  });

});
