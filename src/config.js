import merge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';

import createEntry from './entry';
import createProductionPlugins from './production';

import addOutput from './output';
import createJSRule from './javascript';
import initStyles from './styles';
import addEmotion from './emotion';
import createMediaRule from './media';

import createNamedModulesPlugins from './named-modules';
import define from './define';
import State from './lib/state';

export default env => {
  const state = new State();

  if (!env.publicPath) {
    env.publicPath = '/';
  }

  return {
    getState() {
      return state.get();
    },

    createConfig(...features) {
      const config = merge([state.get(), ...features]);
      return config;
    },

    output(options) {
      return addOutput(env, options, state);
    },

    javascript(options) {
      createJSRule(env, options, state);
    },

    styles(options) {
      initStyles(env, options, state);
    },

    emotion(options) {
      addEmotion(env, options, state);
    },

    feature(externalFeature, options) {
      externalFeature(env, options, state);
    },

    media(...args) {
      return { module: { rules: createMediaRule(env, ...args) } };
    },

    entry(...args) {
      return { entry: createEntry(env, ...args) };
    },

    production(...args) {
      return { plugins: createProductionPlugins(env, ...args) };
    },

    define(defines) {
      return { plugins: [define(env, defines, state)] };
    },

    namedModules(...args) {
      return { plugins: createNamedModulesPlugins(env, ...args) };
    },

    browser() {
      return {
        node: {
          dgram: 'empty',
          fs: 'empty',
          net: 'empty',
          tls: 'empty',
          child_process: 'empty',
        },
      };
    },

    node() {
      return {
        target: 'node',
        externals: [nodeExternals()],
      };
    },
  };
};
