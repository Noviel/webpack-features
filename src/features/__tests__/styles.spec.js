import styles, { createTestRegExp } from '../styles';
import { callFeature, envs, captionForEnv } from '../../fixtures';

describe(`createTestRegExp`, () => {
  describe(`cssModules is 'false'`, () => {
    it(`should match filenames without '.module' before an extension`, () => {
      let test = createTestRegExp('css', false);

      expect(test.test('index.css')).toBe(true);
      expect(test.test('some-filename.hash420.css')).toBe(true);

      test = createTestRegExp('scss', false);
      expect(test.test('index.scss')).toBe(true);
      expect(test.test('some-filename.hash420.scss')).toBe(true);

      test = createTestRegExp('less', false);
      expect(test.test('index.less')).toBe(true);
      expect(test.test('some-filename.hash420.less')).toBe(true);
    });

    it(`should not match filenames with '.module' before an extension`, () => {
      let test = createTestRegExp('css', false);

      expect(test.test('index.module.css')).toBe(false);
      expect(test.test('some-filename.hash420.module.css')).toBe(false);

      test = createTestRegExp('scss', false);
      expect(test.test('index.module.scss')).toBe(false);
      expect(test.test('some-filename.hash420.module.scss')).toBe(false);

      test = createTestRegExp('less', false);
      expect(test.test('index.module.less')).toBe(false);
      expect(test.test('some-filename.hash420.module.less')).toBe(false);
    });
  });

  describe(`cssModules is 'true'`, () => {
    it(`should not match filenames without '.module' before an extension`, () => {
      let test = createTestRegExp('css', true);

      expect(test.test('index.css')).toBe(false);
      expect(test.test('some-filename.hash420.css')).toBe(false);

      test = createTestRegExp('scss', true);
      expect(test.test('index.scss')).toBe(false);
      expect(test.test('some-filename.hash420.scss')).toBe(false);

      test = createTestRegExp('less', true);
      expect(test.test('index.less')).toBe(false);
      expect(test.test('some-filename.hash420.less')).toBe(false);
    });

    it(`should match filenames with '.module' before an extension`, () => {
      let test = createTestRegExp('css', true);

      expect(test.test('index.module.css')).toBe(true);
      expect(test.test('some-filename.hash420.module.css')).toBe(true);

      test = createTestRegExp('scss', true);
      expect(test.test('index.module.scss')).toBe(true);
      expect(test.test('some-filename.hash420.module.scss')).toBe(true);

      test = createTestRegExp('less', true);
      expect(test.test('index.module.less')).toBe(true);
      expect(test.test('some-filename.hash420.module.less')).toBe(true);
    });
  });
});

describe(`styles`, () => {
  for (const env in envs) {
    it(`should return a valid rule with default paremeters ${captionForEnv(
      envs[env]
    )}`, () => {
      expect(callFeature(styles, {}, [], envs[env])).toMatchSnapshot();
    });
  }
});
