import React from 'react';
import { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Términos y Condiciones | Pelícanos Beach Club',
    description: 'Términos y condiciones de uso de Pelícanos Beach Club.',
};

export default function TermsAndConditionsPage() {
    return (
        <main className="bg-white text-slate-600 w-full min-h-screen">
            <PageHeader
                title="TÉRMINOS Y CONDICIONES"
                subtitle=""
                description=""
                image="/img/Loader.webp"
                height="h-[40vh]"
            />

            <div className="max-w-6xl mx-auto px-8 md:px-24 py-12 md:py-24 space-y-12 bg-white relative z-10 -mt-22 rounded-t-3xl shadow-xl">

                <div className="space-y-8 text-sm md:text-base leading-relaxed">

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 font-principal tracking-wide">Uso del sitio</h2>
                        <p>
                            Este sitio tiene como finalidad brindar información sobre nuestros servicios, hospedaje, beach club, menú y experiencias. El usuario se compromete a utilizar el sitio de forma lícita y respetuosa.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 font-principal tracking-wide">Restricción de edad</h2>
                        <p>
                            Este sitio y los servicios ofrecidos están dirigidos exclusivamente a personas mayores de 18 años.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 font-principal tracking-wide">Propiedad intelectual</h2>
                        <p>
                            Todo el contenido de este sitio, incluyendo textos, imágenes, logotipos y diseño, es propiedad de Pelícanos y está protegido por las leyes de propiedad intelectual. Queda prohibida su reproducción sin autorización previa.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 font-principal tracking-wide">Limitación de responsabilidad</h2>
                        <p>
                            Pelícanos no garantiza que el sitio esté libre de errores o interrupciones, y no será responsable por daños derivados del uso del mismo.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 font-principal tracking-wide">Modificaciones</h2>
                        <p>
                            Pelícanos se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 font-principal tracking-wide">Legislación aplicable</h2>
                        <p>
                            Estos términos se rigen por las leyes vigentes en los Estados Unidos Mexicanos.
                        </p>
                    </section>

                </div>
            </div>
        </main>
    );
}
