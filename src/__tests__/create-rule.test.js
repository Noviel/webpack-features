import createRule from '../create-rule';

describe('createRule', () => {
  it('should throw with undefined loaders', () => {
    expect(() => createRule())
      .toThrow();
  });

  it('should throw with a non-object loaders', () => {
    expect(() => createRule('loaders'))
      .toThrow();
  });

  it('should assign default option values', () => {
    expect(createRule({ loader: 'loader' }))
      .toMatchSnapshot();
  });

  it('should merge provided options', () => {
    expect(
      createRule(
        { 
          loader: 'simple' 
        }, 
        {
          test: /\.jsx?$/
        }
      )
    )
      .toMatchSnapshot();
  });
});
