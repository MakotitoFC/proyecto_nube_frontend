'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ChannelChartProps {
    data?: { name: string; value: number }[];
}

const COLORS = ['#07A0A2', '#0EA5E9'];

export const ChannelChart: React.FC<ChannelChartProps> = ({ data }) => {
    const chartData = data && data.length > 0 ? data : [
        { name: 'Sitio Web', value: 0 },
        { name: 'Presencial', value: 0 },
    ];

    return (
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm h-[300px] flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Total de Reservas por Canal</h3>
            <div className="flex-1 w-full relative -left-4">
                {data && data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            layout="vertical"
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                            barSize={30}
                        >
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }}
                                width={80}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {chartData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
