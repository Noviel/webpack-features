import createBuildManager from '../build-manager';

describe('createBuildManager', () => {
  it('should add only client entries to client target', () => {
    const bm = createBuildManager({
      target: 'client',
      production: true
    });

    bm.addClientEntry({
      name: 'client',
      entry: 'src/client.js'
    });
    
    bm.addServerEntry({
      name: 'server',
      entry: 'src/server.js'
    });

    expect(bm.entries())
      .toMatchSnapshot();
  });

  it('should add only server entries to server target', () => {
    const bm = createBuildManager({
      target: 'server',
      production: true
    });

    bm.addClientEntry({
      name: 'app',
      entry: 'src/app.js'
    });

    bm.addServerEntry({
      name: 'server',
      entry: 'src/server.js'
    });

    expect(bm.entries())
      .toMatchSnapshot();
  });

  it('should add only entries specified in BUILD_APPS', () => {
    const bm = createBuildManager({
      BUILD_APPS: 'second,third',
      target: 'server',
      production: true
    });

    bm.addServerEntry({
      name: 'first',
      entry: 'src/first.js'
    });

    bm.addServerEntry({
      name: 'second',
      entry: 'src/second.js'
    });

    bm.addServerEntry({
      name: 'third',
      entry: 'src/third.js'
    });

    expect(bm.entries())
      .toMatchSnapshot();
  });  
});
