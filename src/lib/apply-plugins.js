// @flow
import type { Env, Plugin } from './types';

export default (env: Env, plugins: Plugin[], result: any): any =>
  plugins.reduce((prev, curr) => curr(env, prev), result);
