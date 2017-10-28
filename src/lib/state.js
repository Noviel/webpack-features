// State is the way to allow features access to other added before
//
export default class State {
  constructor() {
    this.state = {
      module: {
        rules: [],
      },
      plugins: [],
    };
  }

  get() {
    return this.state;
  }

  addRules(rules) {
    this.state.module.rules = this.state.module.rules.concat(rules);
  }

  addPlugins(plugins) {
    this.state.plugins = this.state.plugins.concat(plugins);
  }

  rules(condition, rules = this.state.module.rules) {
    return rules.filter(condition);
  }

  loaders(condition, rules = this.state.module.rules) {
    let loaders = [];

    for (const { loader, use } of rules) {
      if (typeof loader === 'string') {
        if (condition(loader)) {
          loaders = loaders.concat(loader);
        }
      } else if (Array.isArray(use)) {
        loaders = loaders.concat(use.filter(condition));
      }
    }
    return loaders;
  }
}
