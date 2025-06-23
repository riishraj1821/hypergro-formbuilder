import { Toaster } from 'react-hot-toast';

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Default options for all toasts
        duration: 3000,
        style: {
          background: '#fff',
          color: '#333',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          borderRadius: '0.5rem',
          padding: '1rem',
        },
        // Success toast
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: '#fff',
          },
          style: {
            border: '1px solid #10B981',
          },
        },
        // Error toast
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#fff',
          },
          style: {
            border: '1px solid #EF4444',
          },
        },
        // Loading toast
        loading: {
          iconTheme: {
            primary: '#3B82F6',
            secondary: '#fff',
          },
          style: {
            border: '1px solid #3B82F6',
          },
        },
      }}
    />
  );
} 