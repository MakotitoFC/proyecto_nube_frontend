'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    variant = 'danger'
}) => {
    const colors = {
        danger: {
            bg: 'bg-rose-50',
            icon: 'text-rose-600',
            button: 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
        },
        warning: {
            bg: 'bg-amber-50',
            icon: 'text-amber-600',
            button: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200'
        },
        info: {
            bg: 'bg-sky-50',
            icon: 'text-sky-600',
            button: 'bg-sky-600 hover:bg-sky-700 shadow-sky-200'
        }
    };

    const color = colors[variant];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative bg-white rounded-[32px] p-8 w-full max-w-sm shadow-2xl overflow-hidden"
                    >
                        <div className="flex flex-col items-center text-center">
                            {/* Icon Circle */}
                            <div className={`w-16 h-16 ${color.bg} rounded-full flex items-center justify-center mb-6`}>
                                <AlertCircle size={32} className={color.icon} />
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight mb-2">
                                {title}
                            </h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                                {message}
                            </p>

                            <div className="flex flex-col w-full gap-3">
                                <button
                                    onClick={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    className={`w-full py-4 rounded-2xl text-white font-bold uppercase tracking-widest text-xs transition-all shadow-lg ${color.button}`}
                                >
                                    {confirmText}
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full py-4 rounded-2xl bg-white text-slate-400 font-bold uppercase tracking-widest text-xs hover:text-slate-900 transition-colors"
                                >
                                    {cancelText}
                                </button>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900 transition-colors bg-slate-50 rounded-full"
                        >
                            <X size={18} />
                        </button>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
