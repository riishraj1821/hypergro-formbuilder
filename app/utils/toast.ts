import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string) => {
    toast.success(message);
  },
  error: (message: string) => {
    toast.error(message);
  },
  loading: (message: string) => {
    return toast.loading(message);
  },
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },
  promise: <T>(
    promise: Promise<T>,
    {
      loading = 'Loading...',
      success = 'Success!',
      error = 'Error!',
    }: {
      loading?: string;
      success?: string;
      error?: string;
    } = {}
  ) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
    });
  },
}; 