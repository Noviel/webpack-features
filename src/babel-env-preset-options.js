import { getBrowsers, getNode } from './targets';

const createBabelEnvPresetOptions = (
  {
    browsers = false,
    node = false,
    modules = !!node ? 'commonjs' : false,
  } = {},
  overrides
) => {
  if (!browsers && !node) {
    throw new Error(
      `Incorrect targets - either 'browsers' or 'node' should be selected`
    );
  }

  const targets = {};

  if (browsers) {
    const browsersTarget = getBrowsers(browsers);

    if (!browsersTarget) {
      throw new Error(
        `Wrong browsers targets. Expected ${'"legacy"'}|${'"modern"'}|boolean|string but got ${browsers}`
      );
    }

    targets.browsers = browsersTarget;
  }

  if (node) {
    targets.node = getNode(node);
  }

  return {
    targets,
    modules,
    useBuiltIns: true,
    ...overrides,
  };
};

export default createBabelEnvPresetOptions;
