import { createLoader } from './rules';

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
    let finalProps = { options, name };

    if (typeof changePropsForEnv === 'function') {
      finalProps = changePropsForEnv(finalProps, { target, production });
    }

    this.loaders.push(
      createLoader(finalProps.name, { 
        ...this.options, 
        ...finalProps.options 
      })
    );

    return this;
  }

  get() {
    return this.loaders;
  }
}
