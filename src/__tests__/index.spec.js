import * as publicAPI from '../index.js';

describe('index', () => {
  it('should expose public API', () => {
    expect(publicAPI).toMatchSnapshot();
  });
});
