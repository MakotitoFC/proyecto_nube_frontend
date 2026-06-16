'use client';
import React, { useEffect, useState, useRef } from 'react';
import { ReservationCalendar, ReservationCalendarHandle } from '@/components/panel/ReservationCalendar';
import { PageHeader } from '@/components/panel/PageHeader';
import { CancelledBookingsList } from '@/components/panel/CancelledBookingsList';
import { getHotelResources, Resource } from '@/services/resourceService';
import { Plus } from '@/components/ui/Icons';

export default function HotelPage() {
    const [activeTab, setActiveTab] = useState('Bungalows');
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const calendarRef = useRef<ReservationCalendarHandle>(null);

    useEffect(() => {
        const fetchResources = async (isBackground = false) => {
            try {
                const data = await getHotelResources("");
                setResources(data);
            } catch (err) {
                console.error("Failed to fetch hotel resources:", err);
            } finally {
                if (!isBackground) setLoading(false);
            }
        };

        fetchResources();
        const interval = setInterval(() => fetchResources(true), 5000);
        return () => clearInterval(interval);
    }, []);

    const tabs = [
        { id: 'Bungalows', label: 'Bungalows', count: resources.length },
        { id: 'Cancelled', label: 'Canceladas', count: 'HIST' },
    ];

    return (
        <div className="h-full flex flex-col">
            <PageHeader
                title="Reservas Hotel"
                subtitle="Pelícanos Veracruz | Control de Ocupación"
            >
                <button
                    onClick={() => calendarRef.current?.openGeneralModal()}
                    className="flex items-center gap-2 bg-[#09C9CB] hover:bg-[#07aeb0] text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#09C9CB]/20 active:scale-95"
                >
                    <Plus size={18} />
                    Crear Reserva
                </button>
            </PageHeader>

            <div className="w-full mt-5 md:mt-8 overflow-x-auto scrollbar-hide">
                <div className="flex gap-1 bg-white p-1 rounded-[18px] md:rounded-3xl border border-slate-200 w-fit shrink-0 min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 md:px-6 py-2 md:py-3 rounded-[14px] md:rounded-2xl font-bold text-[9px] md:text-xs uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-[#09C9CB] text-white shadow-md shadow-[#09C9CB]/10'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            {tab.label}
                            <span className={`ml-1.5 md:ml-2 px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-extrabold ${activeTab === tab.id
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-600'
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 mt-4">
                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <div className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-xs">Cargando bungalows...</div>
                    </div>
                ) : activeTab === 'Cancelled' ? (
                    <CancelledBookingsList resources={resources} resourceType="Bungalows" />
                ) : (
                    <ReservationCalendar
                        ref={calendarRef}
                        resources={resources}
                        resourceType="Bungalows"
                    />
                )}
            </div>
        </div>
    );
}
