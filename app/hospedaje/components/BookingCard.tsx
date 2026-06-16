'use client';

import { Calendar as IconCalendar, Check, X, ArrowLeft, Clock } from 'lucide-react';
import { IconClock, IconAlertCircle, IconInfoCircle } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import HotelCalendarSelector from './HotelCalendarSelector';
import { createBooking } from '@/services/bookingService';
import { Resource } from '@/services/resourceService';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import React from 'react';

interface ContactFormData {
    fullName: string;
    email: string;
    phone: string;
    estimatedArrivalTime: string;
}

const ARRIVAL_TIMES = [
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM',
    '6:00 PM', '7:00 PM', '8:00 PM', '9:00 PM',
    '10:00 PM', '11:00 PM'
];

interface BookingCardProps {
    resources: Resource[];
    occupiedIds: string[];
    externalDates: { checkIn: string | null; checkOut: string | null };
    onDateChange: (start: string, end: string | null) => void;
    onSuccess?: () => void;
    isLoading?: boolean;
}

const BookingCard = ({ resources, occupiedIds, externalDates, onDateChange, onSuccess, isLoading }: BookingCardProps) => {
    // Custom data
    const roomCleanFee = 0;

    // Helper for default dates
    const getToday = () => new Date();
    const getTomorrow = () => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d;
    };
    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    // State
    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [checkIn, setCheckIn] = useState<string | null>(externalDates.checkIn);
    const [checkOut, setCheckOut] = useState<string | null>(externalDates.checkOut);
    const [showContactForm, setShowContactForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState<ContactFormData>({
        fullName: '',
        email: '',
        phone: '',
        estimatedArrivalTime: '2:00 PM'
    });
    const [formErrors, setFormErrors] = useState<Partial<ContactFormData>>({});

    // Keep internal dates in sync with external if they change outside
    useEffect(() => {
        setCheckIn(externalDates.checkIn);
        setCheckOut(externalDates.checkOut);
    }, [externalDates]);

    // Auto-deselect if the selected room becomes unavailable (e.g. real-time update)
    // Auto-deselect if the selected room becomes unavailable (e.g. real-time update)
    // Auto-deselect if the selected room becomes unavailable (e.g. real-time update)
    useEffect(() => {
        // If we just successfully booked this room, don't alert that it's occupied (by us!)
        if (showSuccess || isSubmitting) return;

        if (selectedRoom) {
            const status = getRoomStatus(selectedRoom);
            if (status !== 'available') {
                setSelectedRoom(null);

                // Determine message based on why it's not available
                const resource = resources.find(r => {
                    const num = parseInt(r.name.replace(/\D/g, '')) || 0;
                    return num === selectedRoom;
                });
                const isOccupied = resource && occupiedIds.includes(resource.id);

                toast.error(
                    isOccupied
                        ? '¡Lo sentimos! Esta habitación acaba de ser reservada por otro usuario.'
                        : 'Esta habitación ya no está disponible temporalmente.',
                    {
                        duration: 4000,
                        id: 'availability-toast'
                    }
                );
            }
        }
    }, [occupiedIds, resources, selectedRoom, showSuccess, isSubmitting]); // Re-check when occupiedIds change

    // Availability Logic based on props
    const getRoomStatus = (roomNumber: number): 'available' | 'occupied' | 'maintenance' => {
        const resource = resources.find(r => {
            const num = parseInt(r.name.replace(/\D/g, '')) || 0;
            return num === roomNumber;
        });

        if (!resource || resource.status !== 'AVAILABLE') return 'maintenance';
        if (occupiedIds.includes(resource.id)) return 'occupied';
        return 'available';
    };



    // Rate Calculation
    const calculateNights = (start: string | null, end: string | null) => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffTime = endDate.getTime() - startDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    const nights = calculateNights(checkIn, checkOut);

    const getNightlyRate = () => {
        if (!selectedRoom) return 250;
        const resource = resources.find(r => {
            const num = parseInt(r.name.replace(/\D/g, '')) || 0;
            return num === selectedRoom;
        });
        return (resource?.category as any)?.basePrice || 250;
    };

    const TOTAL_NIGHTLY_RATE = getNightlyRate();
    const totalStayCost = (TOTAL_NIGHTLY_RATE * nights) + roomCleanFee;

    const handleDateChange = (start: string, end: string | null) => {
        setCheckIn(start);
        setCheckOut(end);
        onDateChange(start, end);
        setSelectedRoom(null); // Reset selection when date changes
    };

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

        if (!formData.estimatedArrivalTime) {
            errors.estimatedArrivalTime = 'Seleccione hora de llegada';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !selectedRoom || !checkIn || !checkOut) return;

        setIsSubmitting(true);

        try {
            const resource = resources.find(r => {
                const resourceNumber = parseInt(r.name.replace(/\D/g, '')) || 0;
                return resourceNumber === selectedRoom;
            });
            if (!resource) throw new Error('Habitación no encontrada. ID: ' + selectedRoom);

            await createBooking({
                resourceId: resource.id,
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                startDate: new Date(checkIn + 'T14:00:00').toISOString(),
                endDate: new Date(checkOut + 'T11:00:00').toISOString(),
                estimatedArrivalTime: formData.estimatedArrivalTime,
                notes: 'Reserva desde web (Hotel)',
                status: 'PENDING'
            });

            if (onSuccess) onSuccess();

            setIsSubmitting(false);
            setShowSuccess(true);

            // Reset after 3 seconds
            setTimeout(() => {
                setShowContactForm(false);
                setShowSuccess(false);
                setFormData({ fullName: '', email: '', phone: '', estimatedArrivalTime: '2:00 PM' });
                setFormErrors({});
                setSelectedRoom(null);
            }, 3000);
        } catch (err: any) {
            console.error('Booking failed:', err);
            alert(err.message || 'Error al procesar la reserva');
            setIsSubmitting(false);
        }
    };

    const handleReserveClick = () => {
        if (!selectedRoom || !checkIn || !checkOut) return;
        setShowContactForm(true);
    };

    return (
        <div className="bg-white lg:p-10 rounded-none lg:rounded-3xl shadow-none lg:shadow-xl border-none lg:border lg:border-slate-100 font-principal sticky top-24">
            <AnimatePresence mode="wait">
                {showContactForm ? (
                    <motion.div
                        key="contact-form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6 mx-4"
                    >
                        {showSuccess ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check size={32} className="text-green-600" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-2">¡Reserva Confirmada!</h3>
                                <p className="text-slate-600 text-sm">Nos pondremos en contacto contigo pronto.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900">Completar Reserva</h3>
                                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Bungalow #{selectedRoom}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowContactForm(false)}
                                        className="text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Check-in/Check-out Info */}
                                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <IconClock size={16} className="text-slate-400" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Check-in</span>
                                        </div>
                                        <span className="text-sm font-black text-slate-900">2:00 PM</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 border-dashed">
                                        <div className="flex items-center gap-2">
                                            <IconClock size={16} className="text-slate-400" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Check-out</span>
                                        </div>
                                        <span className="text-sm font-black text-slate-900">11:00 AM</span>
                                    </div>
                                </div>

                                {/* Important Notice */}
                                <div className="bg-amber-50 border-2 border-dashed border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                                    <IconAlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-[10px] font-bold text-amber-900 uppercase tracking-widest mb-1">Aviso Importante</p>
                                        <p className="text-xs text-amber-700 leading-relaxed font-medium">Si no llega dentro de 1 hora de su hora estimada, su reserva será liberada automáticamente.</p>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
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

                                    {/* Estimated Arrival Time */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-widest mb-2">
                                            <Clock size={12} className="inline mr-1" />
                                            Hora Estimada de Llegada
                                        </label>
                                        <select
                                            value={formData.estimatedArrivalTime}
                                            onChange={(e) => setFormData({ ...formData, estimatedArrivalTime: e.target.value })}
                                            className={`w-full bg-slate-50 border ${formErrors.estimatedArrivalTime ? 'border-red-300' : 'border-slate-200'} rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09C9CB] focus:border-transparent font-medium`}
                                        >
                                            {ARRIVAL_TIMES.map(time => (
                                                <option key={time} value={time}>{time}</option>
                                            ))}
                                        </select>
                                        {formErrors.estimatedArrivalTime && (
                                            <p className="text-xs text-red-500 mt-1">{formErrors.estimatedArrivalTime}</p>
                                        )}
                                    </div>

                                    {/* Booking Summary */}
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Resumen de Reserva</p>
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Bungalow:</span>
                                                <span className="font-bold text-slate-900">#{selectedRoom}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Check-in:</span>
                                                <span className="font-bold text-slate-900">{checkIn}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Check-out:</span>
                                                <span className="font-bold text-slate-900">{checkOut}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-600">Noches:</span>
                                                <span className="font-bold text-slate-900">{nights}</span>
                                            </div>
                                            <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                                                <span className="text-slate-600">Total Estancia:</span>
                                                <span className="font-black text-slate-900 text-lg">${totalStayCost.toLocaleString()}</span>
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
                            </>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="booking-selection"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-8 mx-4"
                    >
                        {/* Calendar Section */}
                        <div className="border-b border-slate-50 pb-8 relative">
                            <label className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-6 block">Seleccionar Fechas</label>
                            <HotelCalendarSelector
                                startDate={checkIn}
                                endDate={checkOut}
                                onChange={handleDateChange}
                            />
                            {/* Loading Indicator Overlay or Text */}
                            {(!checkIn || !checkOut) && (
                                <p className="text-[10px] text-slate-400 mt-2 text-center animate-pulse">
                                    Selecciona tu fecha de llegada y salida
                                </p>
                            )}
                            {isLoading && (
                                <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600 bg-emerald-50 py-2 px-4 rounded-full w-fit mx-auto">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Consultando disponibilidad...</span>
                                </div>
                            )}
                        </div>

                        {/* Room Selection Grid */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-900 uppercase tracking-widest block">SELECCIONAR HABITACIÓN</label>
                            </div>

                            <div className="grid grid-cols-6 gap-2 opacity-100 transition-opacity duration-300">
                                {resources
                                    .filter(r => {
                                        return r.status === 'AVAILABLE';
                                    })
                                    .sort((a, b) => {
                                        const numA = parseInt(a.name.replace(/\D/g, '')) || 0;
                                        const numB = parseInt(b.name.replace(/\D/g, '')) || 0;
                                        return numA - numB;
                                    })
                                    .map((resource) => {
                                        const isOccupied = occupiedIds.includes(resource.id);
                                        const isAvailable = !isOccupied;
                                        // Extract number for display
                                        const displayNum = resource.name.replace(/\D/g, '') || resource.name;

                                        // Filter if dates selected and not available
                                        if (checkIn && checkOut && !isAvailable) return null;

                                        // We use the room number (as number) for selectedRoom state to minimize breaking changes elsewhere
                                        // But ideally we should use ID. For now, let's parseint.
                                        const roomNum = parseInt(displayNum);

                                        const areDatesSelected = !!(checkIn && checkOut);

                                        return (
                                            <button
                                                key={resource.id}
                                                disabled={!isAvailable || !areDatesSelected}
                                                onClick={() => setSelectedRoom(roomNum)}
                                                className={`
                                                h-10 w-full rounded-xl text-xs font-black flex items-center justify-center transition-all border
                                                ${!areDatesSelected
                                                        ? 'bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed'
                                                        : selectedRoom === roomNum
                                                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-xl scale-110 z-10'
                                                            : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-white hover:border-zinc-400 hover:shadow-md hover:scale-105 shadow-sm active:scale-95'
                                                    }
                                            `}
                                            >
                                                {displayNum}
                                            </button>
                                        );
                                    })}
                            </div>
                            {/* Empty State if no rooms available */}
                            {resources.filter(r => !occupiedIds.includes(r.id)).length === 0 && checkIn && checkOut && !isLoading && (
                                <div className="text-center py-8 bg-red-50 rounded-xl border border-red-100">
                                    <p className="text-red-800 font-bold text-xs uppercase tracking-wider">No hay disponibilidad</p>
                                    <p className="text-[10px] text-red-600 mt-1">Intenta con otras fechas</p>
                                </div>
                            )}
                        </div>

                        {/* Selection Details */}
                        <div className="space-y-6">
                            {selectedRoom ? (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    {/* Compact Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="pr-8">
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Tu Selección</p>
                                            <h3 className="text-xl font-black text-slate-900 font-principal leading-tight">Bungalow #{selectedRoom}</h3>
                                        </div>
                                        <button
                                            onClick={() => setSelectedRoom(null)}
                                            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all p-2 rounded-full -mt-2 -mr-2"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>

                                    {/* Compact Details Row */}
                                    <div className="border-t border-b border-slate-100 py-4 mb-6 flex justify-between items-center">
                                        <div className="flex flex-col gap-1 text-slate-600 font-bold text-sm">
                                            <div className="flex items-center gap-2">
                                                <IconCalendar size={16} className="text-[#09C9CB]" />
                                                <span>
                                                    {checkIn ? checkIn : '...'} - {checkOut ? checkOut : '...'}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 pl-6 uppercase tracking-wider">
                                                {checkOut ? `${nights} Noches` : 'Selecciona salida'}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-slate-900 font-black text-xl">${totalStayCost.toLocaleString()} MXN</span>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <button
                                        onClick={handleReserveClick}
                                        disabled={!checkIn || !checkOut}
                                        className="w-full bg-[#09C9CB] text-white py-4 rounded-xl font-black text-xs hover:brightness-110 transition-all shadow-lg shadow-[#09C9CB]/20 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {!checkIn ? 'Selecciona una fecha de llegada' :
                                            !checkOut ? 'Selecciona una fecha de salida' :
                                                'Reservar Ahora'}
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-8 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100 px-6 animate-in fade-in duration-300">
                                    <p className="text-slate-400 font-bold text-xs mb-1 uppercase tracking-wider">Sin selección</p>
                                    <p className="text-[10px] text-slate-300">Selecciona un Bungalow para continuar</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BookingCard;
