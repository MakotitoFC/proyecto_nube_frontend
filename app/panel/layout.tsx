'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/panel/Sidebar';
import { PanelHeader } from '@/components/panel/PanelHeader';
import { motion } from 'framer-motion';

export default function PanelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    // Solo mostramos el loader si es la carga inicial y no hay sesión previa
    if (status === 'loading' && !session) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    if (status === 'unauthenticated') return null;

    return (
        <div className="flex flex-col md:flex-row h-screen bg-slate-50 relative font-principal overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <main className="flex-1 overflow-auto flex flex-col">
                <PanelHeader isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                <div className="flex-1 p-8 md:p-12 pb-24 md:pb-24">
                    {children}
                </div>
            </main>
        </div>
    );
}
