import javascript from '../javascript';
import { callFeature, envs, captionForEnv } from '../../fixtures';

describe('javascript', () => {
  for (const env in envs) {
    it(`should return a valid rule with default paremeters ${captionForEnv(
      envs[env]
    )}`, () => {
      expect(callFeature(javascript, {}, [], envs[env])).toMatchSnapshot();
    });
  }

  it('should apply migration TypeScript', () => {
    expect(
      callFeature(javascript, { typescript: 'migration' })
    ).toMatchSnapshot();
  });

  it('should apply strict TypeScript', () => {
    expect(callFeature(javascript, { typescript: 'strict' })).toMatchSnapshot();
  });
});
