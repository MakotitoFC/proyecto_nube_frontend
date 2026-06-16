import React from 'react';
import { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Política de Cookies | Pelícanos Beach Club',
    description: 'Política de uso de cookies en Pelícanos Beach Club.',
};

export default function CookiePolicyPage() {
    return (
        <main className="bg-white text-slate-600 w-full min-h-screen">
            <PageHeader
                title="POLÍTICA DE COOKIES"
                subtitle=""
                description=""
                image="/img/Loader.webp"
                height="h-[40vh]"
            />

            <div className="max-w-6xl mx-auto px-8  md:px-24 py-12  md:py-24 space-y-12 bg-white relative z-10 -mt-22 rounded-t-3xl shadow-xl">

                <div className="space-y-8 text-sm md:text-base   leading-relaxed">

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 font-principal tracking-wide">¿Qué son las cookies?</h2>
                        <p>
                            Las cookies son pequeños archivos de texto que se almacenan en el dispositivo del usuario cuando visita un sitio web.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 font-principal tracking-wide">Tipos de cookies que utilizamos</h2>
                        <ul className="list-disc pl-5 space-y-1 ">
                            <li>Cookies técnicas necesarias para el funcionamiento del sitio</li>
                            <li>Cookies de análisis para conocer el comportamiento de navegación</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 font-principal tracking-wide">Uso de cookies</h2>
                        <p>Las cookies nos permiten:</p>
                        <ul className="list-disc pl-5 space-y-1 ">
                            <li>Recordar preferencias del usuario</li>
                            <li>Analizar el tráfico del sitio</li>
                            <li>Mejorar nuestros servicios</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 font-principal tracking-wide">Gestión de cookies</h2>
                        <p>
                            El usuario puede configurar su navegador para aceptar, rechazar o eliminar cookies en cualquier momento.
                        </p>
                        <p className="mt-2">
                            Al continuar navegando en este sitio, el usuario acepta el uso de cookies conforme a esta política.
                        </p>
                    </section>

                </div>
            </div>
        </main>
    );
}
