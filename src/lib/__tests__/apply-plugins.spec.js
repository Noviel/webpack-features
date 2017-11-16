// @flow
import applyPlugins from '../apply-plugins';
import { defaultEnv, envs } from '../../fixtures';

const configPart = { prop: 420 };

describe(`applyPlugins`, () => {
  it(`should not modify result if no plugins`, () => {
    expect(applyPlugins(defaultEnv, [], configPart)).toEqual(configPart);
  });

  it(`should correctly apply 'identityPlugin`, () => {
    const identityPlugin = (env, result) => result;
    expect(applyPlugins(defaultEnv, [identityPlugin], configPart)).toEqual(
      configPart
    );
  });

  it(`should correctly apply one plugin`, () => {
    const plugin = (env, result) => ({
      ...result,
      propFromPlugin: 'x_x',
    });

    expect(applyPlugins(defaultEnv, [plugin], configPart)).toEqual({
      prop: 420,
      propFromPlugin: 'x_x',
    });
  });

  it(`should correctly apply multiple plugins`, () => {
    const plugins = [
      100,
      'universe',
      { inner: 'Magnolia' },
    ].map((value, index) => (env, result) => ({
      ...result,
      [`propFromPlugin${index}`]: value,
    }));

    expect(applyPlugins(defaultEnv, plugins, configPart)).toEqual({
      prop: 420,
      propFromPlugin0: 100,
      propFromPlugin1: 'universe',
      propFromPlugin2: {
        inner: 'Magnolia',
      },
    });
  });

  it(`should be able to access 'env'`, () => {
    const envBasedPlugin = (env, result) => ({
      ...result,
      propFromPlugin: env.production ? 'P_P' : 'D_D',
    });

    expect(
      applyPlugins(envs.modernBrowsersProd, [envBasedPlugin], configPart)
    ).toEqual({
      prop: 420,
      propFromPlugin: 'P_P',
    });

    expect(
      applyPlugins(envs.modernBrowsersDev, [envBasedPlugin], configPart)
    ).toEqual({
      prop: 420,
      propFromPlugin: 'D_D',
    });
  });
});
