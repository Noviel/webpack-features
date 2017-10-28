export default (env, { limit = 10000, name, ...rest } = {}) => {
  if (!name) {
    if (env.production) {
      name = 'media/[hash:8].[ext]';
    } else {
      name = '[name].[ext]';
    }
  }

  return [
    {
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
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: env.publicPath,
          limit,
          name,
          emitFile: !!env.target.browsers,
          ...rest,
        },
      },
    },
  ];
};
