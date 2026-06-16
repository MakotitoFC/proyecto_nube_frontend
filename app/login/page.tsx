'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IconMail, IconLock, IconArrowRight, IconLoader2, IconEye, IconEyeOff, IconAlertCircle } from '@tabler/icons-react';
import { signIn, useSession } from 'next-auth/react';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().min(1, 'El correo electrónico es requerido').email('Formato de correo inválido'),
    password: z.string().min(1, 'La contraseña es requerida').min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type FieldErrors = {
    email?: string;
    password?: string;
};

export default function LoginPage() {
    const { status } = useSession();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [keepSession, setKeepSession] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const router = useRouter();

    React.useEffect(() => {
        if (status === 'authenticated') {
            router.push('/panel');
        }
    }, [status, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setFieldErrors({});

        // Zod validation
        const result = loginSchema.safeParse({ email, password });
        
        if (!result.success) {
            const formattedErrors: FieldErrors = {};
            result.error.issues.forEach((issue) => {
                const fieldName = issue.path[0] as keyof FieldErrors;
                if (fieldName && !formattedErrors[fieldName]) {
                    formattedErrors[fieldName] = issue.message;
                }
            });
            setFieldErrors(formattedErrors);
            setIsLoading(false);
            return;
        }

        try {
            const authResult = await signIn('credentials', {
                email,
                password,
                keepSession: keepSession ? 'true' : 'false',
                redirect: false,
            });

            if (authResult?.error) {
                setError('Credenciales inválidas. Por favor intente nuevamente.');
                setIsLoading(false);
            } else {
                router.push('/panel');
                router.refresh();
            }
        } catch (error) {
            console.error("Login error:", error);
            setError('Ocurrió un error al iniciar sesión.');
            setIsLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden font-principal selection:bg-[#09C9CB] selection:text-white">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=2000"
                    alt="Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
            </div>

            {/* Content Container */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-lg px-2 sm:px-4"
            >
                <div className=" backdrop-blur-2xl rounded-[40px] p-8 md:p-12 border border-white/20 shadow-2xl">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="mb-6"
                        >
                            <img src="/home/logo_white.webp" alt="Logo" className="w-32 md:w-40 h-auto" />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-principal font-extrabold text-white text-center uppercase tracking-widest">
                            INICIAR SESIÓN
                        </h1>
                        <p className="text-white/90 text-sm mt-2 font-medium">Bienvenido de nuevo.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} noValidate className="space-y-6">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-[#09C9CB]/20 border border-[#09C9CB]/40 text-white px-4 py-3 rounded-xl text-[11px] font-bold uppercase tracking-wider text-center shadow-[0_0_20px_rgba(9,201,203,0.15)] flex items-center justify-center gap-2"
                            >
                                <IconAlertCircle size={16} className="text-[#09C9CB]" />
                                {error}
                            </motion.div>
                        )}
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <div className="relative group">
                                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${fieldErrors.email ? 'text-[#09C9CB]' : 'text-white/80 group-focus-within:text-[#09C9CB]'}`}>
                                        <IconMail size={20} />
                                    </span>
                                    <input
                                        type="email"
                                        placeholder="Correo Electrónico"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined }));
                                            if (error) setError('');
                                        }}
                                        className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/80 outline-none transition-all font-medium ${fieldErrors.email ? 'border-[#09C9CB]/50 focus:border-[#09C9CB] focus:bg-[#09C9CB]/5 shadow-[0_0_10px_rgba(9,201,203,0.05)]' : 'border-white/30 focus:border-[#09C9CB]/50 focus:bg-white/10'}`}
                                    />
                                </div>
                                <AnimatePresence mode="wait">
                                    {fieldErrors.email && (
                                        <motion.p 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="text-white text-[9px] font-bold uppercase tracking-widest pl-4 flex items-center gap-1.5"
                                        >
                                            <IconAlertCircle className="text-[#09C9CB]" size={10} />
                                            {fieldErrors.email}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="space-y-1.5">
                                <div className="relative group">
                                    <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${fieldErrors.password ? 'text-[#09C9CB]' : 'text-white/80 group-focus-within:text-[#09C9CB]'}`}>
                                        <IconLock size={20} />
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Contraseña"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: undefined }));
                                            if (error) setError('');
                                        }}
                                        className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/80 outline-none transition-all font-medium ${fieldErrors.password ? 'border-[#09C9CB]/50 focus:border-[#09C9CB] focus:bg-[#09C9CB]/5 shadow-[0_0_10px_rgba(9,201,203,0.05)]' : 'border-white/30 focus:border-[#09C9CB]/50 focus:bg-white/10'}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1"
                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                    >
                                        {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                                    </button>
                                </div>
                                <AnimatePresence mode="wait">
                                    {fieldErrors.password && (
                                        <motion.p 
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 10 }}
                                            className="text-white text-[9px] font-bold uppercase tracking-widest pl-4 flex items-center gap-1.5"
                                        >
                                            <IconAlertCircle className="text-[#09C9CB]" size={10} />
                                            {fieldErrors.password}
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={keepSession}
                                    onChange={(e) => setKeepSession(e.target.checked)}
                                />
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${keepSession ? 'border-[#09C9CB] bg-[#09C9CB]/20' : 'border-white/20 group-hover:border-[#09C9CB]/50'}`}>
                                    <div className={`w-2 h-2 rounded-sm bg-[#09C9CB] transition-all ${keepSession ? 'opacity-100' : 'opacity-0 group-hover:opacity-20'}`} />
                                </div>
                                <span className="text-xs text-white font-bold uppercase tracking-widest">Recuérdame</span>
                            </label>
                            {/* <button type="button" className="text-xs text-[#09C9CB] font-bold uppercase tracking-widest hover:text-[#09bdc0] cursor-pointer transition-colors">
                            ¿Olvidaste tu clave?
                        </button> */}
                        </div>

                        <button
                            disabled={isLoading}
                            type="submit"
                            className="w-full bg-white text-slate-900 py-4 rounded-2xl font-principal font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#09C9CB] hover:text-white transition-all shadow-lg flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <IconLoader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    Ingresar al Portal
                                    <IconArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                </div>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center opacity-90">
                <span className="text-white text-[9px] font-extrabold tracking-[0.5em] uppercase mb-1">Veracruz</span>
                <span className="font-secundaria text-2xl text-white capitalize">playa zapote</span>
            </div>
        </main>
    );
}
