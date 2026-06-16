'use client';

'use client';

import React from 'react';
import AmenitiesCarousel from '../../../components/AmenitiesCarousel';
import {
    IconUser,
    IconCheck,
    IconX,
    IconFlame,
    IconTarget,
    IconConfetti,
    IconInfoCircle,
    IconClock,
    IconMapPin,
    IconStar,
    IconUmbrella,
    IconWifi,
    IconFirstAidKit,
    IconCoffee,
    IconDroplet,
    IconCar,
    IconBan
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import Gallery from './Gallery';
import { SPACE_TYPES } from '../data/mockData';
import { Resource } from '@/services/resourceService';

const PropertyInfo = ({
    selectedId,
    onSelect,
    selectedDate,
    selectedSpaceName,
    resources,
    occupiedIds
}: {
    selectedId: string | null,
    onSelect: (id: string) => void,
    selectedDate?: string,
    selectedSpaceName?: string,
    resources: Resource[],
    occupiedIds: string[]
}) => {

    // Get Content
    const getSpaceDetails = () => {
        if (!selectedId) return null;

        let prefix = 'P';

        if (selectedSpaceName) {
            const lowerName = selectedSpaceName.toLowerCase();
            if (lowerName.includes('palapa')) prefix = 'P';
            else if (lowerName.includes('alberca')) prefix = 'A';
            else if (lowerName.includes('lounge')) prefix = 'L';
            else prefix = selectedSpaceName.charAt(0).toUpperCase();
        } else if (selectedId) {
            prefix = selectedId.charAt(0).toUpperCase();
        }

        const details = SPACE_TYPES[prefix] || SPACE_TYPES['P'];

        const displayId = selectedSpaceName || selectedId;

        return {
            ...details,
            title: displayId ? `${details.title} ${displayId}` : details.title
        };
    };

    const content = getSpaceDetails();

    return (
        <div
            className="space-y-8 font-principal pb-12 md:mx-4 lg:mx-0"
        >


            {/* 0. Header Title (Dynamic) */}
            <div className="mx-4 md:mx-0 flex flex-col md:flex-row md:justify-between md:items-end gap-2">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 font-tertiary ">
                        {content ? content.title : "Selecciona tu espacio"}
                    </h2>
                    {!content && <p className="text-slate-500 text-sm mt-1">Elige zona playa, lounge o alberca</p>}
                </div>

                {/* Rating Badge */}
                <div className="flex items-center gap-2  px-4 py-2 rounded-full ">
                    <IconStar size={18} className="text-amber-400 fill-amber-400" />
                    <span className="text-slate-800 font-black text-lg">4.9</span>
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">(128 Reseñas)</span>
                </div>

            </div>

            {/* 1. Gallery (MAP) Section - Always visible */}
            <Gallery
                onSelect={onSelect}
                selectedId={selectedId}
                selectedDate={selectedDate}
                resources={resources}
                occupiedIds={occupiedIds}
            />

            {/* 2. Content Section */}
            <div className="min-h-[400px]">
                <AnimatePresence mode='wait'>
                    {content ? (
                        /* --- SELECTED SPACE VIEW --- */
                        <motion.div
                            key={selectedId || 'content'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="mx-4 md:mx-0 space-y-6"
                        >
                            {/* Header: Title Removed (Moved above Gallery) */}
                            <div className="space-y-3 pt-4">

                                {/* Badges / Tags */}
                                {content.tags && (
                                    <div className="flex flex-wrap gap-2">
                                        {content.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide ${tag.color}`}
                                            >
                                                {tag.icon}
                                                {tag.label}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Meta: Capacity & Age */}
                                <div className="flex items-center gap-2 text-slate-700 font-medium text-sm md:text-base">
                                    <IconUser size={20} className="text-slate-400" />
                                    <span>Up to {content.capacity}</span>
                                    <span className="text-slate-300">•</span>
                                    <span>{content.adultsOnly ? "Adults Only (18+)" : "Family Friendly"}</span>
                                </div>

                                {/* Short Description */}
                                <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                                    {content.shortDescription}
                                </p>
                            </div>

                            {/* 5-IMAGE GRID DESIGN */}
                            {/* Dynamic Image Grid based on Length */}
                            {content.images.length === 3 ? (
                                <div className="grid grid-cols-3 grid-rows-2 gap-2 h-72 md:h-96 rounded-2xl overflow-hidden cursor-pointer group shadow-sm bg-white border border-slate-100 p-1">
                                    {/* Main - Left 2/3 */}
                                    <div className="col-span-2 row-span-2 relative h-full overflow-hidden rounded-xl">
                                        <img src={content.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Main" />
                                    </div>
                                    {/* Right Column */}
                                    <div className="col-span-1 row-span-1 relative h-full overflow-hidden rounded-xl">
                                        <img src={content.images[1]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Detail 1" />
                                    </div>
                                    <div className="col-span-1 row-span-1 relative h-full overflow-hidden rounded-xl">
                                        <img src={content.images[2]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Detail 2" />
                                    </div>
                                </div>
                            ) : content.images.length === 4 ? (
                                <div className="grid grid-cols-3 grid-rows-2 gap-2 h-72 md:h-96 rounded-2xl overflow-hidden cursor-pointer group shadow-sm bg-white border border-slate-100 p-1">
                                    {/* Main - Top Full Width */}
                                    <div className="col-span-3 row-span-1 relative h-full overflow-hidden rounded-xl">
                                        <img src={content.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Main" />
                                    </div>
                                    {/* Bottom Row - 3 Images */}
                                    {content.images.slice(1, 4).map((img, i) => (
                                        <div key={i} className="col-span-1 row-span-1 relative h-full overflow-hidden rounded-xl">
                                            <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={`Detail ${i + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                /* Default (5+) Layout */
                                <div className="grid grid-cols-4 grid-rows-2 gap-2 h-72 md:h-96 rounded-2xl overflow-hidden cursor-pointer group shadow-sm bg-white border border-slate-100 p-1">
                                    {/* Main - Left 2x2 */}
                                    <div className="col-span-2 row-span-2 relative h-full overflow-hidden rounded-xl">
                                        <img src={content.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Main view" />
                                    </div>
                                    {/* Right 2x2 Grid */}
                                    <div className="col-span-1 row-span-1 relative h-full overflow-hidden rounded-xl">
                                        <img src={content.images[1]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Detail 1" />
                                    </div>
                                    <div className="col-span-1 row-span-1 relative h-full overflow-hidden rounded-xl">
                                        <img src={content.images[2]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Detail 2" />
                                    </div>
                                    <div className="col-span-1 row-span-1 relative h-full overflow-hidden rounded-xl">
                                        <img src={content.images[3]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Detail 3" />
                                    </div>
                                    <div className="col-span-1 row-span-1 relative h-full overflow-hidden rounded-xl">
                                        <img src={content.images[4]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Detail 4" />
                                    </div>
                                </div>
                            )}


                        </motion.div>
                    ) : (
                        /* --- GENERAL INFO VIEW (DEFAULT) --- */
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-12"
                        >
                            {/* 1. Description */}
                            <div className="mx-4 md:mx-0">
                                <h3 className="text-2xl font-bold text-slate-900 border-b border-slate-300/50 pb-4 font-tertiary mb-6">Llegaste a buen puerto</h3>
                                <p className="text-slate-600 leading-relaxed text-base text-justify">
                                    Disfruta de un día inolvidable frente al mar. Relájate en nuestras cómodas instalaciones,
                                    degusta nuestra exquisita gastronomía y vive la experiencia única de nuestro Beach Club.
                                    Tu acceso incluye uso de alberca, playa y servicios esenciales.
                                </p>
                            </div>

                            {/* 2. Amenities Carousel */}
                            <div className="mx-4 md:mx-0"> {/* 5. Replace carousel JSX - wrap existing AmenitiesCarousel */}
                                <AmenitiesCarousel
                                    title="Servicios incluidos"
                                    amenities={[
                                        { icon: <IconWifi size={24} />, label: "WiFi Zonas", sub: "" },
                                        { icon: <IconDroplet size={24} />, label: "Regaderas", sub: "" },
                                        { icon: <IconUmbrella size={24} />, label: "Renta Toallas", sub: "" },
                                        { icon: <IconInfoCircle size={24} />, label: "Baños", sub: "" },
                                        { icon: <IconFirstAidKit size={24} />, label: "Primeros Auxilios", sub: "" },
                                        { icon: <IconBan size={24} />, label: "No Mascotas", sub: "" },
                                        { icon: <IconBan size={24} />, label: "No Coolers", sub: "" }
                                    ]}
                                />
                            </div>

                            {/* 3. Horarios */}
                            <div className="mx-4 md:mx-0 pt-4">
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 border-b border-slate-300/50 pb-4 font-tertiary mb-6">Horarios de servicio</h3>
                                <div className="space-y-3 md:space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 md:p-2.5 bg-slate-100 rounded-xl text-slate-700">
                                            <IconClock className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-slate-700 font-medium text-lg md:text-xl">11:00 AM – 6:00 PM</p>
                                            <p className="text-slate-400 text-sm md:text-md font-medium">Last call: 5:30 PM</p>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* 4. Consumo */}
                            <div className="mx-4 md:mx-0 pt-4">
                                <h3 className="text-2xl font-bold text-slate-900 border-b border-slate-300/50 pb-4 font-tertiary mb-6">Precios y consumo</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-slate-100 rounded-xl text-slate-700">
                                            <IconStar size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">Consumo mínimo (p/p)</h4>
                                        </div>
                                    </div>
                                    <ul className="pl-[52px] space-y-3">
                                        <li className="flex justify-between items-center text-sm border-slate-100 pb-2">
                                            <span className="font-bold text-slate-800">Alberca</span>
                                            <span className="text-slate-900 text-base">$600 MXN</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm border-slate-100 pb-2">
                                            <span className="font-bold text-slate-708000">Lounge</span>
                                            <span className="text-slate-900 text-base">$900 MXN</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm border-slate-100 pb-2">
                                            <span className="font-bold text-slate-800">Playa</span>
                                            <span className="text-slate-900 text-base">$800 MXN</span>
                                        </li>
                                        <li className="flex justify-between items-center text-sm border-slate-100 pb-2">
                                            <span className="font-bold text-slate-800">Renta de toalla</span>
                                            <span className="text-slate-900 text-base">$100 MXN</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* 5. Políticas */}
                            <div className="mx-4 md:mx-0 pt-4 pb-8">
                                <h3 className="text-2xl font-bold text-slate-900 border-b border-slate-300/50 pb-4 font-tertiary mb-6">Políticas del Beach Club</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2.5 bg-slate-100 rounded-xl text-slate-700">
                                            <IconCheck size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-lg">Reglas Importantes</h4>
                                        </div>
                                    </div>

                                    <ul className="pl-[42px] space-y-4">
                                        <li className="flex items-start gap-3 text-slate-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#09C9CB] mt-2 shrink-0" />
                                            <span>Hold de <strong className="text-slate-900">$100 p/p</strong> para garantizar reserva (No reembolsable en cancelación).</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-slate-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#09C9CB] mt-2 shrink-0" />
                                            <span className="text-slate-600">Llegada: <strong className="text-slate-900">11:00 AM - 12:30 PM</strong>. La reserva se libera después de este horario.</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-slate-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                                            <span>No menores de 18 años en áreas generales (Sin excepción).</span>
                                        </li>
                                        <li className="flex items-start gap-3 text-slate-600">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                                            <span>No se permite el ingreso de alimentos ni bebidas externos.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </div>
    );
};

export default PropertyInfo;
