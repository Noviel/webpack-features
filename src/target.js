const aliases = {
  server: ['server', 'node', 'node.js'],
  client: ['client', 'web', 'browser']
};

export const isServer = str => str === aliases.server.find(el => el === str);
export const isClient = str => str === aliases.client.find(el => el === str);
