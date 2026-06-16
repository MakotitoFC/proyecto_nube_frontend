'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/panel/PageHeader';
import { CategoryModal } from '@/components/panel/CategoryModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { getResourceCategories, createResourceCategory, updateResourceCategory, deleteResourceCategory, ResourceCategory } from '@/services/resourceService';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Plus } from '@/components/ui/Icons';

export default function CategoriasConfigPage() {
    const { data: session } = useSession();
    const [categories, setCategories] = useState<ResourceCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ResourceCategory | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

    const isAdmin = (session?.user as any)?.role === 'ADMIN';

    useEffect(() => {
        if (session?.user) {
            loadCategories();
        }
    }, [session]);

    const loadCategories = async () => {
        if (!session?.user) return;

        try {
            setLoading(true);
            const token = (session.user as any).accessToken;
            if (token) {
                const data = await getResourceCategories(token);
                setCategories(data);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            toast.error('Error al cargar las categorías');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setCategoryToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!session?.user || !categoryToDelete) return;

        try {
            const token = (session.user as any).accessToken;
            if (token) {
                await deleteResourceCategory(token, categoryToDelete);
                toast.success('Categoría eliminada exitosamente');
                loadCategories();
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Error al eliminar la categoría (Verifica que no tenga recursos asignados)');
        } finally {
            setCategoryToDelete(null);
            setIsDeleteModalOpen(false);
        }
    };

    const handleEdit = (category: ResourceCategory) => {
        setEditingCategory(category);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: Omit<ResourceCategory, 'id'>, id?: string) => {
        if (!session?.user) return;

        try {
            const token = (session.user as any).accessToken;
            if (token) {
                if (id) {
                    await updateResourceCategory(token, id, data as Partial<ResourceCategory>);
                    toast.success('Categoría actualizada exitosamente');
                } else {
                    await createResourceCategory(token, data);
                    toast.success('Categoría creada exitosamente');
                }
                loadCategories();
                setEditingCategory(null);
            }
        } catch (error) {
            console.error('Error submitting category:', error);
            toast.error(id ? 'Error al actualizar la categoría' : 'Error al crear la categoría');
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Configuración de Categorías"
                    subtitle="Pelícanos Veracruz | Control de áreas y capacidades"
                />
                <div className="flex items-center justify-center py-12">
                    <div className="text-slate-400">Cargando categorías...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Configuración de Categorías"
                subtitle="Pelícanos Veracruz | Control de áreas y capacidades"
            >
                {isAdmin && (
                    <button
                        onClick={() => {
                            setEditingCategory(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-[#09C9CB] text-white rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#08b8ba] transition-all shadow-lg shadow-[#09C9CB]/20"
                    >
                        <Plus size={18} />
                        Crear Categoría
                    </button>
                )}
            </PageHeader>

            {/* Content Table */}
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="pb-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100">Nombre</th>
                                <th className="pb-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100">Área</th>
                                <th className="pb-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100">Capacidad min/max</th>
                                {isAdmin && (
                                    <th className="pb-4 font-bold text-[10px] text-slate-400 uppercase tracking-widest border-b border-slate-100 flex justify-end">Acciones</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {categories.map((cat, idx) => (
                                <tr key={cat.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                                    <td className="py-4 text-slate-800 font-bold">{cat.name}</td>
                                    <td className="py-4 text-slate-500">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${cat.type === 'BEACH_CLUB' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {cat.type === 'BEACH_CLUB' ? 'Beach Club' : 'Hotel'}
                                        </span>
                                    </td>
                                    <td className="py-4 text-slate-500 font-medium">
                                        {cat.minCapacity} {cat.minCapacity !== cat.maxCapacity ? `- ${cat.maxCapacity}` : ''} personas
                                    </td>
                                    {isAdmin && (
                                        <td className="py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(cat)}
                                                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-[#09C9CB] bg-[#09C9CB]/10 rounded-xl hover:bg-[#09C9CB]/20 transition-colors"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(cat.id)}
                                                    className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {categories.length === 0 && (
                                <tr>
                                    <td colSpan={isAdmin ? 4 : 3} className="py-8 text-center text-slate-400 text-sm">
                                        No hay categorías registradas
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
                }}
                onSubmit={handleSubmit}
                editingCategory={editingCategory}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setCategoryToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Eliminar Categoría"
                message="¿Estás seguro de que deseas eliminar esta categoría? Si hay recursos asignados a esta categoría, recibirás un error."
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
}
