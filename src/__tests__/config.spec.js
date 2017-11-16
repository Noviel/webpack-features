import configure from '../config';
import { envs } from '../fixtures';

let config = undefined;

beforeEach(() => {
  config = configure(envs.modernBrowsersProd);
});

describe('output', () => {
  it('should return correct object', () => {
    const { output } = config;
    expect(output()).toMatchSnapshot();
  });
});
