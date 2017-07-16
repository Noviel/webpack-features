import path from 'path';

import { createHtmlWebpackPluginOptions } from './html-webpack-plugin-options';

const cwd = process.cwd();

const createEntry = ({ name, pre = [], entry, production = true, development = true, htmlPluginProps = null }, pluginCreators = {}) => ({
  name,
  entry: [
    ...pre,
    path.join(cwd, entry) 
  ],

  plugin: htmlPluginProps ? new pluginCreators.htmlWebpackPlugin(createHtmlWebpackPluginOptions(name, htmlPluginProps)) : null,

  production,
  development
});

const filter = (arr, production) =>
  arr.filter(e => production ? e.production === production : e.development);

export default class EntryManager {
  constructor({ plugins }) {
    this.entries = [];
    this.plugins = plugins;
  }

  add(entryDesc) {
    this.entries.push(createEntry(entryDesc), this.plugins);
  }

  getEntries({ production }) {
    return filter(this.entries, production).reduce((acc, e) => { 
      acc[e.name] = e.entry;
      return acc;
    }, {});
  }

  getPlugins({ production }) {
    return filter(this.entries, production)
      .map(e => e.plugin)
      .filter(p => p);
  }
}
