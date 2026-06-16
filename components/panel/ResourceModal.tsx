'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from '../ui/Icons';

import { ResourceCategory } from '@/services/resourceService';

interface ResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ResourceFormData, id?: string) => Promise<void>;
    resourceType: 'BEACH_CLUB' | 'HOTEL';
    editingResource?: ResourceFormData & { id: string };
    existingResources?: any[]; // Pass existing resources for auto-naming
    categories: ResourceCategory[];
}

export interface ResourceFormData {
    name: string;
    type: 'BEACH_CLUB' | 'HOTEL';
    categoryId: string;
    status: 'AVAILABLE' | 'MAINTENANCE';
}

export const ResourceModal: React.FC<ResourceModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    resourceType,
    editingResource,
    existingResources = [],
    categories = []
}) => {
    const [formData, setFormData] = useState<ResourceFormData>({
        name: '',
        type: resourceType,
        categoryId: categories.length > 0 ? categories[0].id : '',
        status: 'AVAILABLE'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Helper to generate next name
    const generateNextName = (categoryId: string) => {
        const cat = categories.find(c => c.id === categoryId);
        const categoryName = cat ? cat.name : '';

        if (!existingResources || existingResources.length === 0) {
            // Defaults if no resources exist
            if (categoryName === 'Palapas') return 'P1';
            if (categoryName === 'Lounge') return 'L1';
            if (categoryName === 'Alberca') return 'A1';
            if (categoryName === 'Bungalow') return 'B1';
            if (categoryName === 'Habitaciones') return 'H1';
            if (categoryName === 'Suite') return 'S1';
            return categoryName ? `${categoryName.charAt(0).toUpperCase()}1` : '';
        }

        const categoryResources = existingResources.filter((r: any) => r.categoryId === categoryId);

        if (categoryResources.length === 0) {
            if (categoryName === 'Palapas') return 'P1';
            if (categoryName === 'Lounge') return 'L1';
            if (categoryName === 'Alberca') return 'A1';
            if (categoryName === 'Bungalow') return 'B1';
            if (categoryName === 'Habitación' || categoryName === 'Habitaciones') return 'H1';
            if (categoryName === 'Suite') return 'S1';
            return categoryName ? `${categoryName.charAt(0).toUpperCase()}1` : '';
        }

        let maxNum = 0;
        let prefix = '';

        // Extract numbers and find max
        for (const res of categoryResources) {
            // Match "P19", "P-19", "Palapa 19" -> Prefix (Group 1), Number (Group 2)
            const match = res.name.match(/^([^\d]*)(\d+)$/);
            if (match) {
                const currentPrefix = match[1]; // e.g. "P"
                const currentNum = parseInt(match[2], 10);

                if (currentNum > maxNum) {
                    maxNum = currentNum;
                    prefix = currentPrefix;
                }
            }
        }

        if (maxNum > 0) {
            return `${prefix}${maxNum + 1}`;
        }

        return ''; // Could not determine pattern
    };

    // Pre-populate form when editing
    useEffect(() => {
        if (editingResource) {
            setFormData({
                name: editingResource.name,
                type: editingResource.type,
                categoryId: editingResource.categoryId,
                status: editingResource.status
            });
        } else {
            // Reset form when not editing
            setFormData(prev => ({
                ...prev,
                name: '',
                type: resourceType,
                categoryId: categories.length > 0 ? categories[0].id : '',
                status: 'AVAILABLE'
            }));
        }
    }, [editingResource, resourceType, categories]);

    // Auto-name when category changes (Only in Create Mode)
    useEffect(() => {
        if (!editingResource && isOpen) {
            const nextName = generateNextName(formData.categoryId);
            if (nextName) {
                setFormData(prev => ({ ...prev, name: nextName }));
            }
        }
    }, [formData.categoryId, editingResource, isOpen, existingResources, categories]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData, editingResource?.id);
            onClose();
        } catch (error) {
            console.error('Error submitting resource:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
                                {editingResource ? 'Editar Recurso' : 'Nuevo Recurso'}
                            </h2>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                                    Nombre
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={true} // Auto-generated
                                        required
                                        placeholder="Ej. Palapa P1"
                                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-500 placeholder:text-slate-400 focus:outline-none cursor-not-allowed font-medium"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1.5 font-bold uppercase tracking-wide flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                        Generado automáticamente
                                    </p>
                                </div>
                            </div>

                            {/* Category - Now always show to select ResourceCategory */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                                    Categoría
                                </label>
                                <select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09C9CB] focus:border-transparent font-medium"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name} ({cat.minCapacity === cat.maxCapacity ? `${cat.maxCapacity} pers.` : `${cat.minCapacity}-${cat.maxCapacity} pers.`})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                                    Estado (Configuración)
                                </label>
                                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                                    {[
                                        { value: 'AVAILABLE', label: 'Habilitado' },
                                        { value: 'MAINTENANCE', label: 'Deshabilitado' }
                                    ].map((status) => (
                                        <button
                                            key={status.value}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, status: status.value as any }))}
                                            className={`flex-1 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${formData.status === status.value
                                                ? (status.value === 'AVAILABLE' ? 'bg-emerald-500 text-white shadow-md' : 'bg-red-500 text-white shadow-md')
                                                : 'text-slate-400 hover:text-slate-600'
                                                }`}
                                        >
                                            {status.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#09C9CB] text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-[#09C9CB]/90 transition-all shadow-lg shadow-[#09C9CB]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting
                                        ? (editingResource ? 'Actualizando...' : 'Creando...')
                                        : (editingResource ? 'Actualizar Recurso' : 'Crear Recurso')
                                    }
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
