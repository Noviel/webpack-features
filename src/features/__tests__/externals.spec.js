import externals from '../externals';
import { callFeature, envs } from '../../fixtures';

describe(`externals`, () => {
  it(`should be an empty array for browsers called without options`, () => {
    const result = callFeature(
      externals,
      undefined,
      [],
      envs.modernBrowsersProd
    );
    expect(result['externals']).toBeInstanceOf(Array);
    expect(result['externals'].length).toBe(0);
  });

  it(`should add react to externals`, () => {
    expect(callFeature(externals, { react: true })).toMatchSnapshot();
  });

  it(`should add default externals for node`, () => {
    const result = callFeature(externals, undefined, [], envs.nodeProd);
    expect(result['externals'][0]).toBeInstanceOf(Function);
    expect(result['externals'].length).toBe(1);
  });
});
