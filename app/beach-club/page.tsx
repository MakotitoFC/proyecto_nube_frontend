'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/PageHeader';
import React from 'react';
import BookingCard from './componentes/BookingCard';
import PropertyInfo from './componentes/PropertyInfo';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { getBeachClubResources, Resource } from '@/services/resourceService';
import { getOccupiedIds } from '@/services/bookingService';
import { BeachClubIntro } from '@/components/beach-club/BeachClubIntro';

export default function BeachClubPage() {
    const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showMobileBooking, setShowMobileBooking] = React.useState(false);

    // Lifted state for date selection
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [occupiedIds, setOccupiedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchResources = async () => {
        try {
            const data = await getBeachClubResources("");
            setResources(data);
        } catch (err) {
            console.error("Failed to fetch resources:", err);
        }
    };

    const fetchOccupied = async (background = false) => {
        if (!background) setIsLoading(true);
        try {
            const data = await getOccupiedIds(selectedDate);
            setOccupiedIds(data);
        } catch (err) {
            console.error("Failed to fetch occupied IDs:", err);
        } finally {
            if (!background) setIsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchResources();
        fetchOccupied();
    }, []);

    // Poll updates
    useEffect(() => {
        // Poll every 5 seconds
        const interval = setInterval(() => {
            fetchResources();
            fetchOccupied(true);
        }, 5000);

        return () => clearInterval(interval);
    }, [selectedDate, refreshKey]);

    // Re-fetch occupied when date changes immediately
    useEffect(() => {
        fetchOccupied();
    }, [selectedDate]);

    // Bloquear scroll de fondo cuando el sheet móvil está abierto
    useEffect(() => {
        // Solo bloquear en móvil
        if (showMobileBooking && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [showMobileBooking]);

    // Cart State Removed - Single Selection Only

    const handleSelectSpace = (id: string) => {
        // Try to find if 'id' (like P1) matches a real resource name
        // or if we already have the real UUID. 
        // For now, if resources are loaded, we look for a match.
        const realResource = resources.find(r =>
            r.id === id || r.name.toLowerCase().includes(id.toLowerCase())
        );

        const idToUse = realResource ? realResource.id : id;

        setSelectedSpace(idToUse);
        setIsSidebarOpen(true);
        // Automatically open the bottom sheet on mobile when a space is selected
        setShowMobileBooking(true);
    };

    const handleRefresh = () => setRefreshKey(prev => prev + 1);

    return (
        <>

            <div className="bg-white animate-fade-in min-h-screen flex flex-col font-sans antialiased text-slate-900 pb-24 lg:pb-0">

                {/* Header se mantiene, pero quizás queramos que no ocupe 100vh si hay mapa abajo */}
                <div className="shrink-0">
                    <PageHeader
                        title="DAYPASS"
                        subtitle="BEACH CLUB"
                        description="Elige tu experiencia ideal en Pelícanos"
                        image="/home/beach-club/MATERIAL_0042.webp"
                        objectFitClass="object-cover lg:object-fill"
                        height='h-[70vh] md:h-[75vh] lg:h-[90vh]'
                    />
                </div>

                {/* Intro Section */}
                <BeachClubIntro />

                <div className=" mx-auto lg:px-8 py-12">


                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2 relative">

                            {/* Mobile & Desktop: Map is always visible now */}
                            <div className="block">
                                <PropertyInfo
                                    onSelect={handleSelectSpace}
                                    selectedId={selectedSpace}
                                    selectedSpaceName={resources.find(r => r.id === selectedSpace)?.name}
                                    selectedDate={selectedDate}
                                    resources={resources}
                                    occupiedIds={occupiedIds}
                                />
                            </div>

                            {/* Mobile Bottom Sheet Booking */}
                            <AnimatePresence>
                                {showMobileBooking && (
                                    <>
                                        {/* Backdrop */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 0.35 }}
                                            exit={{ opacity: 0 }}
                                            onClick={() => setShowMobileBooking(false)}
                                            className="fixed inset-0 bg-black/80 z-40 lg:hidden"
                                        />

                                        {/* Sheet */}
                                        <motion.div
                                            initial={{ y: "100%" }}
                                            animate={{ y: 0 }}
                                            exit={{ y: "100%" }}
                                            transition={{ type: "spring", damping: 25, stiffness: 500 }}
                                            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] lg:hidden max-h-[85vh] overflow-y-auto"
                                        >
                                            <div className="p-6 relative">
                                                {/* Handle bar */}
                                                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />

                                                <button
                                                    onClick={() => setShowMobileBooking(false)}
                                                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 transition-colors p-2"
                                                >
                                                    <ChevronDown size={24} />
                                                </button>

                                                <BookingCard
                                                    selectedDate={selectedDate}
                                                    onDateChange={setSelectedDate}
                                                    selectedSpace={selectedSpace}
                                                    selectedSpaceName={resources.find(r => r.id === selectedSpace)?.name}
                                                    onSpaceSelect={setSelectedSpace}
                                                    occupiedIds={occupiedIds}
                                                    onSuccess={handleRefresh}
                                                    isLoading={isLoading}
                                                    resources={resources}
                                                />
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>

                            {/* Mobile Sticky Booking Button - Only visible when sheet is closed */}
                            {!showMobileBooking && (
                                <div className="sticky bottom-6 left-0 right-0 p-4 lg:hidden z-30 pointer-events-none">
                                    <button
                                        onClick={() => setShowMobileBooking(true)}
                                        className="w-full bg-[#09C9CB] text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-transform pointer-events-auto font-principal"
                                    >
                                        RESERVAR
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="lg:col-span-1 hidden lg:block">
                            <div className="sticky top-24">
                                <BookingCard
                                    selectedDate={selectedDate}
                                    onDateChange={setSelectedDate}
                                    selectedSpace={selectedSpace}
                                    selectedSpaceName={resources.find(r => r.id === selectedSpace)?.name}
                                    onSpaceSelect={setSelectedSpace}
                                    occupiedIds={occupiedIds}
                                    onSuccess={handleRefresh}
                                    isLoading={isLoading}
                                    resources={resources}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
