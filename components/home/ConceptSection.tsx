import React from 'react';

export const ConceptSection: React.FC = () => {
    return (
        <section className="relative w-full bg-[#fcfaf7] overflow-hidden pb-15">
            <div className="absolute w-full z-20 pointer-events-none select-none leading-none">
                <img
                    src="/home/mockup_inf.webp"
                    alt="Detalle Arena"
                    className="w-full h-auto object-cover object-bottom block origin-bottom"
                    draggable="false"
                />
            </div>
            <div className="w-9/10 mx-auto  mt-25 flex flex-col gap-24 items-center">

                {/* Top: Descriptive Text */}
                <div className="text-slate-800 pt-20  max-w-5xl space-y-6 text-center  mx-auto z-40 relative">
                    <h3 className="text-2xl md:text-3xl font-principal uppercase font-extrabold text-[#3a7ca5] leading-relaxed  mx-auto block mb-4">

                        Bienvenido a Pelícanos
                    </h3>

                    <p
                        className="text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-gray-500 block font-principal  mx-auto leading-loose">
                        Amarás el primer contacto del mar en tu piel. Las vistas del horizonte infinito. El sonido de las olas besando la orilla.
                        Amarás descubrir los sabores de nuestra cocina.
                        Cada amanecer, cada momento, cada toque de lujo. Amarás crear recuerdos juntos, y amarás que todo esté diseñado para ti.
                    </p>

                </div>

                {/* Bottom: Image & Titles (Love/Hate Style) */}
                <div className="relative flex justify-center items-center">
                    {/* Central Image */}
                    <div className="relative z-10 w-full max-w-sm md:max-w-md aspect-[4/5] shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1516815231560-8f41ec531527?auto=format&fit=crop&w=800&q=80"
                            alt="Concept Atmosphere"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Top Left Text Group */}
                    <div className="absolute top-4 md:top-10 -left-2 md:-left-12 z-30 text-slate-900 mix-blend-multiply opacity-90">
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-principal font-thin tracking-tighter leading-none uppercase">
                            TU LUGAR
                        </h2>
                        <span className="block text-3xl md:text-5xl font-secundaria text-[#3a7ca5] -mt-2 md:-mt-4 ml-12 md:ml-24 -rotate-6">
                            para conectar
                        </span>
                    </div>

                    {/* Bottom Right Text Group */}
                    <div className="absolute bottom-4 md:bottom-10 -right-2 md:-right-12 z-30 text-right text-slate-900 mix-blend-multiply opacity-90">
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-principal font-thin tracking-tighter leading-none uppercase">
                            DESDE
                        </h2>
                        <span className="block text-4xl md:text-6xl font-secundaria text-[#3a7ca5] -mt-2 md:-mt-4 mr-8 md:mr-12 -rotate-6">
                            2020
                        </span>
                    </div>
                </div>

            </div>
        </section>
    );
};
