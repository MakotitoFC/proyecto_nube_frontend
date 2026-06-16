'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { RoomTypeChart } from '@/components/dashboard/RoomTypeChart';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { ChannelChart } from '@/components/dashboard/ChannelChart';
import { MonthlyTrendChart } from '@/components/dashboard/MonthlyTrendChart';
import { RecentActivityWidget } from '@/components/dashboard/RecentActivityWidget';

export default function DashboardPage() {
    const now = new Date();
    const [dateRange, setDateRange] = useState({
        start: new Date(now.getFullYear(), now.getMonth(), 1),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
    });

    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();
    const token = (session?.user as any)?.accessToken || '';
    const role = (session?.user as any)?.role || '';

    useEffect(() => {
        if (status === 'authenticated' && role && role !== 'ADMIN') {
            router.replace('/panel/hotel');
        }
    }, [status, role, router]);

    useEffect(() => {
        if (role !== 'ADMIN') return; // Do not fetch stats if not admin

        const fetchStats = async () => {
            if (!token) return; // Wait for token to load
            setLoading(true);
            try {
                // Ensure date format is YYYY-MM-DD
                const startStr = dateRange.start.toISOString().split('T')[0];
                const endStr = dateRange.end.toISOString().split('T')[0];

                const apiUrl = process.env.NEXT_PUBLIC_API_BACK_URL || 'http://localhost:4000';
                const response = await fetch(`${apiUrl}/bookings/stats?startDate=${startStr}&endDate=${endStr}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                } else if (response.status === 401 || response.status === 403) {
                    console.error("Authentication required to fetch stats.");
                }
            } catch (error) {
                console.error("Failed to fetch stats", error);
            } finally {
                setLoading(false);
            }
        };

        if (token && role === 'ADMIN') {
            fetchStats();
        }
    }, [dateRange, token, role]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (status === 'loading' || (status === 'authenticated' && role !== 'ADMIN')) {
        return <div className="p-8 flex items-center justify-center text-slate-400">Verificando accesos...</div>;
    }

    if (!stats && loading) return <div className="p-8 flex items-center justify-center text-slate-400">Cargando estadísticas...</div>;

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6 max-w-[1400px] mx-auto"
        >
            <DashboardHeader dateRange={dateRange} setDateRange={setDateRange} />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Left Column (Charts & Stats) */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Categories - Image 1 */}
                        <motion.div variants={item}>
                            <RoomTypeChart data={stats?.byCategory || []} />
                        </motion.div>

                        {/* Stats Cards - Image 2 */}
                        <motion.div variants={item}>
                            <StatsOverview
                                bookings={stats?.totalBookings || 0}
                                revenue={stats?.totalRevenue || 0}
                            />
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Status Pie - Image 3 */}
                        <motion.div variants={item}>
                            <StatusChart data={stats?.byStatus || []} />
                        </motion.div>

                        {/* Channel Bar - Image 4 */}
                        <motion.div variants={item}>
                            <ChannelChart data={stats?.byChannel || []} />
                        </motion.div>
                    </div>

                    {/* Monthly Trend - Image 5 */}
                    <motion.div variants={item}>
                        <MonthlyTrendChart data={stats?.monthlyTrend || []} />
                    </motion.div>
                </div>

                {/* Right Column (Activity) */}
                <div className="lg:col-span-1">
                    <motion.div variants={item} className="h-full">
                        <RecentActivityWidget token={token} />
                    </motion.div>
                </div>

            </div>
        </motion.div>
    );
}
