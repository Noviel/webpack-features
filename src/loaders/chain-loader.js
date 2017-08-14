import createLoader from './create-loader';

export default class ChainLoader {
  constructor({ target, production }, options = {}) {
    if (typeof target === 'undefined') {
      throw new Error('target parameter is required');
    } else if (typeof production === 'undefined') {
      throw new Error('production parameter is required');
    }

    this.target = target;
    this.production = production;
    this.options = options;

    this.loaders = [];
  }

  add(name, options, changePropsForEnv) {
    const { target, production } = this;
    let props = { options, name };

    if (typeof changePropsForEnv === 'function') {
      props = changePropsForEnv(props, { target, production });
    }

    const { name: loaderName, options: loaderOptions } = props;

    this.loaders.push(
      createLoader(loaderName, { 
        ...this.options, 
        ...loaderOptions 
      })
    );

    return this;
  }

  get() {
    return this.loaders;
  }
}
