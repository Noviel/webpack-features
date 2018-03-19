import { tsConfigFile } from '../tsConfig';

describe('tsConfig', () => {
  it('should return valid path to `migration` config without arguments', () => {
    expect(tsConfigFile()).toMatchSnapshot();
  });

  it('should return valid path to provided config', () => {
    expect(tsConfigFile('strict')).toMatchSnapshot();
  });
});
