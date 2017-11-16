// @flow
import webpack from 'webpack';

import type { Env, ExtendOption } from '../lib/types';

export type options = {|
  $prefix: string,
  NODE_ENV: string,
  [string]: any,
|};

export type result = {|
  plugins: [webpack.DefinePlugin],
|};

export default (
  { production }: Env,
  {
    $prefix = 'process.env.',
    NODE_ENV = production ? 'production' : 'development',
    ...defines
  }: options = {},
  { plugins = [], next }: ExtendOption
): result => {
  const definitions = {};

  if (NODE_ENV) {
    definitions['process.env.NODE_ENV'] = JSON.stringify(NODE_ENV);
  }

  Object.keys(defines).forEach(key => {
    definitions[`${$prefix}${key}`] = JSON.stringify(defines[key]);
  });

  return { plugins: [new webpack.DefinePlugin(definitions)] };
};
