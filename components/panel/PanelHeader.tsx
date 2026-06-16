'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { getProfile } from '@/services/userService';
import { fetchRecentActivities, markActivityAsRead, markAllActivitiesAsRead, type Activity } from '@/components/dashboard/RecentActivityWidget';

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours} h`;
    return `Hace ${Math.floor(diffHours / 24)} d`;
}

function getDotColor(type: string): string {
    if (type === 'BOOKING_WEB') return '#07A0A2';
    if (type === 'BOOKING_PANEL') return '#0EA5E9';
    if (type === 'RESOURCE_MAINTENANCE') return '#F59E0B';
    return '#07A0A2';
}

interface PanelHeaderProps {
    isOpen?: boolean;
    setIsOpen?: (isOpen: boolean) => void;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({ isOpen, setIsOpen }) => {
    const { data: session } = useSession();
    const user = session?.user as any;
    const token = (session as any)?.accessToken || '';

    const [livePhoto, setLivePhoto] = useState<string | null>(null);
    const [liveName, setLiveName] = useState<string | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [unread, setUnread] = useState(0);
    const bellRef = useRef<HTMLDivElement>(null);

    // Fetch profile
    useEffect(() => {
        const fetchProfileData = async () => {
            // @ts-ignore
            if (session?.accessToken) {
                try {
                    // @ts-ignore
                    const profile = await getProfile(session.accessToken);
                    if (profile?.photo) setLivePhoto(profile.photo);
                    if (profile?.name) setLiveName(profile.name);
                } catch (e) {
                    console.error('Failed to load header profile data', e);
                }
            }
        };
        fetchProfileData();
    }, [session]);

    // Fetch notifications
    const loadActivities = async () => {
        if (!token) return;
        const data = await fetchRecentActivities(token);
        setActivities(data);
        const unreadCount = data.filter(a => !a.isRead).length;
        setUnread(unreadCount > 0 ? Math.min(unreadCount, 9) : 0);
    };

    useEffect(() => {
        loadActivities();
        const interval = setInterval(loadActivities, 30000);
        return () => clearInterval(interval);
    }, [token]);

    const handleMarkAllRead = async () => {
        if (!token) return;
        await markAllActivitiesAsRead(token);
        await loadActivities();
    };

    const handleMarkItemRead = async (id: string) => {
        if (!token) return;
        await markActivityAsRead(token, id);
        await loadActivities();
    };

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    const displayName = liveName || user.fullName || user.name || 'Usuario';
    const initials = displayName !== 'Usuario'
        ? displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
        : 'U';

    return (
        <header className="w-full bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">

                {/* Mobile Menu Toggle */}
                <button
                    onClick={() => setIsOpen?.(!isOpen)}
                    className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100 transition-all active:scale-95"
                    aria-label="Toggle Menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>

                <div className="flex items-center justify-end gap-3 ml-auto">

                    {/* Notification Bell */}
                    <div ref={bellRef} className="relative">
                        <button
                            onClick={() => {
                                const becomingOpen = !showNotifications;
                                setShowNotifications(becomingOpen);
                                if (becomingOpen && unread > 0) {
                                    setUnread(0); // Optimistic update
                                    handleMarkAllRead();
                                }
                            }}
                            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors duration-200"
                            aria-label="Notificaciones"
                        >
                            {/* Bell Icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                            {/* Unread badge */}
                            {unread > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                                    {unread}
                                </span>
                            )}
                        </button>

                        {/* Dropdown */}
                        {showNotifications && (
                            <div className="fixed sm:absolute top-[72px] sm:top-full left-4 right-4 sm:left-auto sm:right-0 mt-2 sm:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden">
                                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 text-center">
                                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Actividad Reciente</h3>
                                </div>
                                <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                                    {activities.length === 0 && (
                                        <div className="flex flex-col items-center justify-center p-8 text-center">
                                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3 text-slate-300">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                                            </div>
                                            <p className="text-slate-400 text-xs font-medium">No hay actividad reciente.</p>
                                        </div>
                                    )}
                                    {activities.slice(0, 10).map((act) => (
                                        <div 
                                            key={act.id} 
                                            onClick={() => !act.isRead && handleMarkItemRead(act.id)}
                                            className="flex gap-3 items-start px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer relative"
                                        >
                                            {!act.isRead && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#09C9CB]" />
                                            )}
                                            <div className="mt-1.5 shrink-0">
                                                <div
                                                    className={`w-2 h-2 rounded-full ${act.isRead ? 'opacity-30' : 'animate-pulse'}`}
                                                    style={{ backgroundColor: getDotColor(act.type) }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-slate-900 leading-snug">{act.title}</p>
                                                <p className="text-[11px] text-slate-600 truncate mt-0.5">{act.message}</p>
                                                <p className="text-[10px] text-slate-400 mt-1">{timeAgo(act.createdAt)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Name & email */}
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900 leading-tight">{displayName}</p>
                        <p className="text-[10px] text-slate-500 font-medium tracking-tight">{user.email}</p>
                    </div>

                    {/* Avatar */}
                    {livePhoto ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-slate-200">
                            <img src={livePhoto} alt={displayName} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white ring-2 ring-[#09C9CB]/20 shadow-sm">
                            <span className="font-bold text-xs">{initials}</span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};
