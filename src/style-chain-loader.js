import ChainLoader from './chain-loader';
import { isServer } from './target';

export default class StyleChainLoader extends ChainLoader {
  add(name, options, changePropsForEnv) {
    super.add(name, options, changePropsForEnv);

    for (const l of this.loaders) {
      if (typeof l.options.importLoaders === 'number') {
        l.options.importLoaders++;
      }
    }

    return this;
  }
}

function processCSSLoaderForEnv(props, { target, production }) {
  if (isServer(target)) {
    props.name += '/locals';
  }

  return props;
}

export function createCSSLoader(
  { target, production, useStyleLoader = false }, 
  options = {}, 
  cssLoaderProcessor = processCSSLoaderForEnv
) {
  const loader = new StyleChainLoader({ target, production });

  if (useStyleLoader) {
    loader.add('style-loader');
  }

  const cssLoaderOptions = {
    modules: true,
    importLoaders: -1,
    ...options
  };

  loader.add('css-loader', cssLoaderOptions, cssLoaderProcessor);

  return loader;
}
