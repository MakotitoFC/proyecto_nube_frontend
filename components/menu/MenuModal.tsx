'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic import for PDF components to avoid SSR issues (DOMMatrix error)
// We use a generic typing to avoid resolution issues during the import process
const PDFViewer = dynamic<any>(() => import('./PDFViewer'), { 
    ssr: false,
    loading: () => (
        <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="w-10 h-10 text-[#09C9CB] animate-spin mb-4" />
            <p className="text-slate-400 text-xs font-tertiary uppercase tracking-widest">Iniciando Visor...</p>
        </div>
    )
});

interface MenuModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl: string;
}

const MenuModal: React.FC<MenuModalProps> = ({ isOpen, onClose, pdfUrl }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Prevent background scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-0 md:p-6 lg:p-12">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative bg-white w-full h-full md:rounded-[32px] md:max-w-5xl lg:max-w-4xl md:h-[85vh] lg:h-[95vh] shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="shrink-0 p-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#09C9CB]/10 rounded-xl flex items-center justify-center text-[#09C9CB]">
                                    <FileText size={20} />
                                </div>
                                <h3 className="font-tertiary text-xl text-slate-900 uppercase tracking-wider">
                                    NUESTRO MENÚ
                                </h3>
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href={pdfUrl}
                                    download="Menu-Pelicanos.pdf"
                                    className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-tertiary uppercase tracking-widest hover:bg-[#09C9CB] transition-all"
                                >
                                    <Download size={14} />
                                    Descargar
                                </a>
                                <button
                                    onClick={onClose}
                                    className="p-2.5 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 rounded-full"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* PDF Content */}
                        <div 
                            ref={containerRef}
                            className="flex-1 bg-slate-100 relative overflow-y-auto overflow-x-hidden flex flex-col items-center scrollbar-hide"
                        >
                            <PDFViewer pdfUrl={pdfUrl} />

                            <div className="absolute inset-0 pointer-events-none border-12 border-white/5" />
                        </div>

                        {/* Footer (Mobile Only Download) */}
                        <div className="sm:hidden p-6 bg-white border-t border-slate-100">
                            <a
                                href={pdfUrl}
                                download="Menu-Pelicanos.pdf"
                                className="flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white rounded-2xl font-tertiary uppercase tracking-[0.2em] text-xs hover:bg-[#09C9CB] transition-all shadow-lg"
                            >
                                <Download size={18} />
                                Descargar Menú PDF
                            </a>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default MenuModal;
