// @flow
import type { Env, Plugin } from './types';

export default (env: Env, plugins: Array<Plugin>, result: any): any =>
  plugins.reduce((prev, curr: Plugin) => curr(env, prev), result);
