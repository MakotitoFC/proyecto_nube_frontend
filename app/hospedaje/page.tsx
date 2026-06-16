'use client';

import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import PropertyInfo from './components/PropertyInfo';
import BookingCard from './components/BookingCard';
import { getHotelResources, Resource } from '@/services/resourceService';
import { getOccupiedIds } from '@/services/bookingService';
import { useState, useEffect } from 'react';

export default function HospedajePage() {

    const [showMobileBooking, setShowMobileBooking] = React.useState(false);
    const [resources, setResources] = useState<Resource[]>([]);
    const [occupiedIds, setOccupiedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [dates, setDates] = useState({
        checkIn: null as string | null,
        checkOut: null as string | null
    });

    const fetchResources = async () => {
        try {
            const data = await getHotelResources("");
            setResources(data);
        } catch (err) {
            console.error("Failed to fetch hotel resources:", err);
        }
    };

    const fetchOccupied = async (background = false) => {
        if (dates.checkIn && dates.checkOut) {
            if (!background) setIsLoading(true);
            try {
                const data = await getOccupiedIds(dates.checkIn, dates.checkOut);
                setOccupiedIds(data);
            } catch (err) {
                console.error("Failed to fetch occupied hotel IDs:", err);
            } finally {
                if (!background) setIsLoading(false);
            }
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchResources();
    }, []);

    useEffect(() => {
        fetchOccupied();

        // Poll every 5 seconds
        const interval = setInterval(() => {
            fetchResources();
            fetchOccupied(true);
        }, 5000);

        return () => clearInterval(interval);
    }, [dates.checkIn, dates.checkOut, refreshKey]);

    const handleRefresh = () => setRefreshKey(prev => prev + 1);

    return (
        <>
            <div className="bg-white animate-fade-in min-h-screen flex flex-col font-sans antialiased text-slate-900 pb-24 lg:pb-0">
                {/* Page Header (Hero Style) */}
                <PageHeader
                    title="TU REFUGIO"
                    subtitle="NOCHES PERFECTAS EN"
                    description="12 habitaciones identicas frente al mar, diseñadas para tu paz absoluta."
                    image="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=2000"
                    objectFitClass="object-cover lg:object-fill origin-bottom"
                    height='h-[70vh] md:h-[75vh] lg:h-[90vh]'
                />

                <div className=" mx-auto lg:px-8 py-12">


                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 relative">
                            {/* Mobile: Toggle between PropertyInfo and BookingCard */}
                            <div className="lg:hidden">
                                {showMobileBooking ? (
                                    <div className="space-y-4">
                                        <button
                                            onClick={() => setShowMobileBooking(false)}
                                            className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-widest px-4 hover:text-slate-900 transition-colors"
                                        >
                                            <span className="text-lg">←</span> Volver
                                        </button>
                                        <BookingCard
                                            resources={resources}
                                            occupiedIds={occupiedIds}
                                            externalDates={{
                                                checkIn: dates.checkIn,
                                                checkOut: dates.checkOut
                                            }}
                                            onDateChange={(ci, co) => setDates({ checkIn: ci, checkOut: co })}
                                            onSuccess={handleRefresh}
                                            isLoading={isLoading}
                                        />
                                    </div>
                                ) : (
                                    <PropertyInfo />
                                )}
                            </div>

                            {/* Desktop: Always show PropertyInfo */}
                            <div className="hidden lg:block">
                                <PropertyInfo />
                            </div>

                            {/* Mobile Sticky Booking Button - Only visible when NOT in booking view */}
                            {!showMobileBooking && (
                                <div className="sticky bottom-6 left-0 right-0 p-4 lg:hidden z-50 pointer-events-none">
                                    <button
                                        onClick={() => setShowMobileBooking(true)}
                                        className="w-full bg-[#09C9CB] text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform pointer-events-auto font-principal"
                                    >
                                        RESERVAR AQUÍ
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="lg:col-span-1 hidden lg:block">
                            <div className="sticky top-24">
                                <BookingCard
                                    resources={resources}
                                    occupiedIds={occupiedIds}
                                    externalDates={{
                                        checkIn: dates.checkIn,
                                        checkOut: dates.checkOut
                                    }}
                                    onDateChange={(ci, co) => setDates({ checkIn: ci, checkOut: co })}
                                    onSuccess={handleRefresh}
                                    isLoading={isLoading}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
