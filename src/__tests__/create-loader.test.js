import createLoader from '../loaders/create-loader';

describe('createLoader', () => {
  it('should throw with an undefined name', () => {
    expect(() => createLoader())
      .toThrow();
  });

  it('should throw with a non-string name', () => {
    expect(() => createLoader(420))
      .toThrow();
  });

  it('should override name with a string', () => {
    expect(createLoader('name', {}, { nameOverride: 'override' }))
      .toMatchSnapshot();
  });

  it('should override name with a function', () => {
    expect(createLoader('name', {}, { 
      nameOverride: name => `${name}-override`
    }))
      .toMatchSnapshot();
  });

  it('should return correct loader name', () => {
    expect(createLoader('strange-name-2').loader)
      .toMatchSnapshot();
  });

  it('should return correct options', () => {
    expect(createLoader('name', { a: { option: true }, b: 'option' }))
      .toMatchSnapshot();
  });
});
