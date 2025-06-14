// lib/toast.ts
import toast from 'react-hot-toast';

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};

export const showLoading = (message: string) => {
  return toast.loading(message);
};

export const showInfo = (message: string) => {
  toast(message, {
    icon: 'ℹ️',
  });
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};
