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

  const result = {
    modules,
    useBuiltIns,
  };

  if (target.name === 'node' || target.value) {
    result.targets = {
      [target.name]: getTargetValue(target),
    };
  }

  return result;
};

export default createBabelEnvPresetOptions;
