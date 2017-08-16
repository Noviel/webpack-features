import createBuildManager from '../build-manager';

describe('createBuildManager', () => {
  const apps = {
    client: {
      name: 'client',
      target: 'client',
      entry: 'src/client.js'
    },
    widget: {
      name: 'widget',
      target: 'client',
      entry: 'src/widget.js'
    },    
    admin: {
      name: 'admin',
      target: 'client',
      entry: 'src/admin.js'
    },
    server: {
      name: 'server',
      target: 'server',
      entry: 'src/server.js'
    },      
  };

  it('should throw with bad config', () => {
    const bm = createBuildManager({
      target: 'client',
      production: true
    });
    
    expect(() => bm.addEntries()).toThrow();
    expect(() => bm.addEntries({})).toThrow();

    expect(() => bm.addEntries({
      entry: 1,
      iAmVeryBadField: ':('
    }))
      .toThrow();
  });

  it('should add only client entries to client target', () => {
    const bm = createBuildManager({
      target: 'client',
      production: true
    });

    bm.addEntries(apps);

    expect(bm.entries())
      .toMatchSnapshot();
  });

  it('should add only server entries to server target', () => {
    const bm = createBuildManager({
      target: 'server',
      production: true
    });

    bm.addEntries(apps);

    expect(bm.entries())
      .toMatchSnapshot();
  });

  it('should add only entries specified in BUILD_APPS', () => {
    const bm = createBuildManager({
      target: 'client',
      BUILD_APPS: 'admin, widget',
      production: true
    });

    bm.addEntries(apps);

    expect(bm.entries())
      .toMatchSnapshot();
  });

  it('should add pre-entries', () => {
    const bm = createBuildManager({
      target: 'client',
      production: true
    });

    bm.addEntries({
      app: {
        name: 'app',
        target: 'client',
        entry: 'src/client/index.js',
        pre: ['babel-polyfill', 'bootstrap'],
      }
    });

    expect(bm.entries())
      .toMatchSnapshot();
  });

  it('should not add dev pre-entries in production mode', () => {
    const bm = createBuildManager({
      target: 'client',
      production: true
    });

    bm.addEntries({
      app: {
        name: 'app',
        target: 'client',
        entry: 'src/client/index.js',
        pre: ['babel-polyfill', '!dev?hot-reload', 'bootstrap'],
      }
    });

    expect(bm.entries())
      .toMatchSnapshot();
  });

  it('should add dev pre-entries in development mode', () => {
    const bm = createBuildManager({
      target: 'client',
      production: false
    });

    bm.addEntries({
      app: {
        name: 'app',
        target: 'client',
        entry: 'src/client/index.js',
        pre: ['babel-polyfill', '!dev?hot-reload', 'bootstrap'],
      }
    });

    expect(bm.entries())
      .toMatchSnapshot();
  });

  it('should add prod pre-entries in production mode', () => {
    const bm = createBuildManager({
      target: 'client',
      production: true
    });

    bm.addEntries({
      app: {
        name: 'app',
        target: 'client',
        entry: 'src/client/index.js',
        pre: ['babel-polyfill', '!prod?optimizer', 'bootstrap'],
      }
    });

    expect(bm.entries())
      .toMatchSnapshot();
  });

  it('should not add prod pre-entries in development mode', () => {
    const bm = createBuildManager({
      target: 'client',
      production: false
    });

    bm.addEntries({
      app: {
        name: 'app',
        target: 'client',
        entry: 'src/client/index.js',
        pre: ['babel-polyfill', '!prod?optimizer', 'bootstrap'],
      }
    });

    expect(bm.entries())
      .toMatchSnapshot();
  });

  it('should apply preEntryReplacers', () => {
    const bm = createBuildManager({
      target: 'client',
      production: false
    });

    bm.addEntries({
      app: {
        name: 'app',
        target: 'client',
        entry: 'src/client/index.js',
        pre: ['babel-polyfill', '!dev?hot-reload', 'bootstrap'],
      }
    }, {
      preEntryReplacers: {
        'hot-reload'({ production }) {
          return production ? 'replaced-entry-prod' : 'replaced-entry-dev';
        }
      }
    });

    expect(bm.entries())
      .toMatchSnapshot();
  });

  it('should create plugins', () => {
    class HtmlWebpackPlugin {
      constructor(opts) {
        this.opts = opts;
        this.plugin = 'FakeHtmlWebpackPlugin';
      }
    }

    const bm = createBuildManager({
      target: 'client',
      production: false
    }, {
      plugins: {
        HtmlWebpackPlugin
      }
    });

    bm.addEntries({
      app: {
        name: 'app',
        target: 'client',
        entry: 'src/client/index.js',
        plugins: {
          HtmlWebpackPlugin: {
            template: 'src/client/index.html',
            filename: 'index.html'
          }
        }
      }
    });

    expect(bm.plugins())
      .toMatchSnapshot();
  });


});
