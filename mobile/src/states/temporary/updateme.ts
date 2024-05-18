import {StateStorage, createJSONStorage, persist} from 'zustand/middleware';
import {MMKV} from 'react-native-mmkv';
import {create} from 'zustand';
import AppsModule from '@/lib/apps';

const APP_INFO_URL =
  'https://raw.githubusercontent.com/anfreire/updateMe/gh-pages/scripts/app.json';

interface AppInfo {
  version: string;
  download: string;
  releaseNotes: {title: string; description: string}[];
}

export interface useAppProps {
  localVersion: string;
  info: AppInfo;
  getVersion: () => void;
  fetchInfo: () => Promise<void>;
}

export const useApp = create<useAppProps>(set => ({
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
  fetchInfo: async () => {
    try {
      const response = await fetch(APP_INFO_URL);
      const info = await response.json();
      set({info});
    } catch (error) {}
  },
}));
