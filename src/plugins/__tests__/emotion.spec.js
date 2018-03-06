import emotion from '../emotion';
import javascript from '../../features/javascript';
import { callFeature } from '../../fixtures';

describe(`emotion`, () => {
  it(`should add emotion to the plugins list of the babel-loader's options`, () => {
    const result = callFeature(javascript, {}, [emotion()]).module.rules;
    expect(result).toMatchSnapshot();
  });
});
