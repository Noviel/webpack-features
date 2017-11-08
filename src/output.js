import path from 'path';

export default (
  { target, production, rootPath, distPath, publicPath },
  {
    filename = production && !!target.browsers
      ? '[name].[chunkhash].js'
      : '[name].js',
    chunkFilename = production
      ? '[name].[chunkhash].chunk.js'
      : '[name].chunk.js',
    library = false,
    libraryTarget = 'umd',
  } = {}
) => {
  const result = {
    output: {
      // https://reactjs.org/docs/cross-origin-errors.html
      crossOriginLoading: production ? false : 'anonymous',
      path: path.resolve(rootPath, distPath),
      // use `/` as a public path for node
      publicPath: !target.browsers ? '/' : publicPath,
      filename,
      chunkFilename,
    },
  };

  if (typeof library === 'string') {
    result.output.library = library;
    result.output.libraryTarget = libraryTarget;
  }

  return result;
};
