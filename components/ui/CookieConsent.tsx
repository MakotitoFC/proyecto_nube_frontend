'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [preferences, setPreferences] = useState({
        essential: true,
        analytics: true,
        marketing: false,
    });

    useEffect(() => {
        const saved = localStorage.getItem('cookie-consent-preferences');
        if (saved) {
            setPreferences(JSON.parse(saved));
        } else {
            const consent = localStorage.getItem('cookie-consent');
            if (!consent) {
                const timer = setTimeout(() => setIsVisible(true), 1500);
                return () => clearTimeout(timer);
            }
        }
    }, []);

    const handleAcceptAll = () => {
        const allOn = { essential: true, analytics: true, marketing: true };
        localStorage.setItem('cookie-consent', 'true');
        localStorage.setItem('cookie-consent-preferences', JSON.stringify(allOn));
        setIsVisible(false);
    };

    const handleSaveSettings = () => {
        localStorage.setItem('cookie-consent', 'true');
        localStorage.setItem('cookie-consent-preferences', JSON.stringify(preferences));
        setIsVisible(false);
        setShowSettings(false);
    };

    const togglePreference = (key: keyof typeof preferences) => {
        if (key === 'essential') return;
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, x: -20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="fixed bottom-6 left-0 right-0 mx-2 sm:mx-6 md:left-6 md:right-auto md:mx-0 z-100 w-auto max-w-[calc(100%-1rem)] sm:max-w-[calc(100%-3rem)] md:max-w-md bg-[#1a1d21] p-6 md:p-8 shadow-2xl border border-white/10"
                >
                    <div className="flex flex-col gap-6">
                        {!showSettings ? (
                            <>
                                <p className="text-white text-[11px] md:text-[13px] leading-relaxed font-principal tracking-wider opacity-90">
                                    Nuestro sitio web utiliza cookies para garantizar que recibas la mejor
                                    experiencia de usuario y que el sitio funcione de manera efectiva.
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <button
                                        onClick={handleAcceptAll}
                                        className="px-8 py-3 border border-white text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all duration-300"
                                    >
                                        ACEPTAR
                                    </button>
                                    <button
                                        onClick={() => setShowSettings(true)}
                                        className="px-8 py-3 border border-white text-white text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-white/10 transition-all duration-300"
                                    >
                                        ADMINISTRAR
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-white text-xs font-bold uppercase tracking-[0.3em]">CONFIGURACIÓN</h3>
                                    <button
                                        onClick={() => setShowSettings(false)}
                                        className="text-white/50 hover:text-white text-[10px] uppercase font-bold"
                                    >
                                        Volver
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <CookieCategory
                                        label="Necesarias"
                                        active={true}
                                        disabled={true}
                                        onToggle={() => { }}
                                    />
                                    <CookieCategory
                                        label="Estadísticas"
                                        active={preferences.analytics}
                                        onToggle={() => togglePreference('analytics')}
                                    />
                                    <CookieCategory
                                        label="Marketing"
                                        active={preferences.marketing}
                                        onToggle={() => togglePreference('marketing')}
                                    />
                                </div>

                                <button
                                    onClick={handleSaveSettings}
                                    className="w-full mt-4 py-3 bg-white text-slate-900 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#6ADCD5] hover:text-white transition-all duration-300"
                                >
                                    GUARDAR PREFERENCIAS
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const CookieCategory = ({ label, active, disabled = false, onToggle }: { label: string, active: boolean, disabled?: boolean, onToggle: () => void }) => (
    <div className="flex justify-between items-center py-2 border-b border-white/5">
        <span className={`text-[10px] font-bold uppercase tracking-widest ${disabled ? 'text-white/40' : 'text-white/80'}`}>
            {label}
        </span>
        <button
            disabled={disabled}
            onClick={onToggle}
            className={`w-8 h-4 rounded-full relative transition-colors ${active ? 'bg-[#6ADCD5]' : 'bg-white/20'}`}
        >
            <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${active ? 'right-1' : 'left-1'}`} />
        </button>
    </div>
);
