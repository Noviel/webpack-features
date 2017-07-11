import { createCSSLoader } from '../style-chain-loader';

describe('cssLoader', () => {  
  
  it('should not modify name of css loader for not server env', () => {
    expect(createCSSLoader({ target: 'client', production: true }).get())
      .toMatchSnapshot();
  });

  it('should modify name of css loader for server env', () => {
    expect(createCSSLoader({ target: 'server', production: true }).get())
      .toMatchSnapshot();
  });

  it('should increment every defined importLoaders', () => {
    expect(
      createCSSLoader({ target: 'server', production: true })
        .add('scss')
        .get()
    )
      .toMatchSnapshot();
  });

});
