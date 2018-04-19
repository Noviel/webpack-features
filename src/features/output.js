import path from 'path';
import applyPlugins from '../lib/applyPlugins';

export default (
  { target, production, rootPath, distPath, publicPath },
  {
    filename = production && target.name === 'browsers'
      ? '[name].[chunkhash:8].js'
      : '[name].js',
    chunkFilename = production ? '[name].[chunkhash:8].js' : '[name].js',
    library = false,
    libraryTarget = false,
  },
  { plugins, next }
) => {
  const result = {
    output: {
      // https://reactjs.org/docs/cross-origin-errors.html
      crossOriginLoading: production ? false : 'anonymous',
      path: path.resolve(rootPath, distPath),
      // use `/` as a public path for node
      publicPath: target.name === 'node' ? '/' : publicPath,
      filename,
      chunkFilename,
      // HMR breaks WebWorkers with `window is not defined`
      // this will mitigate it for now
      globalObject: !production ? 'this' : undefined,
    },
  };

  if (library) {
    result.output.library = typeof library === 'string' ? library : 'lib';
  }
  if (libraryTarget) {
    result.output.libraryTarget =
      typeof libraryTarget === 'string'
        ? libraryTarget
        : target.name === 'node' ? 'commonjs' : 'umd';
  }

  return applyPlugins(
    { target, production, rootPath, distPath, publicPath },
    plugins,
    result
  );
};
