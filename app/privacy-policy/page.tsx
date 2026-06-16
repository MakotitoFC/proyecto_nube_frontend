import React from 'react';
import { Metadata } from 'next';
import { PageHeader } from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Política de Privacidad | Pelícanos Beach Club',
    description: 'Conoce nuestra política de privacidad y cómo protegemos tus datos en Pelícanos Beach Club.',
};

export default function PrivacyPolicyPage() {
    return (
        <main className="bg-white text-slate-600 w-full min-h-screen">
            <PageHeader
                title="POLÍTICA DE PRIVACIDAD"
                subtitle=""
                description=""
                image="/img/Loader.webp"
                height="h-[40vh]"
            />

            <div className="max-w-6xl mx-auto px-8 md:px-24 py-12 md:py-24 space-y-12 bg-white relative z-10 -mt-22 rounded-t-3xl shadow-xl">

                {/* Content */}
                <div className="space-y-8 text-sm md:text-base leading-relaxed">

                    <section className="space-y-3">
                        <p>
                            La presente Política de Privacidad describe cómo recopilamos, utilizamos y protegenemos la información personal que nos proporcionas al utilizar nuestro sitio web y nuestros servicios.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 font-principal tracking-wide">Información que recopilamos</h2>
                        <p>
                            Podemos recopilar datos personales como nombre, correo electrónico, número telefónico y cualquier información que el usuario proporcione voluntariamente a través de formularios de contacto, reservaciones o suscripciones.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 font-principal tracking-wide">Uso de la información</h2>
                        <p>La información recopilada se utiliza únicamente para:</p>
                        <ul className="list-disc pl-5 space-y-1 ">
                            <li>Gestionar reservaciones</li>
                            <li>Atender solicitudes de contacto</li>
                            <li>Enviar información relacionada con nuestros servicios</li>
                            <li>Mejorar la experiencia del usuario</li>
                        </ul>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 font-principal tracking-wide">Protección de datos</h2>
                        <p>
                            Pelícanos implementa medidas de seguridad técnicas y administrativas para proteger la información personal contra accesos no autorizados, pérdida o uso indebido.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 font-principal tracking-wide">Divulgación a terceros</h2>
                        <p>
                            No compartimos información personal con terceros, salvo cuando sea necesario para la prestación del servicio o por requerimiento legal.
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 font-principal tracking-wide">Derechos del usuario</h2>
                        <p>
                            El usuario puede solicitar en cualquier momento el acceso, rectificación o eliminación de sus datos personales enviando un correo a: <a href="mailto:soporte@pelicanosbeachclub.com" className=" hover:text-slate-900 transition-colors font-medium">soporte@pelicanosbeachclub.com</a>
                        </p>
                    </section>

                    <section className="space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 font-principal tracking-wide">Cambios en esta política</h2>
                        <p>
                            Pelícanos se reserva el derecho de modificar esta Política de Privacidad en cualquier momento. Las modificaciones entrarán en vigor al ser publicadas en este sitio web.
                        </p>
                    </section>

                </div>
            </div>
        </main>
    );
}
