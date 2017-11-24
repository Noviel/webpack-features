// @flow
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

import type { Env, PluginExtendOptions } from './lib/types';

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
  const features = {
    output: addOutput,
    javascript: createJSRule,
    styles: initStyles,
    media: createMediaRule,
    entry: createEntry,
    production: createProductionPlugins,
    define,
    namedModules: createNamedModulesPlugins,
    browser,
    node,
  };

  const wrap = (fn: (Env, any, PluginExtendOptions) => any) => (
    options: any = {},
    plugins: any[] = []
  ) => fn(env, options, { plugins, next: applyPlugin });

  const wrappedFeatures = Object.keys(features).reduce((acc, curr) => {
    acc[curr] = wrap(features[curr]);
    return acc;
  }, {});

  return {
    createConfig(...features: any[]) {
      return merge(...features);
    },

    ...wrappedFeatures,
  };
};
