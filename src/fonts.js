export default function(
  { fileSizeLimit = 10000, imageName = 'images/[hash].[ext]' } = {}
) {
  return [
    {
      test: /\.woff(2)?(\?[a-z0-9]+)?$/,
      loader: `url-loader?limit=${fileSizeLimit}&mimetype=application/font-woff`,
    },
    {
      test: /\.(ttf|eot)(\?[a-z0-9]+)?$/,
      loader: `url-loader?limit=${fileSizeLimit}`,
    },
  ];
}
