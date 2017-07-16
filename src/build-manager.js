import { isServer, isClient } from './target';
import EntryManager from './entry-manager';

const createBuildManager = ({ BUILD_APPS, target, production }, { plugins }) => {
  const entryManager = new EntryManager({ plugins });

  const isNeedIncludeEntry = name => BUILD_APPS.indexOf(name) > -1;

  return {
    addClientEntry(props) {
      if (isClient(target) && isNeedIncludeEntry(props.name)) {
        entryManager.add(props);
      }
    },

    addServerEntry(props) {
      if (isServer(target) && isNeedIncludeEntry(props.name)) {
        entryManager.add(props);
      }
    },

    entries() { return entryManager.getEntries({ production }); },
    plugins() { return entryManager.getPlugins({ production }); }
  };
};

export default createBuildManager;
