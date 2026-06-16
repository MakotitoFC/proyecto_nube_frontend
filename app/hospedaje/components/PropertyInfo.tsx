import React, { useState } from 'react';
import AmenitiesCarousel from '../../../components/AmenitiesCarousel';
import {
    IconBed,
    IconBath,
    IconToolsKitchen2,
    IconStar,
    IconMapPin,
    IconWind,
    IconDeviceTv,
    IconWifi,
    IconLock,
    IconVolume2,
    IconCheck,
    IconClock,
    IconParking,
    IconUmbrella,
    IconFirstAidKit,
    IconCoffee,
    IconUser,
    IconMaximize,
    IconChevronUp,
    IconChevronDown
} from '@tabler/icons-react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import Gallery from './Gallery';

// --- Helper Components ---

function QuickStat({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="flex items-center gap-2 bg-slate-50/50 px-4 py-2 rounded-xl text-slate-600 font-medium text-sm">
            <span className="text-[#3a7ca5]">{icon}</span>
            {label}
        </div>
    );
}

// function AmenityItem removed


function RuleItem({ text }: { text: string }) {
    return (
        <li className="flex items-center gap-3 text-slate-600">
            <div className="text-emerald-500">
                <IconCheck size={18} stroke={3} />
            </div>
            <span className="text-sm font-medium">{text}</span>
        </li>
    );
}

const PropertyInfo = () => {
    const [showDetails, setShowDetails] = useState(false);

    const amenities = [
        { icon: <IconWind size={24} />, label: "Aire Acondicionado", sub: "Control individual" },
        { icon: <IconWifi size={24} />, label: "Wifi Starlink", sub: "Alta velocidad" },
        { icon: <IconParking size={24} />, label: "Estacionamiento", sub: "Gratuito" },
        { icon: <IconUmbrella size={24} />, label: "Acceso Playa", sub: "Directo al mar" },
        { icon: <IconStar size={24} />, label: "Acceso Beach Club", sub: "Zona exclusiva" },
        { icon: <IconFirstAidKit size={24} />, label: "Botiquín", sub: "Emergencias" },
    ];

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="space-y-5  font-principal"
        >
            {/* 1. Header Section */}
            <motion.div variants={fadeInUp} className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between mx-4 items-start gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h1 className="text-4xl font-bold text-slate-900 tracking-tight font-tertiary">Espacios diseñados para reconectar</h1>

                        </div>

                    </div>

                    <div className="flex items-center gap-2  px-4 py-2 rounded-full ">
                        <IconStar size={18} className="text-amber-400 fill-amber-400" />
                        <span className="text-slate-800 font-black text-lg">4.9</span>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-wide">(128 Reseñas)</span>
                    </div>
                </div>


            </motion.div>

            {/* 3. Gallery Section */}
            <motion.div variants={fadeInUp} >
                <Gallery />
            </motion.div>
            {/* 2. Description Block */}
            <motion.div variants={fadeInUp} className="mx-4">
                <p className="text-slate-600 leading-relaxed text-base text-justify">
                    Experimenta la máxima comodidad en nuestras 12 habitaciones idénticas,
                    diseñadas para satisfacer todas tus necesidades con lujo y conveniencia.
                    Perfectamente situadas frente al mar, cada habitación ofrece una vista
                    espectacular y acceso directo a la playa.
                    Tu refugio privado con todas las comodidades modernas.
                </p>
            </motion.div>


            {/* 4. Amenities Section */}
            <motion.div variants={fadeInUp}>
                <AmenitiesCarousel
                    title="Servicios incluidos"
                    amenities={amenities}
                    className="mx-4"
                />
            </motion.div>

            {/* 5. Room Details & Rules */}
            <motion.div variants={fadeInUp}
                className=" pb-4">
                <h3 className="text-2xl font-bold text-slate-900  border-b border-slate-300/50 mx-4 font-tertiary mb-6">Detalles de alojamiento</h3>

                <div className="grid grid-cols-2 gap-8 mx-4 mb-8">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                            <IconUser size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">Huéspedes</p>
                            <p className="text-sm text-slate-500">2 Adultos por habitación </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                            <IconMaximize size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-slate-900">Tamaño</p>
                            <p className="text-sm text-slate-500">45 m² • Vista al Mar</p>
                        </div>
                    </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors"
                    >
                        <span className="font-bold text-lg text-slate-900">Más detalles de la habitación</span>
                        {showDetails ? <IconChevronUp className="text-slate-500" /> : <IconChevronDown className="text-slate-500" />}
                    </button>

                    <AnimatePresence>
                        {showDetails && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <div className="p-8 bg-slate-50/30 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-slate-900">
                                            <IconClock size={20} className="text-[#3a7ca5]" />
                                            <h4 className="font-bold text-lg">Check In</h4>
                                        </div>
                                        <ul className="space-y-3 pl-2 border-l-2 border-slate-200">
                                            <RuleItem text="De 15:00 a 23:00 hrs" />
                                            <RuleItem text="Identificación oficial requerida" />
                                            <RuleItem text="Depósito de seguridad" />
                                        </ul>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-slate-900">
                                            <IconClock size={20} className="text-[#3a7ca5]" />
                                            <h4 className="font-bold text-lg">Check Out</h4>
                                        </div>
                                        <ul className="space-y-3 pl-2 border-l-2 border-slate-200">
                                            <RuleItem text="Hasta las 12:00 hrs" />
                                            <RuleItem text="Entrega de llaves en recepción" />
                                            <RuleItem text="Revisión de inventario" />
                                        </ul>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>


        </motion.div>
    );
};

export default PropertyInfo;
