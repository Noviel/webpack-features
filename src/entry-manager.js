import path from 'path';

import { createHtmlWebpackPluginOptions } from './html-webpack-plugin-options';

const cwd = process.cwd();

const createEntry = ({ 
  name,
  pre = [],
  entry,
  production = true,
  development = true,
  htmlPluginProps = null,
  plugins
}, { 
  HtmlWebpackPlugin 
} = {}) => ({
  name,
  entry: [
    ...pre,
    path.join(cwd, entry) 
  ],

  plugin: htmlPluginProps ? new HtmlWebpackPlugin(createHtmlWebpackPluginOptions(name, htmlPluginProps)) : null,
  plugins,

  production,
  development
});

export default class EntryManager {
  constructor({ plugins }) {
    this.entries = [];
    this.plugins = plugins;
  }

  add(entryDesc) {
    this.entries.push(createEntry(entryDesc, this.plugins));
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
