import path from 'path';
import webpack from 'webpack';

export default (env, { chunkName } = {}) => [
  new webpack.NamedModulesPlugin(),
  new webpack.NamedChunksPlugin(chunk => {
    if (typeof chunkName === 'function') {
      return chunkName(chunk);
    }

    return (
      chunk.name ||
      chunk
        .mapModules(m => path.relative(m.context, m.userRequest))
        .join('-')
        .replace(/\.js/g, '')
    );
  }),
  new webpack.HashedModuleIdsPlugin(),
];
