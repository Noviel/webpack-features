import ChainLoader from './chain-loader';

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
  if (target === 'server') {
    props.name += '/locals';
  }

  return props;
}

export function createCSSLoader({ target, production }, options = {}) {
  const loader = new StyleChainLoader({ target, production });

  loader.add('css-loader', {
    modules: true,
    importLoaders: -1,
    ...options
  }, processCSSLoaderForEnv);

  return loader;
}
