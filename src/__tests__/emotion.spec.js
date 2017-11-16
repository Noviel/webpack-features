import emotion from '../plugins/emotion';
import javascript from '../features/javascript';
import { callFeature } from './helpers';

describe(`emotion`, () => {
  it(`should add emotion to the plugins list of the babel-loader's options`, () => {
    expect(
      callFeature(javascript, {}, [emotion()]).use[0].options.plugins
    ).toMatchSnapshot();
  });
});
