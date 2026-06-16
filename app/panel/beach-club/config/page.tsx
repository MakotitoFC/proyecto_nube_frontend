'use client';

import React, { useState, useEffect } from 'react';
import { ResourceTableView } from '@/components/panel/ResourceTableView';
import { PageHeader } from '@/components/panel/PageHeader';
import { ResourceModal, ResourceFormData } from '@/components/panel/ResourceModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { CategoryModal } from '@/components/panel/CategoryModal';
import { getBeachClubResources, getResourceCategories, deleteResource, createResource, updateResource, updateResourceCategory, Resource, ResourceCategory } from '@/services/resourceService';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Plus, Edit } from '@/components/ui/Icons'; // Using Edit instead of Settings since it exists in Icons

export default function BeachClubConfigPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<string>('Palapas');
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
                    getBeachClubResources(token),
                    getResourceCategories(token, 'BEACH_CLUB')
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

    // Calculate counts dynamically
    const counts = {
        total: resources.length,
        palapas: resources.filter(r => r.category?.name === 'Palapas').length,
        lounge: resources.filter(r => r.category?.name === 'Lounge').length,
        alberca: resources.filter(r => r.category?.name === 'Alberca').length,
    };

    const tabs = [
        { id: 'Palapas', label: 'Palapas', count: counts.palapas },
        { id: 'Lounge', label: 'Lounge', count: counts.lounge },
        { id: 'Alberca', label: 'Alberca', count: counts.alberca },
    ];

    // Filter resources based on active tab
    const filteredResources = resources.filter(r =>
        (r.category as any)?.name === activeTab ||
        (typeof r.category === 'string' && (r.category as string).toLowerCase().includes(activeTab.toLowerCase()))
    );

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
                loadResources(); // Reloads both resources and categories
            }
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error('Error al actualizar la categoría');
        } finally {
            setIsCategoryModalOpen(false);
            setEditingCategory(null);
        }
    };

    const activeCategory = categories.find(c => c.name === activeTab);

    if (loading) {
        return (
            <div className="space-y-8">
                <PageHeader
                    title="Configuración Beach Club"
                    subtitle="Pelícanos Veracruz | Control de Inventario"
                />
                <div className="flex items-center justify-center py-12">
                    <div className="text-slate-400">Cargando recursos...</div>
                </div>
            </div>
        );
    }

    return (
        <div className=" space-y-8">
            <PageHeader
                title="Configuración Beach Club"
                subtitle="Pelícanos Veracruz | Control de Inventario"
            >
                {isAdmin && (
                    <div className="flex flex-col sm:flex-row gap-3">
                        {activeCategory && (
                            <button
                                onClick={() => {
                                    setEditingCategory(activeCategory);
                                    setIsCategoryModalOpen(true);
                                }}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#09C9CB] border border-[#09C9CB] rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm"
                            >
                                <Edit size={18} />
                                Configurar {activeCategory.name}
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setEditingResource(null);
                                setIsModalOpen(true);
                            }}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#09C9CB] text-white rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-[#08b8ba] transition-all shadow-lg shadow-[#09C9CB]/20"
                        >
                            <Plus size={18} />
                            Crear Recurso
                        </button>
                    </div>
                )}
            </PageHeader>

            {/* Tabs */}
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
                <div className="flex gap-2 bg-white p-2 rounded-3xl border border-slate-200 shadow-sm w-fit whitespace-nowrap">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-[#09C9CB] text-white shadow-lg shadow-[#09C9CB]/20'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            {tab.label}
                            <span className={`ml-2 px-2 py-0.5 rounded-full text-[9px] font-extrabold ${activeTab === tab.id
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-600'
                                }`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <ResourceTableView
                title=""
                subtitle=""
                columns={columns}
                data={filteredResources}
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
                resourceType="BEACH_CLUB"
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
                fixedType="BEACH_CLUB"
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
