import { isServer, isClient } from './target';
import EntryManager from './entry-manager';

const createBuildManager = ({ BUILD_APPS = '*', target, production }, { plugins = {} } = {}) => {
  const entryManager = new EntryManager({ target, production }, { plugins });
  const checkTarget = t => isServer(target) ? isServer : isClient;

  return {
    addEntries(config, replacers) {
      Object.keys(config).forEach(key => {
        const entryConfig = config[key];
        if (!checkTarget(entryConfig.target)) {
          return;
        }

        entryManager.add(config, replacers);
      });
    },

    entries() { return entryManager.getEntries(); },
    plugins() { return entryManager.getPlugins(); }
  };
};

export default createBuildManager;
