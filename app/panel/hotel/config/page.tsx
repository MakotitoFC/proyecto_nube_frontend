'use client';

import React, { useState, useEffect } from 'react';
import { ResourceTableView } from '@/components/panel/ResourceTableView';
import { PageHeader } from '@/components/panel/PageHeader';
import { ResourceModal, ResourceFormData } from '@/components/panel/ResourceModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { CategoryModal } from '@/components/panel/CategoryModal';
import { getHotelResources, getResourceCategories, deleteResource, createResource, updateResource, updateResourceCategory, Resource, ResourceCategory } from '@/services/resourceService';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Plus, Edit } from '@/components/ui/Icons';

export default function HotelConfigPage() {
    const { data: session } = useSession();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingResource, setEditingResource] = useState<(Resource) | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);
    const [categories, setCategories] = useState<ResourceCategory[]>([]);

    // Category Modal states
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ResourceCategory | null>(null);

    const isAdmin = (session?.user as any)?.role === 'ADMIN';

    // Fetch resources from backend
    useEffect(() => {
        if (session?.user) {
            loadResources();
        }
    }, [session]);

    const loadResources = async () => {
        if (!session?.user) return;

        try {
            setLoading(true);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token = (session.user as any).accessToken;
            if (token) {
                const [data, categoriesData] = await Promise.all([
                    getHotelResources(token),
                    getResourceCategories(token, 'HOTEL')
                ]);
                setResources(data);
                setCategories(categoriesData);
            }
        } catch (error) {
            console.error('Error loading resources:', error);
            toast.error('Error al cargar los recursos');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            header: 'Recurso',
            key: 'name',
            render: (item: Resource) => (
                <div>
                    <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                    <p className="text-[10px] text-slate-600 uppercase tracking-tighter font-semibold">{item.category?.name}</p>
                </div>
            )
        },
        {
            header: 'Categoría',
            key: 'category.name',
            render: (item: Resource) => (<span className="text-slate-700 font-medium">{item.category?.name}</span>)
        },
        {
            header: 'Capacidad',
            key: 'category.capacity',
            render: (item: Resource) => (
                <span className="text-sm text-slate-700 font-medium">{item.category?.minCapacity === item.category?.maxCapacity ? `${item.category?.maxCapacity} personas` : `${item.category?.minCapacity} - ${item.category?.maxCapacity} personas`}</span>
            )
        },
        {
            header: 'Estado',
            key: 'status',
            render: (item: Resource) => {
                const statusMap = {
                    'AVAILABLE': { label: 'Habilitado', color: 'emerald' },
                    'OCCUPIED': { label: 'Habilitado', color: 'emerald' }, // Functionally available/working
                    'MAINTENANCE': { label: 'Deshabilitado', color: 'red' }
                };
                const status = statusMap[item.status] || statusMap['AVAILABLE'];

                return (
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${status.color}-500`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest text-${status.color}-500`}>
                            {status.label}
                        </span>
                    </div>
                );
            }
        },
    ];

    const handleDeleteClick = (id: string) => {
        setResourceToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!session?.user || !resourceToDelete) return;

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token = (session.user as any).accessToken;
            if (token) {
                await deleteResource(token, resourceToDelete);
                toast.success('Recurso eliminado exitosamente');
                loadResources();
            }
        } catch (error) {
            console.error('Error deleting resource:', error);
            toast.error('Error al eliminar el recurso');
        } finally {
            setResourceToDelete(null);
        }
    };

    const handleEdit = (resource: Resource) => {
        setEditingResource({
            id: resource.id,
            name: resource.name,
            type: resource.type,
            categoryId: resource.categoryId,
            status: resource.status,
        } as any);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: ResourceFormData, id?: string) => {
        if (!session?.user) return;

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token = (session.user as any).accessToken;
            if (token) {
                if (id) {
                    // Update existing resource
                    await updateResource(token, id, data);
                    toast.success('Recurso actualizado exitosamente');
                } else {
                    // Create new resource
                    await createResource(token, data);
                    toast.success('Recurso creado exitosamente');
                }
                loadResources();
                setEditingResource(null);
            }
        } catch (error) {
            console.error('Error submitting resource:', error);
            toast.error(id ? 'Error al actualizar el recurso' : 'Error al crear el recurso');
            throw error;
        }
    };

    const handleCategorySubmit = async (data: Omit<ResourceCategory, 'id'>, id?: string) => {
        if (!session?.user || !id) return;
        try {
            const token = (session.user as any).accessToken;
            if (token) {
                await updateResourceCategory(token, id, data as Partial<ResourceCategory>);
                toast.success('Categoría actualizada exitosamente');
                loadResources();
            }
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error('Error al actualizar la categoría');
        } finally {
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Configuración Hotel"
                    subtitle="Pelícanos Veracruz | Control de Inventario • Habitaciones"
                />
                <div className="flex items-center justify-center py-12">
                    <div className="text-slate-400">Cargando recursos...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-full overflow-hidden">
            <PageHeader
                title="Configuración Hotel"
                subtitle={`Pelícanos Veracruz | Control de Inventario • ${resources.length} Habitaciones`}
            >
                {isAdmin && (
                    <div className="flex flex-row gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2 md:mx-0 md:px-0 w-full md:w-auto">
                        <div className="flex flex-row gap-3 flex-nowrap min-w-max pr-4 md:pr-0">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => {
                                        setEditingCategory(cat);
                                        setIsCategoryModalOpen(true);
                                    }}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#09C9CB] border border-[#09C9CB] rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm whitespace-nowrap min-h-[48px]"
                                >
                                    <Edit size={18} />
                                    {cat.name}
                                </button>
                            ))}
                            <button
                                onClick={() => {
                                    setEditingResource(null);
                                    setIsModalOpen(true);
                                }}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#09C9CB] text-white border border-[#09C9CB] rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#08b8ba] transition-all shadow-lg shadow-[#09C9CB]/20 whitespace-nowrap min-h-[48px]"
                            >
                                <Plus size={18} />
                                Recurso
                            </button>
                        </div>
                    </div>
                )}
            </PageHeader>

            <ResourceTableView
                title=""
                subtitle=""
                columns={columns}
                data={resources}
                onEdit={handleEdit}
                onDelete={isAdmin ? handleDeleteClick : undefined}
            />

            {/* Resource Modal (Create/Edit) */}
            <ResourceModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingResource(null);
                }}
                onSubmit={handleSubmit}
                resourceType="HOTEL"
                editingResource={editingResource || undefined}
                existingResources={resources}
                categories={categories}
            />

            {/* Category Modal (Edit only) */}
            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={() => {
                    setIsCategoryModalOpen(false);
                    setEditingCategory(null);
                }}
                onSubmit={handleCategorySubmit}
                editingCategory={editingCategory || undefined}
                fixedType="HOTEL"
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setResourceToDelete(null);
                }}
                onConfirm={handleDeleteConfirm}
                title="Eliminar Recurso"
                message="¿Estás seguro de que deseas eliminar este recurso? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
            />
        </div>
    );
}
