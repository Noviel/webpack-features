// @flow
import { getTargetValue } from './targets';
import type { Target } from './types';

type Options = {
  target: Target,
  modules: false | string,
};

const createBabelEnvPresetOptions = (options: Options): { [string]: any } => {
  const { target, modules = target.name === 'node' ? 'commonjs' : false } =
    options || {};

  return {
    targets: {
      [target.name]: getTargetValue(target),
    },
    modules,
    useBuiltIns: true,
  };
};

export default createBabelEnvPresetOptions;
