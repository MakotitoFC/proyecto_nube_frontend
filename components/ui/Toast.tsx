'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { toast, Toaster } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const showToast = (message: string, type: ToastType = 'info') => {
        switch (type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'warning':
                toast.warning(message);
                break;
            default:
                toast.info(message);
                break;
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <Toaster
                position="bottom-right"
                expand={false}
                richColors
                closeButton
                toastOptions={{
                    className: 'font-principal font-bold uppercase tracking-tight text-xs rounded-2xl border shadow-xl',
                }}
            />
        </ToastContext.Provider>
    );
};
