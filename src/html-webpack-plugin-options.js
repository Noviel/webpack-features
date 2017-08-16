import path from 'path';

export default function createHtmlWebpackPluginOptions(env, name, optionsOverrides = {}) {
  return {
    filename: `${name}.html`,
    template: path.join(env.root, `${name}.html`),
    chunks: ['manifest', 'vendor', name],
    title: 'SPECIFY TITLE IN OPTIONS',
    inject: 'body',
    ...optionsOverrides
  };
}
