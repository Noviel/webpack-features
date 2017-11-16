import javascript from '../features/javascript';
import { callFeature, envs, captionForEnv } from './helpers';

describe('javascript', () => {
  // test for every { production, target } combination
  for (const env in envs) {
    it(`should return a valid rule with default paremeters ${captionForEnv(
      envs[env]
    )}`, () => {
      expect(callFeature(javascript, {}, [], envs[env])).toMatchSnapshot();
    });
  }

  // it(`should apply a plugin that overrides any field`, () => {
  //   const createExcludePlugin = newExclude => (env, result) => ({
  //     ...result,
  //     {
  //       use: result.use
  //     },
  //   });
  //   const excludeNothing = createExcludePlugin(null);

  //   expect(callFeature(javascript, {}, [excludeNothing])).toMatchSnapshot();
  // });

  // it(`should apply a plugin that adds a field`, () => {
  //   const createFieldPlugin = (name, value) => (env, rule) => ({
  //     ...rule,
  //     [name]: value,
  //   });
  //   const myFieldPlugin = createFieldPlugin('myField', { value: 100 });

  //   expect(callFeature(javascript, {}, [myFieldPlugin])).toMatchSnapshot();
  // });
});
