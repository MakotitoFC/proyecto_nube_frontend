'use client';

import React, { useState } from 'react';
import { Booking } from '@/types';
import { Trash2, IconUserCircle } from '../ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingsViewProps {
    bookings: Booking[];
    setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}

export const BookingsView: React.FC<BookingsViewProps> = ({ bookings, setBookings }) => {
    const [filter, setFilter] = useState<'all' | 'room' | 'beach'>('all');

    const handleDelete = (id: string) => {
        if (confirm("¿Seguro que deseas cancelar esta reserva?")) {
            setBookings(bookings.filter(b => b.id !== id));
        }
    };

    // Note: The original code used 'rooms' (plural) in the button but 'room' (singular) in the type/filter logic maybe? 
    // Checking filter === 'all' || b.type === filter
    const filteredBookings = bookings.filter(b => filter === 'all' || b.type === filter);

    return (
        <>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-3xl font-principal font-extrabold text-slate-900 uppercase tracking-tight mb-2">
                        Gestión de Reservas
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">Pelícanos Veracruz | Sistema de Control Interno</p>
                </div>

                <div className="flex gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200">
                    {(['all', 'room', 'beach'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all
                ${filter === f ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}
                        >
                            {f === 'all' ? 'Todo' : f === 'room' ? 'Bungalows' : 'Beach Club'}
                        </button>
                    ))}
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden"
            >
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                        <tr>
                            <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Tipo</th>
                            <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Cliente</th>
                            <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Espacio</th>
                            <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Fecha</th>
                            <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                            <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredBookings.map(b => (
                            <tr key={b.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="p-6">
                                    <span className={`px-4 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${b.type === 'beach' ? 'bg-blue-100 text-blue-600' : 'bg-[#09C9CB]/10 text-[#09C9CB]'}`}>
                                        {b.type === 'beach' ? 'Beach Club' : 'Bungalow'}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <p className="font-bold text-slate-800 text-sm">{b.guestName}</p>
                                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Reserva Verificada</p>
                                </td>
                                <td className="p-6 text-slate-500 font-bold text-sm">#{b.targetId}</td>
                                <td className="p-6 text-slate-500 font-medium text-sm">{b.date}</td>
                                <td className="p-6">
                                    <div className="flex items-center gap-2 text-green-500">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{b.status}</span>
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <button
                                        onClick={() => handleDelete(b.id)}
                                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredBookings.length === 0 && (
                            <tr>
                                <td colSpan={6} className="p-24 text-center">
                                    <div className="flex flex-col items-center opacity-30">
                                        <IconUserCircle size={48} className="mb-4 text-slate-300" />
                                        <p className="italic text-slate-400 font-medium font-principal">No hay registros disponibles</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </motion.div>
        </>
    );
};
