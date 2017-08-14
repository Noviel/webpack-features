import ChainLoader from './chain-loader';

export default function createBabelLoader(
  { target, production }, 
  babelOptions = {}, 
  babelLoaderProcessor = props => props
) {
  const loader = new ChainLoader({ target, production });

  loader.add('babel-loader', babelOptions, babelLoaderProcessor);

  return loader;
}
