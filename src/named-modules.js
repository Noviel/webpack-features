import path from 'path';
import webpack from 'webpack';

export default (env, options) => [
  new webpack.NamedModulesPlugin(),
  new webpack.NamedChunksPlugin(chunk => {
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
