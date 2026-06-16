'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { PageHeader } from '@/components/panel/PageHeader';
import { useToast } from '@/components/ui/Toast';
import { updateProfileInfo, getProfile } from '@/services/userService';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, IconLock, Camera, Upload, IconLink, Edit } from '@/components/ui/Icons';

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const { showToast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'perfil' | 'seguridad'>('perfil');

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        photo: '',
        password: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            // @ts-ignore
            if (session?.accessToken) {
                try {
                    // @ts-ignore
                    const RealUser = await getProfile(session.accessToken);
                    setFormData({
                        fullName: RealUser.name || '',
                        email: RealUser.email || '',
                        phone: RealUser.phone || '',
                        photo: RealUser.photo || '',
                        password: '',
                    });
                } catch (error) {
                    console.error('Failed to parse real user profile, falling back to session', error);
                    setFormData({
                        // @ts-ignore
                        fullName: session?.user?.name || session?.user?.fullName || '',
                        email: session?.user?.email || '',
                        // @ts-ignore
                        phone: session?.user?.phone || '',
                        // @ts-ignore
                        photo: session?.user?.photo || '',
                        password: '',
                    });
                }
            }
        };
        fetchProfile();
    }, [session]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showToast('La imagen es demasiado grande. Máximo 5MB.', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, photo: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // @ts-ignore
        if (!session?.user?.id || !session?.accessToken) return;

        setIsLoading(true);
        try {
            // @ts-ignore
            const userId = session.user.id;
            // @ts-ignore
            const token = session.accessToken;

            const updatePayload: any = {
                fullName: formData.fullName,
                phone: formData.phone,
                photo: formData.photo,
            };

            if (formData.password.trim() !== '') {
                updatePayload.password = formData.password;
            }

            const updatedUser = await updateProfileInfo(token, updatePayload);

            // Try to update session directly
            await update({
                ...session,
                user: {
                    ...session.user,
                    name: updatedUser.name,
                    phone: updatedUser.phone,
                    photo: updatedUser.photo
                }
            });

            showToast('Perfil actualizado correctamente', 'success');
            setFormData(prev => ({ ...prev, password: '' })); // Clear password field
        } catch (error) {
            console.error('Error updating profile:', error);
            showToast('Error al actualizar el perfil', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="pb-10">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <PageHeader
                    title="Configuración de Perfil"
                    subtitle="Gestiona tu información personal y opciones de seguridad de tu cuenta."
                />
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Lateral Sidebar Menu */}
                <div className="lg:col-span-1 space-y-2">
                    <button
                        onClick={() => setActiveTab('perfil')}
                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${activeTab === 'perfil'
                            ? 'bg-white shadow-sm border border-slate-200 text-slate-900 font-bold'
                            : 'text-slate-500 hover:bg-white/60 hover:text-slate-700 font-medium'
                            }`}
                    >
                        <User size={18} className={activeTab === 'perfil' ? 'text-[#09C9CB]' : ''} />
                        Información Personal
                    </button>
                    <button
                        onClick={() => setActiveTab('seguridad')}
                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all ${activeTab === 'seguridad'
                            ? 'bg-white shadow-sm border border-slate-200 text-slate-900 font-bold'
                            : 'text-slate-500 hover:bg-white/60 hover:text-slate-700 font-medium'
                            }`}
                    >
                        <IconLock size={18} className={activeTab === 'seguridad' ? 'text-[#09C9CB]' : ''} />
                        Seguridad y Acceso
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden"
                    >
                        <form onSubmit={handleSubmit}>
                            <div className="p-8 md:p-10">

                                {activeTab === 'perfil' && (
                                    <div className="space-y-8">

                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 rounded-2xl bg-[#09C9CB]/10 text-[#09C9CB] flex items-center justify-center shrink-0">
                                                <User size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900">Perfil Público</h2>
                                                <p className="text-sm font-medium text-slate-500">Esta información será visible internamente en la plataforma.</p>
                                            </div>
                                        </div>

                                        {/* Avatar Section */}
                                        <div className="flex flex-col md:flex-row gap-8 items-start">
                                            <div className="shrink-0 flex flex-col items-center gap-3">
                                                <div className="relative group">
                                                    <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 bg-slate-100 border-4 border-white shadow-xl">
                                                        {formData.photo ? (
                                                            <img src={formData.photo} alt="Profile preview" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                                <Camera size={40} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={triggerFileInput}
                                                        className="absolute bottom-0 right-0 p-3 bg-slate-900 text-white rounded-full shadow-lg hover:bg-[#09C9CB] hover:scale-110 transition-all z-10"
                                                        title="Subir foto"
                                                    >
                                                        <Camera size={16} />
                                                    </button>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Tu Foto</span>
                                            </div>

                                            <div className="flex-1 space-y-4 w-full">
                                                <div className="space-y-4">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        ref={fileInputRef}
                                                        onChange={handleFileChange}
                                                    />
                                                    <div
                                                        onClick={triggerFileInput}
                                                        className="w-full border-2 border-dashed border-slate-200 rounded-[24px] p-8 text-center cursor-pointer hover:border-[#09C9CB] hover:bg-[#09C9CB]/5 transition-all group bg-slate-50/50"
                                                    >
                                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100 group-hover:border-[#09C9CB]/20">
                                                            <Upload size={20} className="text-slate-400 group-hover:text-[#09C9CB]" />
                                                        </div>
                                                        <p className="text-sm font-bold text-slate-700">Subir nueva imagen</p>
                                                        <p className="text-xs text-slate-400 mt-1 font-medium">PNG, JPG o WEBP (Máximo 5MB)</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-px bg-slate-100 my-8 w-full" />

                                        {/* Profile Fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                                                    Nombre Completo
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                        <Edit size={18} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="fullName"
                                                        required
                                                        value={formData.fullName}
                                                        onChange={handleChange}
                                                        className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#09C9CB] focus:border-transparent font-medium"
                                                        placeholder="Ej. Juan Pérez"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                                                    Correo Electrónico (No modificable)
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                        <Mail size={18} />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        readOnly
                                                        value={formData.email}
                                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-400 cursor-not-allowed font-medium"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                                                    Número de Teléfono
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                        <Phone size={18} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        name="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#09C9CB] focus:border-transparent font-medium"
                                                        placeholder="+52 123 456 7890"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'seguridad' && (
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                                                <IconLock size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-slate-900">Seguridad de la Cuenta</h2>
                                                <p className="text-sm font-medium text-slate-500">Actualiza tus credenciales para mantener tu cuenta protegida.</p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            <h3 className="text-sm font-bold text-slate-800 mb-2">Cambios de Contraseña</h3>
                                            <p className="text-sm text-slate-500 mb-6">
                                                Si no deseas cambiar tu contraseña, deja este campo en blanco. Al cambiarla, se cerrarán todas tus sesiones activas.
                                            </p>

                                            <div className="max-w-md">
                                                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">
                                                    Nueva Contraseña
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                                                        <IconLock size={18} />
                                                    </div>
                                                    <input
                                                        type="password"
                                                        name="password"
                                                        minLength={6}
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-medium"
                                                        placeholder="******"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>

                            <div className="px-8 md:px-10 py-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-4 rounded-b-[40px]">

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`bg-[#09C9CB] text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#09C9CB]/20 flex items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#09C9CB]/90'
                                        }`}
                                >
                                    {isLoading && (
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
