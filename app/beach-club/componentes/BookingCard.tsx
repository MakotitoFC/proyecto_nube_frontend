'use client';

import React, { useState, useEffect } from 'react';
import CalendarSelector from '@/components/home/CalendarSelector';
import { IconCalendar, IconCheck, IconClock, IconAlertCircle, IconInfoCircle, IconUser, IconCoins } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createBooking } from '@/services/bookingService';
import { Resource } from '@/services/resourceService';
import { toast } from 'sonner';

interface ContactFormData {
    fullName: string;
    email: string;
    phone: string;
}

const BookingCard = ({
    selectedDate,
    onDateChange,
    selectedSpace,
    selectedSpaceName,
    onSpaceSelect,
    occupiedIds = [],
    onSuccess,
    isLoading,
    resources = []
}: {
    selectedDate?: string,
    onDateChange?: (date: string) => void,
    selectedSpace?: string | null,
    selectedSpaceName?: string,
    onSpaceSelect?: (id: string | null) => void,
    occupiedIds?: string[],
    onSuccess?: () => void,
    isLoading?: boolean,
    resources?: Resource[]
}) => {
    // State
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [popoverDirection, setPopoverDirection] = useState<'down' | 'up'>('down');

    const toggleCalendar = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        // Increase threshold to 500 to be safer
        setPopoverDirection(spaceBelow < 500 ? 'up' : 'down');
        setIsCalendarOpen(!isCalendarOpen);
    };
    const [localCheckIn, setLocalCheckIn] = useState('2026-02-14');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [guestCount, setGuestCount] = useState(1);
    const [formData, setFormData] = useState<ContactFormData>({
        fullName: '',
        email: '',
        phone: ''
    });
    const [formErrors, setFormErrors] = useState<Partial<ContactFormData>>({});

    const currentSpaceID = selectedSpace ?? null;

    // Real-time availability check
    useEffect(() => {
        // If the booking was just successful or is submitting, don't trigger unavailability alert for the same room
        if (showSuccess || isSubmitting) return;

        if (currentSpaceID) {
            const resource = resources.find(r => r.id === currentSpaceID);
            const isOccupied = occupiedIds.includes(currentSpaceID);
            const isMaintenance = resource && resource.status !== 'AVAILABLE';

            if (isOccupied || isMaintenance) {
                if (onSpaceSelect) onSpaceSelect(null);
                toast.error(
                    isOccupied
                        ? '¡Lo sentimos! Este espacio acaba de ser reservado por otro usuario.'
                        : 'Este espacio ya no está disponible.',
                    {
                        duration: 4000,
                        id: 'availability-toast'
                    }
                );
            }
        }
    }, [occupiedIds, resources, currentSpaceID, onSpaceSelect, showSuccess, isSubmitting]);

    // Reset guest count when space selection changes
    useEffect(() => {
        setGuestCount(1);
    }, [selectedSpace]);
    const checkIn = selectedDate || localCheckIn;

    // Check if current time is past 12:30 PM cutoff
    const isPastCutoff = () => {
        const now = new Date();
        const cutoffTime = new Date();
        cutoffTime.setHours(12, 30, 0, 0);
        return now > cutoffTime;
    };

    // Get minimum selectable date
    const getMinDate = () => {
        const today = new Date();
        const targetDate = new Date(today);
        if (isPastCutoff()) {
            targetDate.setDate(targetDate.getDate() + 1);
        }

        // Construct YYYY-MM-DD using local time components to avoid timezone shifts
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const getSpaceName = (id: string | null) => {
        if (!id) return '';
        const prefix = id.charAt(0).toUpperCase();
        switch (prefix) {
            case 'P': return `Palapa Privada ${id}`;
            case 'A': return `Zona Alberca ${id}`;
            case 'L': return `Lounge VIP ${id}`;
            default: return `Espacio ${id}`;
        }
    };

    const currentResourceObj = resources.find(r => r.id === currentSpaceID);

    const currentSpaceName = selectedSpaceName
        || (currentResourceObj?.category?.name ? `${currentResourceObj.category.name} - ${currentResourceObj.name}` : currentResourceObj?.name)
        || getSpaceName(currentSpaceID);

    const handleDateChange = (date: string) => {
        if (onDateChange) {
            onDateChange(date);
        } else {
            setLocalCheckIn(date);
        }
    };

    // Default to resource category max capacity or 4
    const maxCapacity = currentResourceObj?.category?.maxCapacity || 4;
    const basePrice = currentResourceObj?.category?.basePrice || 100;

    const DISPLAY_PRICE = guestCount * basePrice;

    // Form validation
    const validateForm = (): boolean => {
        const errors: Partial<ContactFormData> = {};

        if (!formData.fullName.trim()) {
            errors.fullName = 'Nombre requerido';
        }

        if (!formData.email.trim()) {
            errors.email = 'Email requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Email inválido';
        }

        if (!formData.phone.trim()) {
            errors.phone = 'Teléfono requerido';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const isOccupied = currentSpaceID ? occupiedIds?.includes(currentSpaceID) : false;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || isOccupied) return;

        setIsSubmitting(true);

        try {
            const itemToBook = {
                spaceId: currentSpaceID,
                spaceName: currentSpaceName,
                date: checkIn,
                price: DISPLAY_PRICE
            };

            if (!itemToBook.spaceId) {
                throw new Error("No space selected");
            }

            // Create dates: Start at 11:00 AM, end at 6:00 PM (18:00)
            const startDate = `${itemToBook.date}T11:00:00.000Z`;
            const endDate = `${itemToBook.date}T18:00:00.000Z`;

            await createBooking({
                resourceId: itemToBook.spaceId,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                startDate,
                endDate,
                guestCount,
                estimatedArrivalTime: "11:00", // Default or from form
                notes: `Reserva para ${itemToBook.spaceName}`,
                status: 'PENDING'
            });

            if (onSuccess) onSuccess();

            setIsSubmitting(false);
            setShowSuccess(true);

            setTimeout(() => {
                setShowSuccess(false);
                setGuestCount(1);
                setFormData({ fullName: '', email: '', phone: '' });
                setFormErrors({});
                if (onSpaceSelect) onSpaceSelect(null);
            }, 3000);
        } catch (error: any) {
            console.error('Error creating booking:', error);
            alert(error.message || "Error al crear la reserva");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white lg:p-10 rounded-none lg:rounded-3xl shadow-none lg:shadow-xl border-none lg:border lg:border-slate-100 font-principal">
            <AnimatePresence mode="wait">
                {showSuccess ? (
                    <motion.div
                        key="success-message"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-center py-12"
                    >
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IconCheck size={32} className="text-green-600" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">¡Reserva Confirmada!</h3>
                        <p className="text-slate-600 text-sm">Nos pondremos en contacto contigo pronto.</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="booking-form-area"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-8"
                    >
                        {/* Unified Date Picker (Mobile & PC) */}
                        <div className="space-y-2 mb-6 relative">
                            <label className="text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-2 block">Fecha de Reserva</label>
                            
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={toggleCalendar}
                                    className={`w-full bg-white border-2 rounded-2xl px-4 py-3.5 text-sm flex items-center justify-between transition-all font-bold outline-none ${isCalendarOpen ? 'border-[#09C9CB] shadow-lg shadow-[#09C9CB]/10' : 'border-slate-100 hover:border-slate-200'}`}
                                >
                                    <span className="text-slate-900">
                                        {new Date(checkIn + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                    </span>
                                    <IconCalendar className="text-[#09C9CB]" size={20} />
                                </button>

                                <AnimatePresence>
                                    {isCalendarOpen && (
                                        <>
                                            {/* Backdrop to close when clicking outside */}
                                            <motion.div 
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                onClick={() => setIsCalendarOpen(false)}
                                                className="fixed inset-0 z-40"
                                            />
                                            
                                            <motion.div
                                                initial={{ opacity: 0, y: popoverDirection === 'down' ? 10 : -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: popoverDirection === 'down' ? 10 : -10, scale: 0.95 }}
                                                className={`absolute ${popoverDirection === 'down' ? 'top-full mt-3' : 'bottom-full mb-3'} left-0 md:left-auto md:right-0 z-50 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden p-4 ${popoverDirection === 'down' ? 'origin-top' : 'origin-bottom'} w-full md:w-[320px] lg:w-[350px]`}
                                            >
                                                <CalendarSelector
                                                    mode="single"
                                                    variant="minimal"
                                                    selectedDate={checkIn}
                                                    onSelect={(date) => {
                                                        handleDateChange(date);
                                                        setIsCalendarOpen(false);
                                                    }}
                                                />
                                            </motion.div>
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            {isLoading && (
                                <div className="absolute -bottom-6 left-0 right-0 flex items-center justify-center gap-2 text-[#09C9CB]">
                                    <div className="w-1.5 h-1.5 bg-[#09C9CB] rounded-full animate-pulse" />
                                    <span className="text-[9px] font-bold uppercase tracking-wider">Verificando disponibilidad...</span>
                                </div>
                            )}
                        </div>

                        {/* Selection & Form */}
                        {currentSpaceID ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                {/* Header / Spacer */}
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">
                                            {currentResourceObj?.category?.name || 'Tu Selección'}
                                        </p>
                                        <h3 className="text-xl font-black text-slate-900 font-principal leading-tight">
                                            {currentResourceObj ? currentResourceObj.name : currentSpaceName}
                                        </h3>
                                    </div>
                                    <button
                                        onClick={() => onSpaceSelect && onSpaceSelect(null)}
                                        className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all p-2 rounded-full -mt-2 -mr-2"
                                    >
                                        <span className="text-lg block w-4 h-4 leading-[14px]">✕</span>
                                    </button>
                                </div>

                                {/* Operating Hours Info */}
                                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 mb-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#09C9CB] shadow-sm shrink-0">
                                        <IconClock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Horario de Operación</p>
                                        <p className="text-sm font-black text-slate-900">11:00 AM - 6:00 PM</p>
                                        <p className="text-[10px] text-slate-500 font-bold">Last call: 5:30 PM</p>
                                    </div>
                                </div>

                                {/* Cutoff Warning */}
                                {isPastCutoff() && (
                                    <div className="bg-amber-50 border-2 border-dashed border-amber-200 rounded-2xl p-4 mb-4 flex items-start gap-3">
                                        <IconAlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] font-bold text-amber-900 uppercase tracking-widest mb-1">Aviso Importante</p>
                                            <p className="text-xs text-amber-700 leading-relaxed font-medium">Las reservas después de las 12:30 PM son para el día siguiente.</p>
                                        </div>
                                    </div>
                                )}

                                {/* Occupied Warning OR Form */}
                                {isOccupied ? (
                                    <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-center mt-6">
                                        <p className="text-red-600 font-black text-xs uppercase tracking-widest">Ocupado para esta fecha</p>
                                        <p className="text-[10px] text-red-400 mt-1">Por favor selecciona otro espacio o fecha</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                                        {/* Full Name */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                                                Nombre Completo
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.fullName}
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                                className={`w-full bg-slate-50 border ${formErrors.fullName ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#09C9CB] focus:border-transparent font-medium`}
                                                placeholder="Ej. Juan Pérez"
                                            />
                                            {formErrors.fullName && (
                                                <p className="text-xs text-red-500 mt-1">{formErrors.fullName}</p>
                                            )}
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className={`w-full bg-slate-50 border ${formErrors.email ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#09C9CB] focus:border-transparent font-medium`}
                                                placeholder="correo@ejemplo.com"
                                            />
                                            {formErrors.email && (
                                                <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                                            )}
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                                                Teléfono
                                            </label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/\D/g, '');
                                                    setFormData({ ...formData, phone: val });
                                                }}
                                                className={`w-full bg-slate-50 border ${formErrors.phone ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#09C9CB] focus:border-transparent font-medium`}
                                                placeholder="(123) 456-7890"
                                            />
                                            {formErrors.phone && (
                                                <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>
                                            )}
                                        </div>


                                        {/* Number of Guests */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                                                Número de Personas
                                            </label>
                                            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 rounded-xl p-2 w-fit">
                                                <button
                                                    type="button"
                                                    onClick={() => setGuestCount(prev => Math.max(1, prev - 1))}
                                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors text-slate-600 font-bold"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-black text-slate-900 text-lg">
                                                    {guestCount}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setGuestCount(prev => Math.min(maxCapacity, prev + 1))}
                                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors text-[#09C9CB] font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                                Capacidad máxima de este espacio: {maxCapacity} personas
                                            </p>
                                        </div>

                                        {/* Booking Summary */}
                                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Resumen</p>
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-600">Fecha:</span>
                                                    <span className="font-bold text-slate-900">{checkIn}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-600">Espacio:</span>
                                                    <span className="font-bold text-slate-900">{currentResourceObj ? currentResourceObj.name : currentSpaceName}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-slate-600">Personas:</span>
                                                    <span className="font-bold text-slate-900">{guestCount} x ${basePrice}</span>
                                                </div>
                                                <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                                                    <span className="text-slate-600">Total:</span>
                                                    <span className="font-black text-slate-900 text-lg">${DISPLAY_PRICE.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-[#09C9CB] text-white py-4 rounded-xl font-black text-xs hover:brightness-110 transition-all shadow-lg shadow-[#09C9CB]/20 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? 'Enviando...' : 'Confirmar Reserva'}
                                        </button>
                                    </form>
                                )}
                            </div>
                        ) : (
                            <div className="animate-in fade-in duration-300">
                                <div className="text-center py-8 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100 px-6">
                                    <p className="text-slate-400 font-bold text-xs mb-1 uppercase tracking-wider">Selecciona un espacio</p>
                                    <p className="text-[10px] text-slate-300">Elige una palapa o zona en el mapa para reservar.</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default BookingCard;
