'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2 } from 'lucide-react';

// Configure worker locally
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

export interface PDFViewerProps {
    pdfUrl: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl }) => {
    const [numPages, setNumPages] = useState<number>(0);
    const [containerWidth, setContainerWidth] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                // Use the parent's width or window width for mobile
                const width = containerRef.current.clientWidth || window.innerWidth;
                setContainerWidth(width - 48); // Margin for look
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        const timer = setTimeout(updateWidth, 100); // Small delay to ensure container is ready

        return () => {
            window.removeEventListener('resize', updateWidth);
            clearTimeout(timer);
        };
    }, []);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
        <div ref={containerRef} className="w-full flex flex-col items-center py-8 px-4">
            <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-[#09C9CB] animate-spin mb-4" />
                        <p className="text-slate-400 text-xs font-tertiary uppercase tracking-widest">Cargando Menú...</p>
                    </div>
                }
                className="flex flex-col gap-6"
            >
                {Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_${index + 1}`} className="shadow-2xl rounded-sm overflow-hidden bg-white">
                        <Page
                            pageNumber={index + 1}
                            width={containerWidth > 0 ? (containerWidth > 800 ? 800 : containerWidth) : 300}
                            renderAnnotationLayer={false}
                            renderTextLayer={false}
                        />
                    </div>
                ))}
            </Document>
        </div>
    );
};

export default PDFViewer;
