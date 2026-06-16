'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyTrendChartProps {
    data?: { name: string; bookings: number }[];
}

const MONTH_MAP: Record<string, string> = {
    "Jan": "Ene", "Feb": "Feb", "Mar": "Mar", "Apr": "Abr", "May": "May", "Jun": "Jun",
    "Jul": "Jul", "Aug": "Ago", "Sep": "Sep", "Oct": "Oct", "Nov": "Nov", "Dec": "Dic"
};

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({ data = [] }) => {
    // Map backend 'bookings' to 'value' for Recharts
    const chartData = data.map(d => ({
        name: MONTH_MAP[d.name] || d.name,
        value: d.bookings
    }));

    if (chartData.length === 0) {
        // Optional: show placeholder or empty state
    }
    return (
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm h-[300px] flex flex-col relative overflow-hidden">
            <h3 className="text-sm font-bold text-slate-800 mb-4 text-center">Tendencia Mensual de Reservas</h3>
            <div className="flex-1 w-full">
                {data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#07A0A2" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#07A0A2" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                                dy={10}
                            />
                            <YAxis hide />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#07A0A2"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorValue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">Sin datos disponibles</p>
                    </div>
                )}
            </div>
            {/* Background color similar to image */}
            <div className="absolute inset-0 bg-[#E6FFFA] -z-10" />
        </div>
    );
};
