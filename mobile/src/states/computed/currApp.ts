import {create} from 'zustand';
import {AppProps, IndexProps, useIndex} from '@/states/temporary/index';
import {useDefaultProviders} from '../persistent/defaultProviders';
import {useVersions} from './versions';

export interface CurrAppProps extends AppProps {
  name: string;
  version: string | null;
  defaultProvider: string;
}

export interface useCurrAppProps {
  currApp: CurrAppProps | null;
  setCurrApp: (appName: string | null) => void;
  refresh: () => void;
}

export const useCurrApp = create<useCurrAppProps>((set, get) => ({
  currApp: null,
  setCurrApp: appName => {
    if (appName === null) {
      set({currApp: null});
      return;
    }
    const index = useIndex.getState().index;
    const versions = useVersions.getState().versions;
    const defaultProviders = useDefaultProviders.getState().defaultProviders;
    const defaultProvider =
      defaultProviders[appName] || Object.keys(index[appName].providers)[0];
    set({
      currApp: {
        ...index[appName],
        name: appName,
        version: versions[appName] ?? null,
        defaultProvider,
      },
    });
  },
  refresh: () => {
    const currApp = get().currApp;
    if (currApp === null) return;
    const index = useIndex.getState().index;
    const versions = useVersions.getState().versions;
    const defaultProviders = useDefaultProviders.getState().defaultProviders;
    const defaultProvider =
      defaultProviders[currApp.name] ||
      Object.keys(index[currApp.name].providers)[0];
    set({
      currApp: {
        ...index[currApp.name],
        name: currApp.name,
        version: versions[currApp.name] ?? null,
        defaultProvider,
      },
    });
  },
}));