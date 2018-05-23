// @flow
import { getTargetValue } from './targets';
import type { Target } from './types';

type Options = {
  debug: boolean,
  target: Target,
  modules: false | string,
  polyfill: boolean,
};

const createBabelEnvPresetOptions = (options: Options): { [string]: any } => {
  const {
    debug,
    target,
    modules = target.name === 'node' ? 'commonjs' : false,
  } =
    options || {};
  const useBuiltIns =
    options.polyfill !== undefined
      ? options.polyfill
      : target.name === 'browsers' && target.value === 'legacy'
        ? 'entry'
        : false;

  const result = {
    modules,
    useBuiltIns,
    debug,
  };

  if (target.name === 'node' || target.value) {
    result.targets = {
      [target.name]: getTargetValue(target),
    };
  }

  return result;
};

export default createBabelEnvPresetOptions;
