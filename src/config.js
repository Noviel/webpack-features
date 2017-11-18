import merge from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';

import applyPlugin from './lib/apply-plugins';

import createEntry from './features/entry';
import createProductionPlugins from './features/production';
import addOutput from './features/output';
import createJSRule from './features/javascript';
import initStyles from './features/styles';
import createMediaRule from './features/media';
import createNamedModulesPlugins from './features/named-modules';
import define from './features/define';

import type { Env } from './lib/types';

const browser = () => ({
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
});

const node = () => ({
  target: 'node',
  externals: [nodeExternals()],
});

export default (env: Env) => {
  if (env.rootPath === undefined) {
    env.rootPath = process.cwd();
  }
  if (env.publicPath === undefined) {
    env.publicPath = '/';
  }
  if (env.distPath === undefined) {
    env.distPath = 'dist';
  }

  const features = {
    output: { fn: addOutput },
    javascript: { fn: createJSRule },
    styles: { fn: initStyles },
    media: { fn: createMediaRule },
    entry: { fn: createEntry },
    production: { fn: createProductionPlugins },
    define: { fn: define },
    namedModules: { fn: createNamedModulesPlugins },
    browser: { fn: browser },
    node: { fn: node },
  };

  const wrap = ({ fn }) => (options = {}, plugins = []) =>
    fn(env, options, { plugins, next: applyPlugin });

  const wrappedFeatures = Object.keys(features).reduce((acc, curr) => {
    acc[curr] = wrap(features[curr]);
    return acc;
  }, {});

  return {
    createConfig(...features) {
      const config = merge(...features);
      return config;
    },

    ...wrappedFeatures,
  };
};
