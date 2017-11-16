import emotion from '../plugins/emotion';
import javascript from '../features/javascript';
import { callFeature } from './helpers';

describe(`emotion`, () => {
  it(`should add emotion to the plugins list of the babel-loader's options`, () => {
    const result = callFeature(javascript, {}, [emotion()]).module.rules[0]
      .use[0].options.plugins;
    expect(result).toMatchSnapshot();
  });
});
