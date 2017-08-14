import { createCSSLoader } from '../loaders/style-chain-loader';

describe('cssLoader', () => {  
  
  it('should not modify name of css loader for not server env', () => {
    const match = createCSSLoader({ target: 'client', production: true })
      .get()[0]
      .loader;

    expect(match).toMatchSnapshot();
  });

  it('should modify name of css loader for server env', () => {
    const match = createCSSLoader({ target: 'server', production: true })
      .get()[0]
      .loader;

    expect(match).toMatchSnapshot();
  });

  it('should increment every defined importLoaders', () => {
    expect(
      createCSSLoader({ target: 'server', production: true })
        .add('scss')
        .get()
        .map(v => v.options.importLoaders)
    )
      .toMatchSnapshot();
  });

  it('should add style loader if flag is on', () => {
    expect(
      createCSSLoader({ target: 'client', production: true, useStyleLoader: true })
        .get()[0]
        .loader
    )
      .toMatchSnapshot();
  });

  it('should use custom options', () => {
    expect(
      createCSSLoader({ target: 'client', production: true, useStyleLoader: true }, {
        modules: false,
        localIdentName: '[hash:base64]',
        minimize: true
      })
        .get()[1]
        .options
    )
      .toMatchSnapshot();
  });

});
