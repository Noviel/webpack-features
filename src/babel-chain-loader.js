import ChainLoader from './chain-loader';

export function createBabelLoader(
  { target, production }, 
  options = {}, 
  cssLoaderProcessor = props => props
) {
  const loader = new ChainLoader({ target, production });

  const babelLoaderOptions = {
    ...options
  };

  loader.add('babel-loader', babelLoaderOptions, cssLoaderProcessor);

  return loader;
}
