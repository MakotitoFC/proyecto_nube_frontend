'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import CalendarSelector from '@/components/home/CalendarSelector';
import { X, User, Phone, Calendar, Mail, FileText, LayoutDashboard, BadgeCheck } from '../ui/Icons';
import { createAdminBooking, updateBooking, CreateBookingData } from '@/services/bookingService';
import { Resource as BackendResource } from '@/services/resourceService';
import { toast } from 'sonner';

interface ReservationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    resources?: BackendResource[];
    resourceId?: string;
    resourceName?: string;
    selectedDate?: string; // ISO format
    isRange?: boolean;
    editingBooking?: any; // The whole booking object if editing
    existingBookings?: any[]; // List of all current bookings for conflict checking
}

// Helper to extract YYYY-MM-DD from any date string source, respecting Local Time
const getYYYYMMDD = (dateInput: string | Date | undefined): string => {
    if (!dateInput) return '';

    // If it's a simple YYYY-MM-DD string (no time), returns it as is.
    if (typeof dateInput === 'string' && !dateInput.includes('T')) {
        return dateInput;
    }

    // If it's an ISO string (has T) or a Date object, parse it to Local Time.
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

export const ReservationModal: React.FC<ReservationModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    resources = [],
    resourceId = '',
    resourceName = '',
    selectedDate = '',
    isRange = true,
    editingBooking = null,
    existingBookings = []
}) => {
    const [formData, setFormData] = useState<Partial<CreateBookingData>>({
        resourceId: '',
        fullName: '',
        email: '',
        phone: '',
        startDate: '',
        endDate: '',
        notes: '',
        estimatedArrivalTime: '12:00',
        status: 'CONFIRMED'
    });
    const [guestCount, setGuestCount] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isStartDateOpen, setIsStartDateOpen] = useState(false);
    const [isEndDateOpen, setIsEndDateOpen] = useState(false);
    const [startPopoverDir, setStartPopoverDir] = useState<'down' | 'up'>('down');
    const [endPopoverDir, setEndPopoverDir] = useState<'down' | 'up'>('down');

    const toggleStartDate = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setStartPopoverDir(spaceBelow < 400 ? 'up' : 'down');
        setIsStartDateOpen(!isStartDateOpen);
    };

    const toggleEndDate = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        setEndPopoverDir(spaceBelow < 400 ? 'up' : 'down');
        setIsEndDateOpen(!isEndDateOpen);
    };
    const { data: session } = useSession();
    const token = (session?.user as any)?.accessToken || '';

    const currentSessionName = (session?.user as any)?.fullName || session?.user?.name || 'Empleado';

    // Determine the exact employee name to show for attribution
    const employeeName = React.useMemo(() => {
        if (editingBooking) {
            if (editingBooking.user && editingBooking.user.fullName) {
                return editingBooking.user.fullName;
            } else {
                return 'Cliente Web (Público)';
            }
        }
        return currentSessionName;
    }, [editingBooking, currentSessionName]);

    // Filter resources that are available (not in maintenance)
    const availableResources = React.useMemo(() => resources.filter(r => r.status !== 'MAINTENANCE'), [resources]);

    // Track whether we've initialized the form to prevent overwriting user input on background polling
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (isOpen && !isInitialized) {
            if (editingBooking) {
                setFormData({
                    resourceId: editingBooking.resourceId,
                    fullName: editingBooking.fullName,
                    email: editingBooking.email,
                    phone: editingBooking.phone || '',
                    startDate: getYYYYMMDD(editingBooking.startDate),
                    endDate: getYYYYMMDD(editingBooking.endDate),
                    notes: editingBooking.notes || '',
                    estimatedArrivalTime: editingBooking.estimatedArrivalTime || '12:00',
                    status: editingBooking.status
                });
                setGuestCount(editingBooking.guestCount || 1);
            } else {
                const todayISO = new Date().toISOString().split('T')[0];
                const initialDate = selectedDate ? getYYYYMMDD(selectedDate) : todayISO;

                const defaultResource = resourceId || (availableResources.length > 0 ? availableResources[0].id : '');

                setFormData({
                    resourceId: defaultResource,
                    fullName: '',
                    email: '',
                    phone: '',
                    startDate: initialDate,
                    endDate: initialDate,
                    notes: '',
                    estimatedArrivalTime: '12:00',
                    status: 'CONFIRMED'
                });
                setGuestCount(1);
            }
            setIsInitialized(true);
        } else if (!isOpen) {
            // Reset initialization tracker when modal closes
            setIsInitialized(false);
        }
    }, [isOpen, resourceId, selectedDate, editingBooking, availableResources, isInitialized]);

    // Determine if the form should be in "Read Only" mode (except status/notes)
    // This happens if we are editing an existing booking that IS CANCELLED.
    // We check editingBooking?.status because we want this to persist even if the user changes the status dropdown to PENDING.
    const isReadOnly = editingBooking?.status === 'CANCELLED';

    const selectedResourceObj = availableResources.find(r => r.id === formData.resourceId);
    const maxCapacity = (selectedResourceObj?.category as any)?.maxCapacity || 4;
    const basePrice = (selectedResourceObj?.category as any)?.basePrice || 100;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Normalize dates to ISO strings at 12:00 PM Local Time to avoid timezone shifts
            const toSafeISO = (dateStr: string) => {
                if (!dateStr) return '';
                const date = new Date(`${dateStr}T12:00:00`);
                return date.toISOString();
            };

            // Conflict Detection
            // We check only if we are NOT cancelling (i.e. creating or updating to active)
            const isCancelling = formData.status === 'CANCELLED';
            if (!isCancelling && existingBookings.length > 0) {
                // Convert form dates to YYYY-MM-DD strings for strict comparison
                const startStr = getYYYYMMDD(formData.startDate);
                const endStr = getYYYYMMDD(isRange ? formData.endDate : formData.startDate);
                const resId = formData.resourceId;

                const hasConflict = existingBookings.some(b => {
                    // Skip self (if editing)
                    if (editingBooking && b.id === editingBooking.id) return false;
                    // Skip cancelled bookings (double check, though filtered list should assume this)
                    if (b.status === 'CANCELLED') return false;
                    // Skip different resource
                    if (b.resourceId !== resId) return false;

                    // Check overlap using YYYY-MM-DD strings
                    const bStartStr = getYYYYMMDD(b.startDate);
                    const bEndStr = getYYYYMMDD(b.endDate);

                    // String comparison works for YYYY-MM-DD
                    // Overlap: StartA <= EndB AND EndA >= StartB
                    return startStr <= bEndStr && endStr >= bStartStr;
                });

                if (hasConflict) {
                    toast.error('¡Conflicto de fechas! Ya existe una reserva en este recurso para las fechas seleccionadas.');
                    setIsSubmitting(false);
                    return;
                }
            }

            const finalData = {
                ...formData,
                startDate: toSafeISO(formData.startDate || ''),
                endDate: toSafeISO(isRange ? (formData.endDate || '') : (formData.startDate || '')),
                email: formData.email || '',
                phone: formData.phone || '',
                guestCount: !isRange ? guestCount : undefined,
                estimatedArrivalTime: formData.estimatedArrivalTime || '12:00',
                status: formData.status || 'CONFIRMED'
            } as CreateBookingData;

            if (editingBooking) {
                await updateBooking(token, editingBooking.id, finalData);
                toast.success('Reserva actualizada con éxito');
            } else {
                await createAdminBooking(token, finalData);
                toast.success('Reserva creada con éxito');
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error saving booking:', error);
            toast.error(error.message || 'Error al guardar la reserva');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-100 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="bg-white rounded-[32px] md:rounded-[40px] p-5 md:p-7 w-full max-w-3xl shadow-2xl relative flex flex-col max-h-[95vh] md:max-h-[90vh] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Background Decor */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#09C9CB]/5 rounded-full -mr-16 -mt-16 blur-3xl" />

                        <div className="flex justify-between items-center mb-4 md:mb-8 relative">
                            <div>
                                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
                                    {editingBooking ? 'Editar Reserva' : 'Nueva Reserva'}
                                </h2>
                                <p className="text-[#09C9CB] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-0.5 md:mt-1">
                                    {resourceName} • {formData.startDate}
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 md:p-3 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto pr-1 md:pr-2 custom-scrollbar flex-1 pb-4">
                            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4 relative">
                                {/* Resource Selection */}
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                        <LayoutDashboard size={12} className="text-[#09C9CB]" />
                                        Recurso / Espacio
                                    </label>
                                    {availableResources.length > 0 ? (
                                        <select
                                            name="resourceId"
                                            value={formData.resourceId}
                                            onChange={(e) => {
                                                const newId = e.target.value;
                                                setFormData(prev => ({ ...prev, resourceId: newId }));
                                                // Reset guest count when changing resource if not editing
                                                if (!editingBooking) {
                                                    setGuestCount(1);
                                                }
                                            }}
                                            disabled={isReadOnly}
                                            className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 md:px-5 py-2.5 md:py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09C9CB]/20 focus:border-[#09C9CB] focus:bg-white transition-all font-medium appearance-none hover:bg-slate-100/50 active:bg-slate-100 active:scale-[0.99] ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                                        >
                                            {availableResources.map(r => (
                                                <option key={r.id} value={r.id}>{r.name} - {(r.category as any)?.name || 'Unidad'}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm text-slate-900 font-medium">
                                            {resourceName || 'Cargando recurso...'}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#09C9CB] shadow-sm shrink-0">
                                        <BadgeCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Atendido por:</p>
                                        <p className="text-sm font-black text-slate-900">{employeeName}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Full Name */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                            <User size={12} className="text-[#09C9CB]" />
                                            Nombre Completo
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                            placeholder="Ej. Juan Pérez"
                                            disabled={isReadOnly}
                                            className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 md:px-5 py-2.5 md:py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#09C9CB]/20 focus:border-[#09C9CB] focus:bg-white transition-all font-medium hover:bg-slate-100/50 active:bg-slate-100 active:scale-[0.99] ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                            <Mail size={12} className="text-[#09C9CB]" />
                                            Correo (Opcional)
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Ej. juan@correo.com"
                                            disabled={isReadOnly}
                                            className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 md:px-5 py-2.5 md:py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#09C9CB]/20 focus:border-[#09C9CB] focus:bg-white transition-all font-medium hover:bg-slate-100/50 active:bg-slate-100 active:scale-[0.99] ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Phone */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                            <Phone size={12} className="text-[#09C9CB]" />
                                            Teléfono (Opcional)
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Ej. 2291234567"
                                            disabled={isReadOnly}
                                            className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 md:px-5 py-2.5 md:py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#09C9CB]/20 focus:border-[#09C9CB] focus:bg-white transition-all font-medium hover:bg-slate-100/50 active:bg-slate-100 active:scale-[0.99] ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                                        />
                                    </div>

                                    {/* Status Selection */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                            <div className={`w-2 h-2 rounded-full ${formData.status === 'CONFIRMED' ? 'bg-emerald-500' : formData.status === 'CANCELLED' ? 'bg-red-500' : 'bg-[#09C9CB]'}`} />
                                            Estado de la Reserva
                                        </label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 md:px-5 py-2.5 md:py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09C9CB]/20 focus:border-[#09C9CB] focus:bg-white transition-all font-medium appearance-none hover:bg-slate-100/50 active:bg-slate-100 active:scale-[0.99]"
                                        >
                                            <option value="PENDING">PENDIENTE</option>
                                            <option value="CONFIRMED">CONFIRMADO</option>
                                            <option value="CANCELLED">CANCELADO</option>
                                        </select>
                                    </div>
                                </div>

                                {isRange ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Start Date */}
                                        <div className="space-y-1.5 relative">
                                            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                                <Calendar size={12} className="text-[#09C9CB]" />
                                                Fecha Inicio
                                            </label>
                                            <button
                                                type="button"
                                                onClick={toggleStartDate}
                                                disabled={isReadOnly}
                                                className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 md:px-5 py-2.5 md:py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09C9CB]/20 focus:border-[#09C9CB] focus:bg-white transition-all font-medium flex items-center justify-between hover:bg-slate-100/50 active:bg-slate-100 active:scale-[0.99] ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                                            >
                                                <span>
                                                    {formData.startDate ? new Date(formData.startDate + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Seleccionar...'}
                                                </span>
                                                <Calendar size={14} className="text-[#09C9CB]" />
                                            </button>

                                            <AnimatePresence>
                                                {isStartDateOpen && (
                                                    <>
                                                        <motion.div 
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            onClick={() => setIsStartDateOpen(false)}
                                                            className="fixed inset-0 z-40"
                                                        />
                                                        <motion.div
                                                            initial={{ opacity: 0, y: startPopoverDir === 'down' ? 10 : -10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: startPopoverDir === 'down' ? 10 : -10, scale: 0.95 }}
                                                            className={`absolute ${startPopoverDir === 'down' ? 'top-full mt-2' : 'bottom-full mb-2'} left-0 right-0 md:right-auto md:w-[320px] z-50 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden p-4 ${startPopoverDir === 'down' ? 'origin-top' : 'origin-bottom'}`}
                                                        >
                                                            <CalendarSelector
                                                                mode="single"
                                                                variant="minimal"
                                                                selectedDate={formData.startDate}
                                                                onSelect={(date) => {
                                                                    setFormData(prev => ({ ...prev, startDate: date }));
                                                                    setIsStartDateOpen(false);
                                                                }}
                                                            />
                                                        </motion.div>
                                                    </>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* End Date */}
                                        <div className="space-y-1.5 relative">
                                            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                                <Calendar size={12} className="text-[#09C9CB]" />
                                                Fecha Fin
                                            </label>
                                            <button
                                                type="button"
                                                onClick={toggleEndDate}
                                                disabled={isReadOnly}
                                                className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 md:px-5 py-2.5 md:py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09C9CB]/20 focus:border-[#09C9CB] focus:bg-white transition-all font-medium flex items-center justify-between hover:bg-slate-100/50 active:bg-slate-100 active:scale-[0.99] ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                                            >
                                                <span>
                                                    {formData.endDate ? new Date(formData.endDate + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Seleccionar...'}
                                                </span>
                                                <Calendar size={14} className="text-[#09C9CB]" />
                                            </button>

                                            <AnimatePresence>
                                                {isEndDateOpen && (
                                                    <>
                                                        <motion.div 
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            onClick={() => setIsEndDateOpen(false)}
                                                            className="fixed inset-0 z-40"
                                                        />
                                                        <motion.div
                                                            initial={{ opacity: 0, y: endPopoverDir === 'down' ? 10 : -10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: endPopoverDir === 'down' ? 10 : -10, scale: 0.95 }}
                                                            className={`absolute ${endPopoverDir === 'down' ? 'top-full mt-2' : 'bottom-full mb-2'} left-0 right-0 md:left-auto md:right-0 md:w-[320px] z-50 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden p-4 ${endPopoverDir === 'down' ? 'origin-top' : 'origin-bottom'}`}
                                                        >
                                                            <CalendarSelector
                                                                mode="single"
                                                                variant="minimal"
                                                                selectedDate={formData.endDate}
                                                                onSelect={(date) => {
                                                                    setFormData(prev => ({ ...prev, endDate: date }));
                                                                    setIsEndDateOpen(false);
                                                                }}
                                                            />
                                                        </motion.div>
                                                    </>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Date selector */}
                                        <div className="space-y-1.5 relative">
                                            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                                <Calendar size={12} className="text-[#09C9CB]" />
                                                Fecha Reserva
                                            </label>
                                            <button
                                                type="button"
                                                onClick={toggleStartDate}
                                                disabled={isReadOnly}
                                                className={`w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 md:px-5 py-2.5 md:py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09C9CB]/20 focus:border-[#09C9CB] focus:bg-white transition-all font-medium flex items-center justify-between hover:bg-slate-100/50 active:bg-slate-100 active:scale-[0.99] ${isReadOnly ? 'opacity-60 cursor-not-allowed' : ''}`}
                                            >
                                                <span>
                                                    {formData.startDate ? new Date(formData.startDate + 'T12:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'Seleccionar...'}
                                                </span>
                                                <Calendar size={14} className="text-[#09C9CB]" />
                                            </button>

                                            <AnimatePresence>
                                                {isStartDateOpen && (
                                                    <>
                                                        <motion.div 
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            onClick={() => setIsStartDateOpen(false)}
                                                            className="fixed inset-0 z-40"
                                                        />
                                                        <motion.div
                                                            initial={{ opacity: 0, y: startPopoverDir === 'down' ? 10 : -10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: startPopoverDir === 'down' ? 10 : -10, scale: 0.95 }}
                                                            className={`absolute ${startPopoverDir === 'down' ? 'top-full mt-2' : 'bottom-full mb-2'} left-0 right-0 md:right-auto md:w-[320px] z-50 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden p-4 ${startPopoverDir === 'down' ? 'origin-top' : 'origin-bottom'}`}
                                                        >
                                                            <CalendarSelector
                                                                mode="single"
                                                                variant="minimal"
                                                                selectedDate={formData.startDate}
                                                                onSelect={(date) => {
                                                                    setFormData(prev => ({ ...prev, startDate: date }));
                                                                    setIsStartDateOpen(false);
                                                                }}
                                                            />
                                                        </motion.div>
                                                    </>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Guest counter */}
                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                                <User size={12} className="text-[#09C9CB]" />
                                                N° Personas
                                            </label>
                                            <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-1.5 w-full">
                                                <button
                                                    type="button"
                                                    disabled={isReadOnly || guestCount <= 1}
                                                    onClick={() => setGuestCount(prev => Math.max(1, prev - 1))}
                                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors text-slate-600 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    -
                                                </button>
                                                <span className="flex-1 text-center font-black text-slate-900 text-lg">
                                                    {guestCount}
                                                </span>
                                                <button
                                                    type="button"
                                                    disabled={isReadOnly || guestCount >= maxCapacity}
                                                    onClick={() => setGuestCount(prev => Math.min(maxCapacity, prev + 1))}
                                                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors text-[#09C9CB] font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total Price */}
                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                                Total Estimado
                                            </label>
                                            <div className="flex items-center h-[52px] px-5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 font-black text-xl">
                                                ${(guestCount * basePrice).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                )}


                                {/* Notes */}
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                                        <FileText size={12} className="text-[#09C9CB]" />
                                        Notas / Requerimientos Especiales
                                    </label>
                                    <textarea
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Información adicional sobre la reserva..."
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 md:px-5 py-2.5 md:py-3 text-sm text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#09C9CB]/20 focus:border-[#09C9CB] focus:bg-white transition-all font-medium resize-none hover:bg-slate-100/50 active:bg-slate-100 active:scale-[0.99]"
                                    />
                                </div>

                                <div className="pt-1 md:pt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-slate-900 text-white font-bold uppercase tracking-[0.2em] text-[9px] md:text-[10px] py-3.5 md:py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Procesando...
                                            </>
                                        ) : (
                                            editingBooking ? 'Guardar Cambios' : 'Confirmar Reserva'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
