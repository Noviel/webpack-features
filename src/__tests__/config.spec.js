import configure from '../config';
import { envs } from '../fixtures';

let config = undefined;

describe('config', () => {
  it('should return list of all features', () => {
    config = configure(envs.modernBrowsersProd);
    expect(config).toMatchSnapshot();
  });
});
