import FilesModule from '../../lib/files';
import {create} from 'zustand';
import {useSettings} from '../persistent/settings';
import ReactNativeBlobUtil, {
  FetchBlobResponse,
  StatefulPromise,
} from 'react-native-blob-util';

export type DownloadsState = Record<
  string,
  {
    task: StatefulPromise<FetchBlobResponse>;
    progress: number;
  }
>;

export interface useDownloadsProps {
  downloads: DownloadsState;
  addDownload: (
    fileName: string,
    url: string,
    onProgress?: (progress: number) => void,
    onFinished?: (path: string) => void,
  ) => Promise<void>;
  cancelDownload: (fileName: string) => void;
}

export const useDownloads = create<useDownloadsProps>((set, get) => ({
  downloads: {},
  addDownload: async (
    fileName: string,
    url: string,
    onProgress = (progress: number) => {},
    onFinished = (path: string) => {},
  ) => {
    const path = FilesModule.correctPath(fileName);
    try {
      if (await ReactNativeBlobUtil.fs.exists(path))
        await ReactNativeBlobUtil.fs.unlink(path);
    } catch {}
    const task = ReactNativeBlobUtil.config({
      fileCache: true,
      path,
    })
      .fetch('GET', url, {})
      .progress((received, total) => {
        const progress = parseFloat(received) / parseFloat(total);
        set(prev => ({
          downloads: {
            ...prev.downloads,
            [fileName]: {task, progress},
          },
        }));
        onProgress(progress);
      });
    task.then(path => {
      const installAfter =
        useSettings.getState().settings.downloads.installAfterDownload;
      if (installAfter) {
        FilesModule.installApk(path.path());
      }
    });
    task.catch(_ => {});
    task.finally(() => {
      set(prev => {
        const {[fileName]: _, ...rest} = prev.downloads;
        return {downloads: rest};
      });
      onFinished(path);
    });
    set(prev => ({
      downloads: {
        ...prev.downloads,
        [fileName]: {task, progress: 0},
      },
    }));
  },
  cancelDownload: (fileName: string) => {
    const downloads = get().downloads;
    if (downloads[fileName]) {
      try {
        downloads[fileName].task.cancel();
      } catch {}
      FilesModule.deleteFile(fileName);
      const {[fileName]: _, ...rest} = downloads;
      set({downloads: rest});
    }
  },
}));
