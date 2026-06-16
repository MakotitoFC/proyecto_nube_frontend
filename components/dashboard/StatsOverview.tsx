'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, DollarSign } from 'lucide-react';

interface StatsOverviewProps {
    bookings: number;
    revenue: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ bookings, revenue }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group"
            >
                <div>
                    <div className="text-3xl font-black text-slate-800">{bookings}</div>
                    <div className="text-xs font-bold text-[#07A0A2] uppercase tracking-wider mt-1">Total de Reservas</div>
                </div>
                <div className="w-14 h-14 bg-[#E6FFFA] rounded-2xl flex items-center justify-center text-[#07A0A2] shadow-sm">
                    <CheckCircle2 size={28} />
                </div>
                {/* Decoration */}
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#07A0A2] opacity-5 rounded-full blur-xl translate-y-1/2 translate-x-1/2" />
            </motion.div>

            <motion.div
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group"
            >
                <div>
                    <div className="text-3xl font-black text-slate-800">
                        {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', notation: "compact" }).format(revenue)}
                    </div>
                    <div className="text-xs font-bold text-[#07A0A2] uppercase tracking-wider mt-1">Ingresos Totales</div>
                </div>
                <div className="w-14 h-14 bg-[#E6FFFA] rounded-2xl flex items-center justify-center text-[#07A0A2] shadow-sm">
                    <DollarSign size={28} />
                </div>
                {/* Decoration */}
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#07A0A2] opacity-5 rounded-full blur-xl translate-y-1/2 translate-x-1/2" />
            </motion.div>
        </div >
    );
};
