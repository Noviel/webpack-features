import presetReact from '../presets/react';

describe(`presetReact`, () => {
  it(`should be good`, () => {
    expect(presetReact({ entry: 'index.js' })).toMatchSnapshot();
  });
  it(`should be good with emotion`, () => {
    expect(presetReact({ entry: 'index.js', emotion: true })).toMatchSnapshot();
  });
});
