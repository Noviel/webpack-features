import createBEPO from '../babel-env-preset-options';

describe('createBabelEnvPresetOptions', () => {
  it('should throw with no target specified', () => {
    expect(() => createBEPO()).toThrow();
  });

  it('should throw with incorrect browsers targets', () => {
    expect(() => createBEPO({ browsers: 42 })).toThrow();
  });

  it('should set correct default values for unspecified parameters', () => {
    const result = createBEPO({ browsers: true });
    expect(result.useBuiltIns).toBe(true);
    expect(result.modules).toBe(false);
  });

  it('should use modern browsers list for truthy `browsers` values', () => {
    const result = createBEPO({ browsers: true });
    expect(result.targets.browsers).toMatchSnapshot();
  });

  it('should set correct legacy browsers targets', () => {
    const result = createBEPO({ browsers: 'legacy' });
    expect(result.targets.browsers).toMatchSnapshot();
  });

  it('should set correct modern browsers targets', () => {
    const result = createBEPO({ browsers: 'modern' });
    expect(result.targets.browsers).toMatchSnapshot();
  });

  it('should set a correct node target', () => {
    const result = createBEPO({ node: '7.2' });
    expect(result.targets.node).toMatchSnapshot();
  });

  it('should set a default node target if one is not provided', () => {
    const result = createBEPO({ node: true });
    expect(result.targets.node).toMatchSnapshot();
  });

  it('should set commonjs modules if node is used as a target', () => {
    const result = createBEPO({ node: true });
    expect(result.modules).toBe('commonjs');
  });

  it('should provide correct options if both browser and node targets are on', () => {
    const result = createBEPO({ node: true, browsers: 'modern' });
    expect(result).toMatchSnapshot();
  });

  it('should uses custom browsers list', () => {
    const customBrowsersList = 'custom browsers list';
    const result = createBEPO({ browsers: customBrowsersList });
    expect(result.targets.browsers).toBe(customBrowsersList);
  });

  it('should correctly use overrides', () => {
    const result = createBEPO(
      { browsers: 'modern' },
      { modules: 'umd', useBuiltIns: false }
    );
    expect(result).toMatchSnapshot();
  });
});
