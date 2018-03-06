import path from 'path';
import applyPlugins from '../lib/applyPlugins';

export default (
  { target, production, rootPath, distPath, publicPath },
  {
    filename = production && target.name === 'browsers'
      ? '[name].[chunkhash].js'
      : '[name].js',
    chunkFilename = production
      ? '[name].[chunkhash].chunk.js'
      : '[name].chunk.js',
    library = false,
    libraryTarget = 'umd',
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

  if (typeof library === 'string') {
    result.output.library = library;
    result.output.libraryTarget = libraryTarget;
  }

  return applyPlugins(
    { target, production, rootPath, distPath, publicPath },
    plugins,
    result
  );
};
