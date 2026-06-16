'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from '../ui/Icons';
import { ResourceCategory } from '@/services/resourceService';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Omit<ResourceCategory, 'id'>, id?: string) => Promise<void>;
    editingCategory?: ResourceCategory | null;
    fixedType?: 'BEACH_CLUB' | 'HOTEL';
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    editingCategory,
    fixedType,
}) => {
    const [formData, setFormData] = useState<Omit<ResourceCategory, 'id'>>({
        name: '',
        minCapacity: 1,
        maxCapacity: 4,
        basePrice: 100,
        type: 'BEACH_CLUB'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingCategory) {
            setFormData({
                name: editingCategory.name,
                minCapacity: editingCategory.minCapacity,
                maxCapacity: editingCategory.maxCapacity,
                basePrice: editingCategory.basePrice || 100,
                type: editingCategory.type,
            });
        } else {
            setFormData({
                name: '',
                minCapacity: 1,
                maxCapacity: 4,
                basePrice: 100,
                type: fixedType || 'BEACH_CLUB'
            });
        }
    }, [editingCategory, isOpen, fixedType]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSubmit(formData, editingCategory?.id);
            onClose();
        } catch (error) {
            console.error('Error submitting category:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name.includes('Capacity') || name === 'basePrice') ? parseInt(value) || 0 : value
        }));
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
                                {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                            </h2>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                                    Nombre (Ej. Palapas)
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={!!editingCategory}
                                    placeholder="Ej. Palapas"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#09C9CB] focus:border-transparent font-medium disabled:opacity-75 disabled:cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                                    Módulo (Área)
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                    disabled={!!fixedType}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09C9CB] focus:border-transparent font-medium disabled:opacity-75 disabled:cursor-not-allowed"
                                >
                                    <option value="BEACH_CLUB">Beach Club</option>
                                    <option value="HOTEL">Hotel</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                                    Precio Base ($)
                                </label>
                                <input
                                    type="number"
                                    name="basePrice"
                                    min="0"
                                    step="50"
                                    value={formData.basePrice}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09C9CB] focus:border-transparent font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                                        Capacidad Min.
                                    </label>
                                    <input
                                        type="number"
                                        name="minCapacity"
                                        min="1"
                                        value={formData.minCapacity}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09C9CB] focus:border-transparent font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                                        Capacidad Max.
                                    </label>
                                    <input
                                        type="number"
                                        name="maxCapacity"
                                        min="1"
                                        value={formData.maxCapacity}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#09C9CB] focus:border-transparent font-medium"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-[#09C9CB] text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-[#09C9CB]/90 transition-all shadow-lg shadow-[#09C9CB]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting
                                        ? (editingCategory ? 'Actualizando...' : 'Creando...')
                                        : (editingCategory ? 'Actualizar Categoría' : 'Crear Categoría')
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
