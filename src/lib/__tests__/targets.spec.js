// @flow
import { targets as TARGETS } from '../../fixtures';
import { getTargetValue, targets } from '../targets';

describe(`targets`, () => {
  it(`should be an object with 'browsers.modern', 'browsers.legacy' and 'node`, () => {
    const keys = Object.keys(targets);
    const browsersKeys = Object.keys(targets.browsers);

    expect(keys).toContain('browsers');
    expect(keys).toContain('node');
    expect(browsersKeys).toContain('legacy');
    expect(browsersKeys).toContain('modern');
  });
});

describe(`getTargetValue`, () => {
  it(`should return modern browsers list for 'true' value`, () => {
    expect(getTargetValue(TARGETS.browsers.trueValue)).toEqual(
      targets.browsers['modern']
    );
  });

  it(`should return legacy browsers list`, () => {
    expect(getTargetValue(TARGETS.browsers.legacy)).toEqual(
      targets.browsers['legacy']
    );
  });

  it(`should return modern browsers list`, () => {
    expect(getTargetValue(TARGETS.browsers.modern)).toEqual(
      targets.browsers['modern']
    );
  });

  it(`should return custom browsers list`, () => {
    expect(getTargetValue(TARGETS.browsers.custom)).toEqual(
      TARGETS.browsers.custom.value
    );
  });
});
