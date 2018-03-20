const path = require('path');
const validateOptions = require('schema-utils');
const loaderUtils = require('loader-utils');

const schema = {
  type: 'object',
  properties: {
    name: {},
    inline: {
      type: 'boolean',
    },
    regExp: {},
    context: {
      type: 'string',
    },
    publicPath: {},
    outputPath: {},
    useRelativePath: {
      type: 'boolean',
    },
    emitFile: {
      type: 'boolean',
    },
  },
  additionalProperties: true,
};

const template = (prepare, method) => `
${prepare}
const { Module, instantiate, Memory, Table } = WebAssembly;

module.exports = function(
  deps = {
    global: {},
    env: {
      memory: new Memory({ initial: 10, limit: 100 }),
      table: new Table({ initial: 0, element: 'anyfunc' }),
    },
  }
) {
 ${method}
};`;

const fetchTemplate = publicPath => `
  let path = ${publicPath};

  // For WebWorker we should point to origin otherwise 'fetch' will fail
  if (typeof WorkerGlobalScope !== 'undefined' && this instanceof WorkerGlobalScope) {
    if (path && path[0] === '/') {
      path = self.origin + path;
    }
  }

  return fetch(path)
    .then(response => response.arrayBuffer())
    .then(bytes => instantiate(bytes, deps))
`;

module.exports = function(content) {
  const options = loaderUtils.getOptions(this) || {};

  validateOptions(schema, options, 'Awasm Loader');

  if (!this.emitFile && !options.inline)
    throw new Error(
      'Awasm Loader\n\nemitFile is required from module system for non-inline mode'
    );

  if (options.inline) {
    let data = 'var buffer = new ArrayBuffer(' + content.length + ');';
    data += 'var uint8 = new Uint8Array(buffer);';
    data += 'uint8.set([';
    for (let i = 0; i < content.length; i++) {
      data += content[i] + ',';
    }
    data += ']);';

    return template(data, `return instantiate(buffer, deps);`);
  }

  const context =
    options.context ||
    this.rootContext ||
    (this.options && this.options.context);

  const url = loaderUtils.interpolateName(this, options.name, {
    context,
    content,
    regExp: options.regExp,
  });

  let outputPath = url;

  if (options.outputPath) {
    if (typeof options.outputPath === 'function') {
      outputPath = options.outputPath(url);
    } else {
      outputPath = path.posix.join(options.outputPath, url);
    }
  }

  if (options.useRelativePath) {
    const filePath = this.resourcePath;

    const issuer = options.context
      ? context
      : this._module && this._module.issuer && this._module.issuer.context;

    const relativeUrl =
      issuer &&
      path
        .relative(issuer, filePath)
        .split(path.sep)
        .join('/');

    const relativePath = relativeUrl && `${path.dirname(relativeUrl)}/`;

    if (~relativePath.indexOf('../')) {
      outputPath = path.posix.join(outputPath, relativePath, url);
    } else {
      outputPath = path.posix.join(relativePath, url);
    }
  }

  let publicPath = `__webpack_public_path__ + ${JSON.stringify(outputPath)}`;

  if (options.publicPath) {
    if (typeof options.publicPath === 'function') {
      publicPath = options.publicPath(url);
    } else if (options.publicPath.endsWith('/')) {
      publicPath = options.publicPath + url;
    } else {
      publicPath = `${options.publicPath}/${url}`;
    }

    publicPath = JSON.stringify(publicPath);
  }

  if (options.emitFile === undefined || options.emitFile) {
    this.emitFile(outputPath, content);
  }

  return template('', fetchTemplate(publicPath));
};

module.exports.raw = true;
