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

    if (el in preReplacers) {
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

const pluginOptionsCreators = {
  HtmlWebpackPlugin: createHtmlWebpackPluginOptions
};

export default class EntryManager {
  constructor(env, { plugins }) {
    this.entries = [];
    this.plugins = plugins;
    this.env = env;
  }

  createEntry(app, { preEntryReplacers }) {
    const plugins = this.plugins;
    const env = this.env;

    const config = Object.keys(app).reduce((acc, curr) => {
      if (curr === 'plugins') {
        acc[curr] = Object.keys(curr).reduce((pluginsAcc, pluginsCurr) => {
          if (pluginsCurr in plugins) {
            pluginsAcc[pluginsCurr] = new plugins[pluginsCurr](pluginOptionsCreators(app.name, app['plugins'][pluginsCurr]));
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

    config.entry = [...config.pre, path.join(cwd, config.entry)];

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
      .map(e => e.plugin)
      .filter(p => p);
  }

  getAllPlugins() {

  }
}
