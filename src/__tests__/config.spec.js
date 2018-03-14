import configure from '../config';
import { envs } from '../fixtures';

let config = undefined;

beforeEach(() => {
  config = configure(envs.modernBrowsersProd);
});

describe('config', () => {
  it('should return list of all features', () => {
    //const { output } = config;
    expect(config).toMatchSnapshot();
  });
});
