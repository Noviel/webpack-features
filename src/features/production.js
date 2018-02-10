import webpack from 'webpack';
import UglifyJSPlugin from 'uglifyjs-webpack-plugin';

module.exports = (
  { target },
  { vendor = target.name === 'browsers', manifest = vendor, uglify = true } = {}
) => ({
  plugins: [new webpack.optimize.ModuleConcatenationPlugin()]
    .concat(
      vendor
        ? new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: ({ resource }) => /node_modules/.test(resource),
          })
        : []
    )
    .concat(
      manifest
        ? new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest',
            minChunks: Infinity,
          })
        : []
    )
    .concat(
      uglify
        ? new UglifyJSPlugin({
            uglifyOptions: {
              beautify: false,
              ecma: 6,
              compress: true,
              comments: false,
            },
          })
        : []
    ),
});
