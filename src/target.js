const aliases = {
  server: ['server', 'node', 'node.js'],
  client: ['client', 'web', 'browser']
};

const isStrInList = list => str => list.indexOf(str) > -1;

export const isServer = isStrInList(aliases.server); 
export const isClient = isStrInList(aliases.client);