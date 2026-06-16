'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface RoomTypeChartProps {
    data?: any[];
}

const CATEGORY_MAP: Record<string, string> = {
    'Palapas': 'Zona Playa',
    'Lounge': 'Zona Lounge VIP',
    'Alberca': 'Zona Alberca',
    'Bungalows': 'Habs.'
};

export const RoomTypeChart: React.FC<RoomTypeChartProps> = ({ data = [] }) => {
    // Fallback if no data
    const chartData = data.length > 0 ? data.map(d => ({
        ...d,
        name: CATEGORY_MAP[d.name] || d.name
    })) : [
        { name: 'Sin datos', value: 0, color: '#e2e8f0' }
    ];
    return (
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm h-[300px] flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Total de reservas por categoría</h3>
            <div className="flex-1 w-full relative -left-4">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            barSize={30}
                        >
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
                                width={60}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={'#07A0A2'} />
                                ))}
                            </Bar>
                        </BarChart>
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
