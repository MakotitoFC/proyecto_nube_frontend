'use client';

import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, User, Calendar, IconBrandWhatsapp, Edit, Trash2, IconLock, IconEye, BadgeCheck } from '../ui/Icons';
import { useSession } from 'next-auth/react';
import { getAllBookings, updateBooking } from '@/services/bookingService';
import { Resource as BackendResource } from '@/services/resourceService';
import * as Popover from '@radix-ui/react-popover';
import { ReservationModal } from './ReservationModal';
import { ConfirmModal } from '../ui/ConfirmModal';
import { toast } from 'sonner';

// Resource interface is now imported from resourceService as BackendResource

interface ReservationCalendarProps {
    resources: BackendResource[];
    resourceType: string;
}

export interface ReservationCalendarHandle {
    openGeneralModal: () => void;
}

export const ReservationCalendar = forwardRef<ReservationCalendarHandle, ReservationCalendarProps>(({ resources, resourceType }, ref) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showCancelled, setShowCancelled] = useState(false);
    const [allBookings, setAllBookings] = useState<any[]>([]); // Store all fetched bookings
    const [bookings, setBookings] = useState<any[]>([]); // Store filtered bookings
    const [loading, setLoading] = useState(true);
    const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCell, setSelectedCell] = useState<{ resourceId: string; resourceName: string; date: string } | null>(null);
    const [editingBooking, setEditingBooking] = useState<any>(null);
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; bookingId: string | null; }>({ isOpen: false, bookingId: null });
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    // Stores the absolute left/width of the currently open booking bar so the scroll
    // handler can determine exactly when it leaves the visible area.
    const openBookingBoundsRef = useRef<{ left: number; width: number } | null>(null);
    const { data: session } = useSession();
    const token = (session?.user as any)?.accessToken || '';

    const handleCancelBooking = (bookingId: string) => {
        setConfirmModal({ isOpen: true, bookingId });
    };

    const confirmCancellation = async () => {
        if (!confirmModal.bookingId) return;
        try {
            await updateBooking(token, confirmModal.bookingId, { status: 'CANCELLED' });
            toast.success('Reserva cancelada con éxito');
            fetchBookings();
            setOpenPopoverId(null);
            setConfirmModal({ isOpen: false, bookingId: null });
        } catch (err) {
            console.error("Failed to cancel booking:", err);
            toast.error("Error al cancelar la reserva");
        }
    };

    const fetchBookings = async (isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);
            const data = await getAllBookings(token);
            setAllBookings(data);
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    // Filter bookings based on showCancelled and searchTerm
    useEffect(() => {
        let filtered = allBookings;
        if (!showCancelled) {
            filtered = filtered.filter(b => b.status !== 'CANCELLED');
        }
        setBookings(filtered);
    }, [allBookings, showCancelled]);

    useEffect(() => {
        fetchBookings();
        const interval = setInterval(() => fetchBookings(true), 5000);
        return () => clearInterval(interval);
    }, []);


    // Close the popover only when the booking bar actually scrolls out of the visible area.
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;
        const handleScroll = () => {
            if (!openBookingBoundsRef.current) return;
            const isMobile = window.innerWidth < 768;
            const stickyColW = isMobile ? 100 : 240;
            const { scrollLeft, clientWidth } = container;
            const { left: bookingLeft, width: bookingWidth } = openBookingBoundsRef.current;
            const bookingRight = bookingLeft + bookingWidth;
            // bookingLeft is relative to the timeline div (starts after the sticky col)
            // Hidden left (behind sticky col): entire bar is left of scrollLeft
            const hiddenLeft = bookingRight <= scrollLeft;
            // Hidden right: booking starts beyond the visible timeline area
            const hiddenRight = bookingLeft >= scrollLeft + clientWidth - stickyColW;
            if (hiddenLeft || hiddenRight) {
                setOpenPopoverId(null);
                openBookingBoundsRef.current = null;
            }
        };
        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const totalDays = daysInMonth(year, month);

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    // Auto-scroll to current date
    useEffect(() => {
        const today = new Date();
        const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;

        if (isCurrentMonth && scrollContainerRef.current) {
            const currentDay = today.getDate();

            // Calculate scroll position to center current day
            const isMobile = window.innerWidth < 768;
            const cellW = isMobile ? 80 : 160;
            const stickyColW = isMobile ? 100 : 240;

            const scrollPosition = (currentDay - 1) * cellW - (scrollContainerRef.current.clientWidth / 2) + (cellW / 2) + stickyColW;

            setTimeout(() => {
                scrollContainerRef.current?.scrollTo({
                    left: Math.max(0, scrollPosition),
                    behavior: 'smooth'
                });
            }, 100);
        }
    }, [month, year]);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    // Filter resources based on type if provided
    const filteredResources = resourceType
        ? resources.filter(r => {
            const name = r.name.toLowerCase();
            const type = r.type; // Backend resource type

            const isLounge = name.includes('lounge') || (r.category as any)?.name?.toLowerCase() === 'lounge' || r.id.startsWith('L');
            const isAlberca = name.includes('alberca') || (r.category as any)?.name?.toLowerCase() === 'alberca' || r.id.startsWith('A');

            // Beach Club filters
            if (resourceType === 'Palapas') return type === 'BEACH_CLUB' && !isLounge && !isAlberca;
            if (resourceType === 'Lounge') return type === 'BEACH_CLUB' && isLounge;
            if (resourceType === 'Alberca') return type === 'BEACH_CLUB' && isAlberca;

            // Hotel filters
            if (resourceType === 'Bungalows') return type === 'HOTEL' || name.startsWith('b') || (r.category as any)?.name?.toLowerCase() === 'bungalow';
            if (resourceType === 'Habitaciones') return type === 'HOTEL';

            return true;
        })
        : resources;

    // Helpers for TZ-safe display
    const formatDisplayDate = (dateISO: string | Date) => {
        if (!dateISO) return '';
        const date = typeof dateISO === 'string' ? new Date(dateISO) : dateISO;
        const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        return `${date.getDate()} ${months[date.getMonth()]}`;
    };

    useImperativeHandle(ref, () => ({
        openGeneralModal: () => {
            setSelectedCell(null);
            setEditingBooking(null);
            setIsModalOpen(true);
        }
    }));

    // Real occupancy logic returning the booking object
    const getBooking = (resourceId: string, day: number) => {
        const checkStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        return bookings.find(booking => {
            if (booking.resourceId !== resourceId) return false;
            // Additional safety: ensure we don't show cancelled ones even if they slip through filtering
            if (booking.status === 'CANCELLED') return false;
            const startStr = booking.startDate.split('T')[0];
            const endStr = booking.endDate.split('T')[0];
            return checkStr >= startStr && checkStr <= endStr;
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] md:rounded-[40px] border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col relative"
        >

            <div className="p-4 md:p-8 border-b border-slate-100 flex items-center justify-between flex-wrap md:flex-nowrap gap-4 flex-shrink-0">
                <div className="min-w-fit">
                    <h2 className="text-lg md:text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
                        Ocupación Mensual
                    </h2>
                    <p className="text-slate-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-1">
                        Timeline • {monthNames[month]} {year}
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">

                    <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                        <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                            <ChevronLeft size={18} className="text-slate-600" />
                        </button>
                        <div className="px-3 flex items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-900">
                                {monthNames[month].substring(0, 3)}
                            </span>
                        </div>
                        <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all">
                            <ChevronRight size={18} className="text-slate-600" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Calendar Body */}
            <div className="relative overflow-hidden bg-slate-50/50 flex-1 flex flex-col">
                <div
                    ref={scrollContainerRef}
                    className="overflow-x-auto overflow-y-auto h-full"
                >
                    <table className="min-w-full border-collapse">
                        <thead className="sticky top-0 z-30 bg-white">
                            <tr>
                                <th className="sticky left-0 z-40 bg-white p-2 md:p-6 min-w-[100px] md:min-w-[240px] border-r border-b border-slate-100 text-left shadow-[4px_0_10px_-4px_rgba(0,0,0,0.02)]">
                                    <span className="text-[7.5px] md:text-[10px] font-bold text-slate-400 uppercase tracking-tighter md:tracking-[0.2em]">Recurso</span>
                                </th>
                                {Array.from({ length: totalDays }, (_, i) => {
                                    const day = i + 1;
                                    const date = new Date(year, month, day);
                                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                                    const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

                                    return (
                                        <th key={day} className={`p-1 md:p-4 min-w-[80px] md:min-w-[160px] border-b border-slate-100 text-center ${isWeekend ? 'bg-slate-50/50' : ''}`}>
                                            <div className="flex flex-col items-center gap-0.5 md:gap-1">
                                                <span className={`text-[7px] md:text-[10px] font-bold uppercase tracking-tight ${isToday ? 'text-[#09C9CB]' : 'text-slate-400'}`}>
                                                    {['D', 'L', 'M', 'M', 'J', 'V', 'S'][date.getDay()]}
                                                </span>
                                                <span className={`text-[10px] md:text-sm font-extrabold ${isToday ? 'bg-[#09C9CB] text-white w-5 h-5 md:w-7 md:h-7 flex items-center justify-center rounded-full' : 'text-slate-900'}`}>
                                                    {day}
                                                </span>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredResources.map((resource) => {
                                const resourceBookings = bookings.filter(b => b.resourceId === resource.id && b.status !== 'CANCELLED');

                                return (
                                    <tr key={resource.id} className="group hover:bg-slate-50/30 transition-colors">
                                        {/* Resource Header */}
                                        <td className={`sticky left-0 z-20 p-2 md:p-6 border-r border-slate-100 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.02)] transition-colors align-top ${resource.status === 'MAINTENANCE' ? 'bg-slate-50/80 cursor-not-allowed' : 'bg-white group-hover:bg-slate-100'}`}>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-1.5 md:gap-2">
                                                    <span className={`text-[9px] md:text-xs font-bold uppercase tracking-tighter md:tracking-tight ${resource.status === 'MAINTENANCE' ? 'text-slate-400' : 'text-slate-900'}`}>{resource.name}</span>
                                                    {resource.status === 'MAINTENANCE' && <IconLock size={8} className="text-slate-400" />}
                                                </div>
                                                <span className="text-[7px] md:text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                                                    {(resource.category as any)?.name || 'Unidad'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Timeline Container */}
                                        <td colSpan={totalDays} className="p-0 relative h-full align-top">
                                            <div className="flex h-full relative">
                                                {/* Grid Background */}
                                                {Array.from({ length: totalDays }, (_, i) => {
                                                    const day = i + 1;
                                                    const date = new Date(year, month, day);
                                                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                                                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

                                                    return (
                                                        <div
                                                            key={day}
                                                            onClick={() => {
                                                                // Prevent interaction if resource is disabled (MAINTENANCE)
                                                                if (resource.status === 'MAINTENANCE') {
                                                                    toast.error('Este recurso está deshabilitado / mantenimiento.');
                                                                    return;
                                                                }

                                                                // Only trigger if clicking the empty cell background, not a booking
                                                                setSelectedCell({
                                                                    resourceId: resource.id,
                                                                    resourceName: resource.name,
                                                                    date: dateStr
                                                                });
                                                                setIsModalOpen(true);
                                                            }}
                                                            className={`min-w-[80px] md:min-w-[160px] h-12 md:h-28 border-r border-slate-100 transition-colors ${resource.status === 'MAINTENANCE' ? 'cursor-not-allowed bg-slate-100/50 hover:bg-slate-100/50' : `cursor-pointer hover:bg-slate-50/50 ${isWeekend ? 'bg-slate-50/30' : ''}`}`}
                                                        />
                                                    );
                                                })}

                                                {/* Bookings Layer */}
                                                {resourceBookings.map(booking => {
                                                    const startDate = new Date(booking.startDate);
                                                    startDate.setHours(0, 0, 0, 0);
                                                    const endDate = new Date(booking.endDate);
                                                    endDate.setHours(0, 0, 0, 0);
                                                    const currentMonthStart = new Date(year, month, 1);
                                                    currentMonthStart.setHours(0, 0, 0, 0);

                                                    // Calculate position relative to the 1st of the month
                                                    const startDiffTime = startDate.getTime() - currentMonthStart.getTime();
                                                    const startDayIndex = Math.round(startDiffTime / (1000 * 3600 * 24));

                                                    // Duration
                                                    const durationTime = endDate.getTime() - startDate.getTime();
                                                    const durationDays = Math.round(durationTime / (1000 * 3600 * 24)) + 1; // Inclusive start/end

                                                    // Width and Position
                                                    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                                                    const cellW = isMobile ? 80 : 160;
                                                    const width = Math.max(durationDays * cellW, cellW) - 4; // -4 for gap
                                                    const left = (startDayIndex * cellW) + 2; // +2 for gap

                                                    // Only render if visible in this month (simplified check)
                                                    // For now rendering all, overflow-hidden handles visibility if out of bounds horizontally?
                                                    // Better to render even if negative left, as long as part of it is visible. 
                                                    // But for simplification, we assume bookings are fetched roughly in range or we render them all.

                                                    const popoverId = booking.id;

                                                    return (
                                                        <Popover.Root
                                                            key={`${booking.id}-${booking.startDate}-${booking.resourceId}`}
                                                            open={openPopoverId === popoverId}
                                                            onOpenChange={(open) => {
                                                                if (!open) setOpenPopoverId(null);
                                                            }}
                                                        >
                                                            <Popover.Trigger asChild>
                                                                <motion.div
                                                                    drag
                                                                    dragSnapToOrigin
                                                                    dragMomentum={false}
                                                                    dragElastic={0}
                                                                    whileDrag={{ zIndex: 100, scale: 1.02, cursor: 'grabbing' }}
                                                                    // Snap to grid manually on drag end
                                                                    onDragEnd={async (_, info) => {
                                                                        const moveX = info.offset.x;
                                                                        const moveY = info.offset.y;

                                                                        const isMobile = window.innerWidth < 768;
                                                                        const cellW = isMobile ? 80 : 160;
                                                                        const daysMoved = Math.round(moveX / cellW);
                                                                        const rowH = isMobile ? 48 : 112; // h-12 = 48px, h-28 = 112px
                                                                        const rowsMoved = Math.round(moveY / rowH);

                                                                        if (daysMoved !== 0 || rowsMoved !== 0) {
                                                                            // Calculate new dates
                                                                            const newStart = new Date(startDate);
                                                                            newStart.setDate(newStart.getDate() + daysMoved);

                                                                            const newEnd = new Date(endDate);
                                                                            newEnd.setDate(newEnd.getDate() + daysMoved);

                                                                            // Calculate new resource
                                                                            const currentResourceIndex = resources.findIndex(r => r.id === resource.id);
                                                                            const newResourceIndex = currentResourceIndex + rowsMoved;

                                                                            let targetResourceId = booking.resourceId;
                                                                            if (newResourceIndex >= 0 && newResourceIndex < resources.length) {
                                                                                const targetResource = resources[newResourceIndex];
                                                                                // Check if target resource is disabled
                                                                                if (targetResource.status === 'MAINTENANCE') {
                                                                                    toast.error('No se puede mover a un recurso deshabilitado.');
                                                                                    return;
                                                                                }
                                                                                targetResourceId = targetResource.id;
                                                                            }

                                                                            // Conflict Detection Logic
                                                                            // We reuse the strict YYYY-MM-DD comparison logic here
                                                                            const getYYYYMMDD = (d: Date) => {
                                                                                const y = d.getFullYear();
                                                                                const m = String(d.getMonth() + 1).padStart(2, '0');
                                                                                const day = String(d.getDate()).padStart(2, '0');
                                                                                return `${y}-${m}-${day}`;
                                                                            };

                                                                            const newStartStr = getYYYYMMDD(newStart);
                                                                            const newEndStr = getYYYYMMDD(newEnd);

                                                                            const hasConflict = bookings.some(b => {
                                                                                if (b.id === booking.id) return false; // Skip self
                                                                                if (b.status === 'CANCELLED') return false; // Skip cancelled
                                                                                if (b.resourceId !== targetResourceId) return false; // Skip other resources

                                                                                // Parse existing booking dates safely to Local YYYY-MM-DD
                                                                                // (Assuming they come as ISO strings)
                                                                                const bStart = new Date(b.startDate);
                                                                                const bEnd = new Date(b.endDate);
                                                                                // Use local getters as we do in modal
                                                                                const bStartStr = `${bStart.getFullYear()}-${String(bStart.getMonth() + 1).padStart(2, '0')}-${String(bStart.getDate()).padStart(2, '0')}`;
                                                                                const bEndStr = `${bEnd.getFullYear()}-${String(bEnd.getMonth() + 1).padStart(2, '0')}-${String(bEnd.getDate()).padStart(2, '0')}`;

                                                                                return newStartStr <= bEndStr && newEndStr >= bStartStr;
                                                                            });

                                                                            if (hasConflict) {
                                                                                toast.error('¡Conflicto! El espacio ya está ocupado.');
                                                                                // Force re-render to snap back visually if needed, 
                                                                                // though without state change it might stick until next render.
                                                                                // Ideally we set state to trigger re-render or Framer Motion handles it if we don't update key.
                                                                                return;
                                                                            }

                                                                            // Safe to update
                                                                            // Optimistic UI Update
                                                                            const previousBookings = [...bookings];
                                                                            setBookings(prev => prev.map(b =>
                                                                                b.id === booking.id
                                                                                    ? {
                                                                                        ...b,
                                                                                        startDate: newStart.toISOString(),
                                                                                        endDate: newEnd.toISOString(),
                                                                                        resourceId: targetResourceId
                                                                                    }
                                                                                    : b
                                                                            ));

                                                                            try {
                                                                                // Ensure we save safe ISOs (Noon)
                                                                                const safeStart = new Date(newStart);
                                                                                safeStart.setHours(12, 0, 0, 0);
                                                                                const safeEnd = new Date(newEnd);
                                                                                safeEnd.setHours(12, 0, 0, 0);

                                                                                await updateBooking(token, booking.id, {
                                                                                    startDate: safeStart.toISOString(),
                                                                                    endDate: safeEnd.toISOString(),
                                                                                    resourceId: targetResourceId
                                                                                });
                                                                                // Success
                                                                            } catch (err) {
                                                                                console.error("Move failed", err);
                                                                                setBookings(previousBookings);
                                                                                toast.error('No se pudo mover la reserva.');
                                                                            }
                                                                        }
                                                                    }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setOpenPopoverId(popoverId);
                                                                        openBookingBoundsRef.current = { left, width };
                                                                    }}
                                                                    style={{
                                                                        position: 'absolute',
                                                                        left: left,
                                                                        width: width,
                                                                        top: 6,
                                                                        height: 'calc(100% - 12px)',
                                                                        zIndex: 10
                                                                    }}
                                                                    className={`rounded-xl shadow-sm border border-white/10 ${booking.status === 'CONFIRMED' ? 'bg-emerald-500' : booking.status === 'CANCELLED' ? 'bg-red-500/80 grayscale opacity-80 decoration-red-900 line-through' : 'bg-[#09C9CB]'} text-white text-[10px] font-bold uppercase flex items-center px-4 cursor-grab active:cursor-grabbing hover:brightness-105 transition-all overflow-hidden`}
                                                                >
                                                                    <div className="flex flex-col items-start truncate">
                                                                        <span className="truncate w-full">{booking.fullName}</span>
                                                                        <span className="opacity-80 text-[9px]">{booking.status === 'CONFIRMED' ? 'Confirmado' : 'Reservado'}</span>
                                                                    </div>
                                                                </motion.div>
                                                            </Popover.Trigger>

                                                            <Popover.Portal>
                                                                <Popover.Content
                                                                    side="top"
                                                                    align="center"
                                                                    sideOffset={5}
                                                                    className="w-72 bg-blue-50/60 backdrop-blur-2xl text-slate-900 p-6 rounded-[32px] shadow-2xl border-2 border-slate-900/40 z-100 animate-in fade-in zoom-in duration-200"
                                                                >
                                                                    {/* Popover Content (Same as before) */}
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-start gap-3">
                                                                            <div className="p-2 bg-slate-900/5 rounded-lg">
                                                                                <User size={16} className="text-[#09C9CB]" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Huésped</p>
                                                                                <p className="text-xs font-bold text-slate-900 uppercase">{booking.fullName}</p>
                                                                                <div className={`px-2 py-0.5 ${booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-[#09C9CB]/10 text-[#09C9CB]'} rounded-full text-[10px] font-bold uppercase tracking-wider`}>
                                                                                    {booking.status === 'CONFIRMED' ? 'Confirmado' : booking.status === 'CANCELLED' ? 'Cancelado' : 'Pendiente'}
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-3 flex items-center gap-3">
                                                                            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#09C9CB] shadow-sm shrink-0">
                                                                                <BadgeCheck size={16} />
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Atendido por</p>
                                                                                <p className="text-[11px] font-black text-slate-900 uppercase">
                                                                                    {booking.user?.fullName ? booking.user.fullName : 'Cliente Web'}
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-start gap-3">
                                                                            <div className="p-2 bg-slate-900/5 rounded-lg">
                                                                                <Calendar size={16} className="text-[#09C9CB]" />
                                                                            </div>
                                                                            <div>
                                                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estancia</p>
                                                                                <p className="text-xs font-bold text-slate-900 uppercase">
                                                                                    {(() => {
                                                                                        // Use the normalized dates from the render loop to match grid position exactly
                                                                                        // Inclusive night count: Difference + 1 day
                                                                                        const nightCount = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1;

                                                                                        const dateRange = startDate.getTime() === endDate.getTime()
                                                                                            ? formatDisplayDate(startDate)
                                                                                            : `${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`;

                                                                                        return (
                                                                                            <span>
                                                                                                {dateRange}
                                                                                                <span className="ml-1 opacity-60 font-normal normal-case">
                                                                                                    ({nightCount} {nightCount === 1 ? 'Noche' : 'Noches'})
                                                                                                </span>
                                                                                            </span>
                                                                                        );
                                                                                    })()}
                                                                                </p>
                                                                            </div>
                                                                        </div>

                                                                        {booking.guestCount && (
                                                                            <div className="flex items-start gap-3">
                                                                                <div className="p-2 bg-slate-900/5 rounded-lg">
                                                                                    <User size={16} className="text-[#09C9CB]" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Personas</p>
                                                                                    <p className="text-xs font-bold text-slate-900">
                                                                                        {booking.guestCount} {booking.guestCount === 1 ? 'Persona' : 'Personas'}
                                                                                        {booking.totalAmount ? ` - $${booking.totalAmount.toLocaleString()}` : ''}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {booking.phone && (
                                                                            <div className="flex items-start gap-3">
                                                                                <div className="p-2 bg-slate-900/5 rounded-lg">
                                                                                    <IconBrandWhatsapp size={16} className="text-[#09C9CB]" />
                                                                                </div>
                                                                                <div>
                                                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Teléfono</p>
                                                                                    <p className="text-xs font-bold text-slate-900">{booking.phone}</p>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        <div className="pt-2 border-t border-slate-900/10 flex items-center justify-between gap-4">
                                                                            {booking.notes ? (
                                                                                <p className="text-[10px] text-slate-600 font-medium italic flex-1 truncate">"{booking.notes}"</p>
                                                                            ) : (
                                                                                <div className="flex-1" />
                                                                            )}
                                                                            <div className="flex items-center gap-2">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setEditingBooking(booking);
                                                                                        setIsModalOpen(true);
                                                                                        setOpenPopoverId(null);
                                                                                    }}
                                                                                    className="p-1.5 hover:bg-slate-900/5 rounded-lg text-slate-400 hover:text-slate-900 transition-colors border border-slate-900/5"
                                                                                    title={booking.status === 'CANCELLED' ? "Ver detalles" : "Editar reserva"}
                                                                                >
                                                                                    {booking.status === 'CANCELLED' ? <IconEye size={12} /> : <Edit size={12} />}
                                                                                </button>
                                                                                <button
                                                                                    onClick={async () => {
                                                                                        handleCancelBooking(booking.id);
                                                                                    }}
                                                                                    className="p-1.5 hover:bg-slate-900/5 rounded-lg text-slate-400 hover:text-red-500 transition-colors border border-slate-900/5"
                                                                                >
                                                                                    <Trash2 size={12} />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <Popover.Arrow className="fill-blue-50/60" width={16} height={8} />
                                                                </Popover.Content>
                                                            </Popover.Portal>
                                                        </Popover.Root>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

   

            {isModalOpen && (
                <ReservationModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedCell(null);
                        setEditingBooking(null);
                    }}
                    onSuccess={fetchBookings}
                    resources={resources}
                    resourceId={selectedCell?.resourceId || editingBooking?.resourceId}
                    resourceName={selectedCell?.resourceName || resources.find(r => r.id === editingBooking?.resourceId)?.name}
                    selectedDate={selectedCell?.date || editingBooking?.startDate}
                    isRange={resourceType === 'Bungalows'}
                    editingBooking={editingBooking}
                    existingBookings={bookings}
                />
            )}

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmCancellation}
                title="Cancelar Reserva"
                message="¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer."
                confirmText="Sí, Cancelar"
                variant="danger"
            />
        </motion.div>
    );
});
