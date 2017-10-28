import merge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';

import createEntry from './entry';
import createProductionPlugins from './production';

import createJSRule from './javascript';
import initStyles from './styles';
import addEmotion from './emotion';
import createImagesRule from './images';

import createNamedModulesPlugins from './named-modules';
import define from './define';
import State from './lib/state';

export default env => {
  const state = new State();

  if (!env.publicPath) {
    env.publicPath = '/';
  }

  return {
    createConfig(...features) {
      const config = merge([state.get(), ...features]);
      return config;
    },

    javascript(
      {
        eslint = true,
        flow = true,
        modules = false,
        react = true,
        syntaxExtend = true,
        plugins = [],
      } = {}
    ) {
      createJSRule(
        env,
        {
          eslint,
          modules,
          react,
          plugins,
          syntaxExtend,
        },
        state
      );
    },

    styles(...args) {
      initStyles(env, ...args, state);
    },

    emotion() {
      addEmotion(env, undefined, state);
    },

    feature(externalFeature, options) {
      externalFeature(env, options, state);
    },

    images(...args) {
      return { module: { rules: [createImagesRule(env, ...args)] } };
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
