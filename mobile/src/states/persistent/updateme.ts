import {StateStorage, createJSONStorage, persist} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';
import {create} from 'zustand';
import AppsModule from '@/lib/apps';

const APP_INFO_URL = 'https://raw.githubusercontent.com/anfreire/updateMe/gh-pages/scripts/app.json';

interface AppInfo {
  version: string;
  download: string;
  releaseNotes: {title: string; description: string}[];
}

export const initialFlags = {
  welcome: false,
};

export type FlagsProps = typeof initialFlags;

const storage = new MMKV({id: 'update-me'});

const zustandStorage: StateStorage = {
  setItem: (name, value) => {
    return storage.set(name, JSON.stringify(value));
  },
  getItem: name => {
    const value = storage.getString(name);
    return value ? JSON.parse(value) : null;
  },
  removeItem: name => {
    return storage.delete(name);
  },
};

export interface useAppProps {
  flags: FlagsProps;
  localVersion: string;
  info: AppInfo;
  getVersion: () => void;
  fetchInfo: () => Promise<void>;
  activateFlag: (flag: keyof FlagsProps) => void;
}

export const useApp = create<useAppProps>()(
  persist(
    set => ({
      flags: initialFlags,
      localVersion: '',
      info: {
        version: '',
        download: '',
        releaseNotes: [],
      },
      availableVersion: '',
      getVersion: () => {
        AppsModule.getAppVersion('com.updateme').then(version => {
          set({localVersion: version as string});
        });
      },
      activateFlag: (flag: keyof FlagsProps) => {
        set(state => ({
          flags: {
            ...state.flags,
            [flag]: !initialFlags[flag],
          },
        }));
      },
      fetchInfo: async () => {
        try {
          const response = await fetch(APP_INFO_URL);
          const info = await response.json();
          set({info});
        } catch (error) {}
      },
    }),
    {
      name: 'flags',
      storage: createJSONStorage(() => zustandStorage),
      partialize: state => ({flags: state.flags}),
      onRehydrateStorage: state => {
        state.getVersion();
        state.fetchInfo();
      },
    },
  ),
);
