import { includeExclude } from '../regexp';

describe(`includeExclude`, () => {
  it(`should properly test with excluded key`, () => {
    const regexp = includeExclude(`\\.worker`, `\\.jsx?`, true);
    expect(regexp.test('somefile.worker.js')).toBe(false);
    expect(regexp.test('../somePath/filename.worker.js')).toBe(false);
    expect(regexp.test('anotherJSFile.js')).toBe(true);
    expect(regexp.test('anotherJSFileWorker.js')).toBe(true);
  });

  it(`should properly test with included key`, () => {
    const regexp = includeExclude(`\\.worker`, `\\.jsx?`, false);
    expect(regexp.test('somefile.worker.js')).toBe(true);
    expect(regexp.test('../somePath/filename.worker.js')).toBe(true);
    expect(regexp.test('anotherJSFile.js')).toBe(false);
    expect(regexp.test('anotherJSFileWorker.js')).toBe(false);
  });
});
