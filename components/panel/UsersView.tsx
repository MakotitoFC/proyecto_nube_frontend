'use client';

import React, { useState, useEffect } from 'react';
import { User } from '@/types';
import { Plus, X, IconUserCircle, Edit, Trash2, RotateCcw } from '../ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from './PageHeader';
import { useSession } from 'next-auth/react';
import { getUsers, createUser, updateUser } from '@/services/userService';
import { useToast } from '../ui/Toast';
import { ConfirmModal } from '../ui/ConfirmModal';

export const UsersView: React.FC = () => {
    const { data: session } = useSession();
    const { showToast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newUser, setNewUser] = useState({ fullName: '', email: '', password: '', role: 'receptionist', phone: '' });
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [filterStatus, setFilterStatus] = useState<'active' | 'inactive'>('active');

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        user: User | null;
    }>({ isOpen: false, user: null });

    const fetchUsers = async () => {
        if (session?.user) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token = (session.user as any).accessToken;
            if (token) {
                setIsLoadingUsers(true);
                try {
                    const data = await getUsers(token);
                    setUsers(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoadingUsers(false);
                }
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [session]);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user) return;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token = (session.user as any).accessToken;

            if (editingUser) {
                await updateUser(token, editingUser.id, {
                    fullName: newUser.fullName,
                    email: newUser.email,
                    role: newUser.role as any,
                    phone: newUser.phone,
                    password: newUser.password || undefined
                });
                showToast('Usuario actualizado exitosamente', 'success');
            } else {
                await createUser(token, { ...newUser, isActive: true });
                showToast('Usuario creado exitosamente', 'success');
            }

            // Refresh users
            await fetchUsers();
            closeModal();
        } catch (error) {
            console.error(error);
            showToast(editingUser ? 'Error al actualizar usuario' : 'Error al crear usuario', 'error');
        }
    };

    const handleToggleStatus = async (user: User) => {
        setConfirmModal({ isOpen: true, user });
    };

    const confirmToggleStatus = async () => {
        const user = confirmModal.user;
        if (!user || !session?.user) return;

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const token = (session.user as any).accessToken;
            await updateUser(token, user.id, { isActive: !user.isActive });
            showToast(user.isActive ? 'Usuario desactivado' : 'Usuario activado', 'success');
            await fetchUsers();
        } catch (error) {
            console.error(error);
            showToast('Error al cambiar el estado del usuario', 'error');
        }
    };

    const openCreateModal = () => {
        setEditingUser(null);
        setNewUser({ fullName: '', email: '', password: '', role: 'receptionist', phone: '' });
        setIsCreateModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setNewUser({
            fullName: user.name,
            email: user.email,
            password: '',
            role: user.role,
            phone: user.phone || ''
        });
        setIsCreateModalOpen(true);
    };

    const closeModal = () => {
        setIsCreateModalOpen(false);
        setEditingUser(null);
        setNewUser({ fullName: '', email: '', password: '', role: 'receptionist', phone: '' });
    };

    const filteredUsers = users.filter(u => filterStatus === 'active' ? u.isActive : !u.isActive);

    return (
        <div className="">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-10 gap-4 md:gap-6">
                <PageHeader
                    title="Listado de Usuarios"
                    subtitle="Pelícanos Veracruz | Sistema de Control Interno"
                />

                <button
                    onClick={openCreateModal}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#09C9CB] text-white px-6 py-3.5 md:py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#09C9CB]/80 transition-all shadow-lg shadow-[#09C9CB]/20 active:scale-95"
                >
                    <Plus size={18} />
                    Crear Usuario
                </button>
            </header>

            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setFilterStatus('active')}
                    className={`pb-2 px-4 font-bold text-xs uppercase tracking-widest transition-all border-b-2 ${filterStatus === 'active' ? 'border-[#09C9CB] text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                    Activos ({users.filter(u => u.isActive).length})
                </button>
                <button
                    onClick={() => setFilterStatus('inactive')}
                    className={`pb-2 px-4 font-bold text-xs uppercase tracking-widest transition-all border-b-2 ${filterStatus === 'inactive' ? 'border-[#09C9CB] text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                    Inactivos ({users.filter(u => !u.isActive).length})
                </button>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] md:rounded-[40px] shadow-sm border border-slate-200 overflow-hidden"
            >
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="p-4 md:p-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Usuario</th>
                                <th className="p-4 md:p-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Teléfono</th>
                                <th className="p-4 md:p-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Email</th>
                                <th className="p-4 md:p-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Rol</th>
                                <th className="p-4 md:p-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4 md:p-6">
                                        <div className="flex items-center gap-3 md:gap-4 min-w-max">
                                            {user.photo ? (
                                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden shrink-0 border border-slate-200">
                                                    <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] md:text-xs uppercase shrink-0">
                                                    {user.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                            )}
                                            <div>
                                                <p className={`font-bold text-xs md:text-sm whitespace-nowrap ${user.isActive ? 'text-slate-800' : 'text-slate-400'}`}>{user.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`p-4 md:p-6 font-medium text-xs md:text-sm ${user.isActive ? 'text-slate-600' : 'text-slate-400'} whitespace-nowrap`}>
                                        {user.phone ? (
                                            <div className="flex items-center gap-1">
                                                <span>{user.phone}</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-300 italic">No registrado</span>
                                        )}
                                    </td>
                                    <td className={`p-4 md:p-6 font-medium text-xs md:text-sm ${user.isActive ? 'text-slate-600' : 'text-slate-400 line-through'} whitespace-nowrap`}>{user.email}</td>
                                    <td className="p-4 md:p-6">
                                        <span className={`px-4 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest whitespace-nowrap
                          ${user.role === 'admin' ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 md:p-6">
                                        <div className="flex items-center justify-center gap-2 min-w-max">
                                            <button
                                                onClick={() => openEditModal(user)}
                                                className="p-2 text-slate-500 hover:text-[#09C9CB] hover:bg-[#09C9CB]/10 rounded-xl transition-all"
                                                title="Editar usuario"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(user)}
                                                className={`p-2 rounded-xl transition-all ${user.isActive ? 'text-slate-500 hover:text-red-500 hover:bg-red-50' : 'text-slate-500 hover:text-green-500 hover:bg-green-50'}`}
                                                title={user.isActive ? 'Desactivar usuario' : 'Reactivar usuario'}
                                            >
                                                {user.isActive ? <Trash2 size={18} /> : <RotateCcw size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-12 text-center text-slate-400 text-sm font-medium">
                                        No se encontraron usuarios {filterStatus === 'active' ? 'activos' : 'inactivos'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Create User Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={closeModal}
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
                                    {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                                </h2>
                                <button onClick={closeModal} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-100 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Nombre Completo</label>
                                    <input
                                        type="text"
                                        required
                                        value={newUser.fullName}
                                        onChange={e => setNewUser({ ...newUser, fullName: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#09C9CB] focus:border-transparent font-medium"
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={newUser.email}
                                        onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#09C9CB] focus:border-transparent font-medium"
                                        placeholder="usuario@pelicanos.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Teléfono (Opcional)</label>
                                    <input
                                        type="tel"
                                        value={newUser.phone}
                                        onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#09C9CB] focus:border-transparent font-medium"
                                        placeholder="Ej. +52 123 456 7890"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                                        {editingUser ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
                                    </label>
                                    <input
                                        type="password"
                                        required={!editingUser}
                                        minLength={6}
                                        value={newUser.password}
                                        onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#09C9CB] focus:border-transparent font-medium"
                                        placeholder="******"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Rol</label>
                                    <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200">
                                        {['admin', 'receptionist'].map((r) => (
                                            <button
                                                key={r}
                                                type="button"
                                                onClick={() => setNewUser({ ...newUser, role: r })}
                                                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${newUser.role === r
                                                    ? 'bg-slate-900 text-white shadow-md'
                                                    : 'text-slate-400 hover:text-slate-600'
                                                    }`}
                                            >
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-[#09C9CB] text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-[#09C9CB]/90 transition-all shadow-lg shadow-[#09C9CB]/20"
                                    >
                                        {editingUser ? 'Actualizar Usuario' : 'Crear Usuario'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <ConfirmModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={confirmToggleStatus}
                title={confirmModal.user?.isActive ? "Desactivar Usuario" : "Reactivar Usuario"}
                message={
                    confirmModal.user?.isActive
                        ? `¿Estás seguro de desactivar a ${confirmModal.user?.name}? No podrá iniciar sesión hasta que sea reactivado.`
                        : `¿Deseas reactivar a ${confirmModal.user?.name}? Podrá acceder al sistema nuevamente.`
                }
                confirmText={confirmModal.user?.isActive ? "Sí, Desactivar" : "Sí, Reactivar"}
                variant={confirmModal.user?.isActive ? "danger" : "info"}
            />
        </div>
    );
};
