import path from 'path';

export default function createHtmlWebpackPluginOptions(name, optionsOverrides = {}) {
  return {
    filename: `${name}.html`,
    template: path.join(process.cwd(), `${name}.html`),
    chunks: ['manifest', 'vendor', name],
    title: 'SPECIFY TITLE IN OPTIONS',
    inject: 'body',
    ...optionsOverrides
  };
}
