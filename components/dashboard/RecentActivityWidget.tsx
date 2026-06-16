'use client';

import React, { useState, useEffect } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_BACK_URL || 'http://localhost:4000';

interface Activity {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    user?: { fullName: string } | null;
}

interface RecentActivityWidgetProps {
    token?: string;
}

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
}

function getDotColor(type: string): string {
    if (type === 'BOOKING_WEB') return '#07A0A2';
    if (type === 'BOOKING_PANEL') return '#0EA5E9';
    if (type === 'RESOURCE_MAINTENANCE') return '#F59E0B';
    return '#07A0A2';
}

function getTypeLabel(type: string): string {
    if (type === 'BOOKING_WEB') return 'Web';
    if (type === 'BOOKING_PANEL') return 'Presencial';
    if (type === 'RESOURCE_MAINTENANCE') return 'Mantenimiento';
    return '';
}

export const RecentActivityWidget: React.FC<RecentActivityWidgetProps> = ({ token }) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        const fetchActivities = async () => {
            try {
                const res = await fetch(`${API_URL}/panel/activities`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setActivities(data);
                }
            } catch (err) {
                console.error('Failed to fetch activities', err);
            } finally {
                setLoading(false);
            }
        };

        fetchActivities();
        const interval = setInterval(fetchActivities, 30000);
        return () => clearInterval(interval);
    }, [token]);

    return (
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm h-full flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 mb-5">Actividad Reciente</h3>

            <div className="space-y-5 overflow-y-auto flex-1">
                {loading && (
                    <p className="text-slate-400 text-xs">Cargando actividad...</p>
                )}
                {!loading && activities.length === 0 && (
                    <p className="text-slate-400 text-xs">No hay actividad reciente.</p>
                )}
                {activities.map((act) => {
                    const dotColor = getDotColor(act.type);
                    const label = getTypeLabel(act.type);
                    return (
                        <div key={act.id} className="flex gap-3 items-start group">
                            <div className="mt-1 shrink-0">
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: dotColor }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <h4 className="text-xs font-bold text-slate-800 truncate">
                                        {act.title}
                                    </h4>
                                    {label && (
                                        <span
                                            className="text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0"
                                            style={{ backgroundColor: `${dotColor}20`, color: dotColor }}
                                        >
                                            {label}
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-500 leading-snug">{act.message}</p>
                                <p className="text-[10px] text-slate-400 mt-1">{timeAgo(act.createdAt)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Re-export the fetch logic so PanelHeader can use it too
export async function fetchRecentActivities(token: string): Promise<Activity[]> {
    try {
        const res = await fetch(`${API_URL}/panel/activities`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) return res.json();
    } catch { }
    return [];
}

export async function markActivityAsRead(token: string, id: string): Promise<void> {
    try {
        await fetch(`${API_URL}/panel/activities/${id}/read`, {
            method: 'PATCH',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    } catch { }
}

export async function markAllActivitiesAsRead(token: string): Promise<void> {
    try {
        await fetch(`${API_URL}/panel/activities/read-all`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
    } catch { }
}

export type { Activity };
