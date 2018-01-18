import createBEPO from '../babelEnvPresetOptions';

describe('createBabelEnvPresetOptions', () => {
  it('should set correct default values for unspecified parameters', () => {
    const result = createBEPO({
      target: {
        name: 'browsers',
        value: true,
      },
    });
    //expect(result.useBuiltIns).toBe(true);
    expect(result.modules).toBe(false);
  });

  it('should use modern browsers list for `true` value', () => {
    const result = createBEPO({
      target: {
        name: 'browsers',
        value: true,
      },
    });
    expect(result.targets.browsers).toMatchSnapshot();
  });

  it('should set correct legacy browsers targets', () => {
    const result = createBEPO({
      target: {
        name: 'browsers',
        value: 'legacy',
      },
    });
    expect(result.targets.browsers).toMatchSnapshot();
  });

  it('should set correct modern browsers targets', () => {
    const result = createBEPO({
      target: {
        name: 'browsers',
        value: 'modern',
      },
    });
    expect(result.targets.browsers).toMatchSnapshot();
  });

  it('should set a correct node target', () => {
    const result = createBEPO({
      target: {
        name: 'node',
        value: '7.2',
      },
    });
    expect(result.targets.node).toMatchSnapshot();
  });

  it('should set a default node target for `true`', () => {
    const result = createBEPO({
      target: {
        name: 'node',
        value: true,
      },
    });
    expect(result.targets.node).toMatchSnapshot();
  });

  it('should set commonjs modules if node is used as a target', () => {
    const result = createBEPO({
      target: {
        name: 'node',
        value: 'current',
      },
    });
    expect(result.modules).toBe('commonjs');
  });

  it('should uses custom browsers list', () => {
    const customBrowsersList = 'custom browsers list';
    const result = createBEPO({
      target: {
        name: 'browsers',
        value: customBrowsersList,
      },
    });
    expect(result.targets.browsers).toBe(customBrowsersList);
  });
});
