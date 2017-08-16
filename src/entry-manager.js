import path from 'path';

import { default as createHtmlWebpackPluginOptions } from './html-webpack-plugin-options';

const cwd = process.cwd();

export const createPreEntries = (list, { production }, preReplacers = {}) => 
  list.reduce((acc, el) => {
    if (el.startsWith('!dev?')) {
      if (production) {
        return acc;
      }
      el = el.substr(5);
    } else if (el.startsWith('!prod?')) {
      if (!production) {
        return acc;
      }
      el = el.substr(6);
    }

    if (preReplacers && typeof preReplacers === 'object' && el in preReplacers) {
      const replaced = preReplacers[el]({ production });
      if (Array.isArray(replaced)) {
        acc.push(...replaced);
      } else {
        acc.push(replaced);
      }
    } else {
      acc.push(el);
    }

    return acc;
  }, []);

export default class EntryManager {
  constructor(env, { plugins, pluginsOptionCreators = {} }) {
    this.entries = [];
    this.plugins = plugins;
    this.env = env;

    this.pluginsOptionsCreators = { 
      HtmlWebpackPlugin: createHtmlWebpackPluginOptions,
      ...pluginsOptionCreators 
    };
  }

  createEntry(app, { preEntryReplacers } = {}) {
    const { pluginsOptionsCreators, plugins, env } = this;

    const config = Object.keys(app).reduce((acc, curr) => {
      if (curr === 'plugins') {
        acc[curr] = Object.keys(app.plugins).reduce((pluginsAcc, pluginsCurr) => {
          if (pluginsCurr in plugins) {
            const Plugin = plugins[pluginsCurr];
            const optionCreator = pluginsOptionsCreators[pluginsCurr];
            const options = typeof optionCreator === 'function'
              ? optionCreator(app.name, app.plugins[pluginsCurr])
              : optionCreator;

            pluginsAcc[pluginsCurr] = new Plugin(options);
          }
          return pluginsAcc;
        }, {});
      } else if (curr === 'pre') {
        acc[curr] = createPreEntries(app['pre'], env, preEntryReplacers);
      } else {
        acc[curr] = app[curr];
      }
  
      return acc;
    }, {});

    const pre = config.pre || [];
    config.entry = [...pre, path.join(cwd, config.entry)];

    return config;
  } 
  
  add(config, replacers) {
    this.entries.push(this.createEntry(config, replacers));
  }

  getEntries() {
    return this.entries
      .reduce((acc, e) => { 
        acc[e.name] = e.entry;
        return acc;
      }, {});
  }

  getPlugins() {
    return this.entries
      .map(e => e.plugins)
      .filter(p => p);
  }

  getAllPlugins() {

  }
}
