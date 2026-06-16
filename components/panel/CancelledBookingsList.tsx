'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Phone, Mail, Search, FileText, ChevronLeft, ChevronRight, Edit } from '../ui/Icons';
import { useSession } from 'next-auth/react';
import { getAllBookings } from '@/services/bookingService';
import { ReservationModal } from './ReservationModal';
import { Resource } from '@/services/resourceService';

interface CancelledBookingsListProps {
    resources: Resource[];
    resourceType?: string; // e.g. 'Palapas', 'Bungalows'
}

export const CancelledBookingsList: React.FC<CancelledBookingsListProps> = ({ resources, resourceType }) => {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const { data: session } = useSession();
    const token = (session?.user as any)?.accessToken || '';

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const data = await getAllBookings(token);
            setBookings(data);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const displayBookings = bookings.filter(b => b.status === 'CANCELLED');

    const filteredBookings = displayBookings.filter(booking => {
        const matchesSearch = booking.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.phone?.includes(searchTerm);

        // If resource is not found in the allowed resources list (e.g. a Beach Club booking appearing in Hotel view),
        // we must hide it.
        const resource = resources.find(r => r.id === booking.resourceId);
        if (!resource) return false;

        if (resourceType === 'BeachClub') {
            return matchesSearch && resource.type === 'BEACH_CLUB';
        }

        if (resourceType === 'Palapas') {
            const name = resource.name.toLowerCase();
            const isLounge = name.includes('lounge') || resource.category?.name?.toLowerCase() === 'lounge' || resource.id.startsWith('L');
            const isAlberca = name.includes('alberca') || resource.category?.name?.toLowerCase() === 'alberca' || resource.id.startsWith('A');
            return matchesSearch && resource.type === 'BEACH_CLUB' && !isLounge && !isAlberca;
        }

        if (resourceType === 'Lounge') {
            const name = resource.name.toLowerCase();
            return matchesSearch && (name.includes('lounge') || resource.category?.name?.toLowerCase() === 'lounge' || resource.id.startsWith('L'));
        }

        if (resourceType === 'Alberca') {
            const name = resource.name.toLowerCase();
            return matchesSearch && (name.includes('alberca') || resource.category?.name?.toLowerCase() === 'alberca' || resource.id.startsWith('A'));
        }

        if (resourceType === 'Bungalows') {
            return matchesSearch && (resource.type === 'HOTEL' || resource.name.toLowerCase().startsWith('b') || resource.category?.name?.toLowerCase() === 'bungalow');
        }

        return matchesSearch;
    });

    const formatDisplayDate = (dateISO: string) => {
        if (!dateISO) return '';
        const date = new Date(dateISO);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col"
        >
            <div className="p-4 md:p-8 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
                <div className="w-full md:w-auto">
                    <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
                        Historial de Cancelaciones
                    </h2>
                    <p className="text-slate-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1">
                        Listado de Reservas Anuladas ({filteredBookings.length})
                    </p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por cliente, email o tel..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 text-zinc-400 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#09C9CB]/20 focus:border-[#09C9CB] transition-all w-full"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <div className="text-slate-400 font-bold animate-pulse uppercase tracking-widest text-[10px]">Cargando...</div>
                    </div>
                ) : filteredBookings.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredBookings.map((booking) => {
                                const resource = resources.find(r => r.id === booking.resourceId);
                                return (
                                    <motion.div
                                        key={booking.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="bg-slate-50 border border-slate-100 p-6 rounded-[32px] hover:shadow-lg transition-all border-l-4 border-l-red-500/50 group flex flex-col justify-between"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-extrabold text-slate-900 uppercase text-xs tracking-tight">{booking.fullName}</h3>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{resource?.name || 'Recurso'}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setIsModalOpen(true);
                                                }}
                                                className="p-3 bg-white border border-slate-100 rounded-xl transition-all text-[#09C9CB] shadow-sm hover:bg-[#09C9CB]/5 hover:border-[#09C9CB]/20 active:scale-95"
                                            >
                                                <Edit size={20} />
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-slate-600">
                                                <Calendar size={14} className="text-slate-400" />
                                                <span className="text-[10px] font-bold uppercase tracking-tight">
                                                    {formatDisplayDate(booking.startDate)} {booking.startDate !== booking.endDate ? ` - ${formatDisplayDate(booking.endDate)}` : ''}
                                                </span>
                                            </div>
                                            {booking.phone && (
                                                <div className="flex items-center gap-3 text-slate-600">
                                                    <Phone size={14} className="text-slate-400" />
                                                    <span className="text-[10px] font-bold">{booking.phone}</span>
                                                </div>
                                            )}
                                            {booking.notes && (
                                                <div className="flex items-start gap-3 mt-2 pt-2 border-t border-slate-200/50">
                                                    <FileText size={14} className="text-slate-400 mt-1" />
                                                    <p className="text-[10px] text-slate-400 italic">"{booking.notes}"</p>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-20 text-slate-400">
                        <div className="p-4 bg-slate-50 rounded-full mb-4">
                            <Search size={32} strokeWidth={1.5} />
                        </div>
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em]">No se encontraron cancelaciones</p>
                    </div>
                )}
            </div>

            {isModalOpen && selectedBooking && (
                <ReservationModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedBooking(null);
                    }}
                    onSuccess={fetchBookings}
                    resources={resources}
                    editingBooking={selectedBooking}
                    existingBookings={bookings.filter(b => b.status !== 'CANCELLED')}
                    isRange={resourceType === 'Bungalows'}
                />
            )}
        </motion.div>
    );
};
