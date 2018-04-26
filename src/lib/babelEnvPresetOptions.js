// @flow
import { getTargetValue } from './targets';
import type { Target } from './types';

type Options = {
  target: Target,
  modules: false | string,
  polyfill: boolean,
};

const createBabelEnvPresetOptions = (options: Options): { [string]: any } => {
  const { target, modules = target.name === 'node' ? 'commonjs' : false } =
    options || {};
  const useBuiltIns =
    options.polyfill !== undefined
      ? options.polyfill
      : target.name === 'browsers' && target.value === 'legacy'
        ? 'entry'
        : false;

  return {
    targets: {
      [target.name]: getTargetValue(target),
    },
    modules,
    useBuiltIns,
  };
};

export default createBabelEnvPresetOptions;
