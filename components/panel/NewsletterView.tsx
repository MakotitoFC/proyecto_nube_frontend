'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Download } from '../ui/Icons';
import { motion } from 'framer-motion';
import { PageHeader } from './PageHeader';
import { useSession } from 'next-auth/react';
import { getSubscribers, Subscriber } from '@/services/newsletterService';

export const NewsletterView: React.FC = () => {
    const { data: session } = useSession();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchSubscribers = async () => {
        if (session?.user) {
            const token = (session.user as any).accessToken;
            if (token) {
                setIsLoading(true);
                try {
                    const data = await getSubscribers(token);
                    setSubscribers(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            }
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, [session]);

    const handleExportCSV = () => {
        const headers = ['Email', 'Fecha de Suscripción'];
        const csvContent = [
            headers.join(','),
            ...subscribers.map(s => `${s.email},${new Date(s.createdAt).toLocaleDateString()}`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4 md:gap-6">
                <PageHeader
                    title="Newsletter Subscribers"
                    subtitle="Gestión de correos electrónicos para marketing"
                />

                <button
                    onClick={handleExportCSV}
                    disabled={subscribers.length === 0}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3.5 md:py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Download size={18} />
                    Exportar CSV
                </button>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] md:rounded-[40px] shadow-sm border border-slate-200 overflow-hidden"
            >
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="p-4 md:p-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Correo Electrónico</th>
                                <th className="p-4 md:p-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Fecha de Suscripción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {subscribers.map(sub => (
                                <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 md:p-6">
                                        <div className="flex items-center gap-3 md:gap-4">
                                            <div className="w-8 h-8 rounded-full bg-[#09C9CB]/10 text-[#09C9CB] flex items-center justify-center">
                                                <Mail size={14} />
                                            </div>
                                            <p className="font-bold text-xs md:text-sm text-slate-800">{sub.email}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 md:p-6 font-medium text-xs md:text-sm text-slate-600">
                                        {new Date(sub.createdAt).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                </tr>
                            ))}
                            {subscribers.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={2} className="p-12 text-center text-slate-400 text-sm font-medium">
                                        Aún no hay suscriptores en la lista
                                    </td>
                                </tr>
                            )}
                            {isLoading && (
                                <tr>
                                    <td colSpan={2} className="p-12 text-center text-slate-400 text-sm font-medium animate-pulse">
                                        Cargando suscriptores...
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};
