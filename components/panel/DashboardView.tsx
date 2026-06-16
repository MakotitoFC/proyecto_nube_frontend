'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Calendar,
    TrendingUp,
    ShoppingCart,
    Wallet,
    ChevronRight
} from '../ui/Icons';
import { PageHeader } from './PageHeader';

export const DashboardView: React.FC = () => {
    const stats = [
        { label: 'Reservas Hoy', value: '24', icon: Calendar, color: 'bg-emerald-500', trend: '+12%' },
        { label: 'Ocupación', value: '85%', icon: TrendingUp, color: 'bg-[#09C9CB]', trend: '+5%' },
        { label: 'Usuarios Activos', value: '1,280', icon: Users, color: 'bg-indigo-500', trend: '+18%' },
        { label: 'Ingresos Mes', value: '$45.2k', icon: Wallet, color: 'bg-amber-500', trend: '+24%' },
    ];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="space-y-10">
            <PageHeader
                title="Resumen del Sistema"
                subtitle="Panel General | Veracruz Admin"
            />

            {/* Stats Grid */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {stats.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        variants={item}
                        className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                    >
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className={`${stat.color} p-3 rounded-2xl text-white shadow-lg shadow-${stat.color.split('-')[1]}-200`}>
                                <stat.icon size={24} />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg">
                                {stat.trend}
                            </span>
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</h3>
                            <p className="text-3xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
                        </div>

                        {/* Background Decoration */}
                        <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-[0.03] rounded-full group-hover:scale-110 transition-transform duration-500`} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Reports/Graph Dummy */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight">Rendimiento Semanal</h2>
                        <button className="text-[10px] font-bold text-[#09C9CB] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
                            Ver Reporte <ChevronRight size={14} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {[
                            { label: 'Hotel / Bungalows', value: 85, color: 'bg-emerald-500' },
                            { label: 'Beach Club / Palapas', value: 62, color: 'bg-[#09C9CB]' },
                            { label: 'Beach Club / Lounge', value: 45, color: 'bg-indigo-500' },
                            { label: 'Beach Club / Alberca', value: 30, color: 'bg-amber-500' },
                        ].map((bar, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    <span>{bar.label}</span>
                                    <span>{bar.value}%</span>
                                </div>
                                <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${bar.value}%` }}
                                        transition={{ duration: 1, delay: i * 0.2 }}
                                        className={`h-full ${bar.color} rounded-full`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Panel - Recent Activity */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900 p-8 rounded-[40px] shadow-xl text-white overflow-hidden relative"
                >
                    <h2 className="text-lg font-bold uppercase tracking-tight mb-8 relative z-10">Actividad Reciente</h2>

                    <div className="space-y-6 relative z-10">
                        {[
                            { action: 'Nueva Reserva', user: 'Juan Pérez', time: 'Hace 5 min' },
                            { action: 'Check-in', user: 'María G.', time: 'Hace 12 min' },
                            { action: 'Nueva Reserva', user: 'Roberto L.', time: 'Hace 25 min' },
                            { action: 'Nueva Reserva', user: 'Roberto L.', time: 'Hace 1 hora' },
                        ].map((act, i) => (
                            <div key={i} className="flex gap-4 items-start pb-6 border-b border-white/5 last:border-0">
                                <div className="w-2 h-2 rounded-full bg-[#09C9CB] mt-1.5 shrink-0 shadow-[0_0_10px_rgba(9,201,203,0.5)]" />
                                <div>
                                    <p className="text-xs font-bold text-white uppercase tracking-tight">{act.action}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{act.user} • {act.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Gradient Background Decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#09C9CB] opacity-10 blur-[100px] -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 opacity-10 blur-[100px] -ml-32 -mb-32" />
                </motion.div>
            </div>
        </div>
    );
};
