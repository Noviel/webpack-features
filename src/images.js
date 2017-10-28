export default (env, { limit = 10000, name, ...rest } = {}) => {
  if (!name) {
    if (!env.production) {
      name = '[name].[ext]';
    } else {
      name = 'images/[hash].[ext]';
    }
  }

  return {
    test: /\.(jpe?g|png|gif|svg)$/i,
    use: {
      loader: 'url-loader',
      options: {
        publicPath: env.publicPath,
        limit,
        name,
        emitFile: !!env.target.browsers,
        ...rest,
      },
    },
  };
};
