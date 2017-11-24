// @flow
import webpack from 'webpack';

import type { Exact, Env, PluginExtendOptions } from '../lib/types';

type _Options = {
  $prefix: string,
  NODE_ENV: string,
  [string]: any,
};

export type Options = Exact<_Options>;

export type Result = {|
  plugins: [webpack.DefinePlugin],
|};

export default (
  env: Env,
  {
    $prefix = 'process.env.',
    NODE_ENV = env.production ? 'production' : 'development',
    ...defines
  }: Options = {},
  { plugins, next }: PluginExtendOptions
): Result => {
  const definitions = {};

  if (NODE_ENV) {
    definitions['process.env.NODE_ENV'] = JSON.stringify(NODE_ENV);
  }

  Object.keys(defines).forEach((key: string) => {
    definitions[`${$prefix}${key}`] = JSON.stringify(defines[key]);
  });

  return next(env, plugins, {
    plugins: [new webpack.DefinePlugin(definitions)],
  });
};
