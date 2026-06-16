'use client';

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StatusChartProps {
    data?: { name: string; value: number }[];
}

const COLORS: Record<string, string> = {
    'CONFIRMED': '#07A0A2', // Darker turquoise
    'COMPLETED': '#068587', // Even darker
    'CANCELLED': '#94A3B8', // Grey 
    'PENDING': '#09C9CB',   // Original turquoise (now "lighter")
    'CHECKED_IN': '#07A0A2',
    'CHECKED_OUT': '#068587',
};

const STATUS_LABELS: Record<string, string> = {
    'CONFIRMED': 'Confirmada',
    'COMPLETED': 'Completada',
    'CANCELLED': 'Cancelada',
    'PENDING': 'Pendiente',
    'CHECKED_IN': 'Check-in',
    'CHECKED_OUT': 'Check-out',
};

// Default fallback
const DEFAULT_COLOR = '#8884d8';

export const StatusChart: React.FC<StatusChartProps> = ({ data = [] }) => {
    // Transform data to ensure colors
    const chartData: { name: string; value: number; color: string }[] = data.length > 0 ? data.map(item => ({
        ...item,
        name: STATUS_LABELS[item.name] || item.name,
        color: COLORS[item.name] || DEFAULT_COLOR
    })) : [
        { name: 'Sin datos', value: 0, color: '#e2e8f0' }
    ];
    return (
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm h-[300px] flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 mb-4 text-center">Total de Reservas por Estado</h3>
            <div className="flex-1 w-full">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={2}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{ fontSize: '10px', fontWeight: 600 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Sin datos disponibles</p>
                    </div>
                )}
            </div>
        </div>
    );
};
