import {create} from 'zustand';

export type ToastType = 'error' | 'success' | 'warning' | undefined;

export interface ToastProps {
  type: ToastType;
  message: string;
}

type useToastProps = {
  activeToast: ToastProps | null;
  openToast: (message: string, type?: ToastType) => void;
  closeToast: () => void;
};

export const useToast = create<useToastProps>(set => ({
  activeToast: null,
  openToast: (message, type) => {
    set(() => ({
      activeToast: {
        message,
        type,
      },
    }));
  },
  closeToast: () => set({activeToast: null}),
}));
