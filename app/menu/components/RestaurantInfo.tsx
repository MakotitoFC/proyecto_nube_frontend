import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import MenuModal from '@/components/menu/MenuModal';

const RestaurantInfo = () => {
    const MENU_IMAGE = encodeURI("/pdf/Menú.pdf");
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

    useEffect(() => {
        const check = () => setIsMobileOrTablet(window.innerWidth < 1024);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = window.innerWidth < 768 ? 280 : 500;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

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
                staggerChildren: 0.2
            }
        }
    };

    return (
        <section className="bg-white font-principal pb-24 overflow-hidden">

            {/* 1. Menu & Hours Section (Moved to Top) */}
            <div className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col-reverse lg:flex-row items-center gap-20">
                    {/* Image Grid - Dual Vertical */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="flex-1 grid grid-cols-2 gap-4 w-full h-[600px]"
                    >
                        <motion.div variants={fadeInUp} className="relative h-full pt-12">
                            <img
                                src="/home/menu/MATERIAL_007.webp"
                                alt="Story 1"
                                className="w-full h-full object-cover shadow-xl"
                            />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="relative h-full pb-12">
                            <img
                                src="/home/menu/MATERIAL_008.webp"
                                alt="Story 2"
                                className="w-full h-full object-cover shadow-xl"
                            />
                        </motion.div>
                    </motion.div>

                    {/* Text Content */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={staggerContainer}
                        className="flex-1 text-center lg:text-left space-y-10"
                    >
                        <motion.div variants={fadeInUp} className="space-y-2">
                            <h2 className="text-5xl md:text-6xl font-tertiary text-slate-900 leading-tight uppercase tracking-widest">
                                BAR & REST.
                            </h2>
                            <div className="w-20 h-1 bg-[#09C9CB] mx-auto lg:mx-0 mt-4"></div>
                        </motion.div>

                        <motion.p variants={fadeInUp} className="text-slate-600 leading-relaxed text-lg font-light">
                            Un espacio donde la tradición culinaria se fusiona con la frescura del mar y una
                            mixología de primer nivel. Vive una experiencia auténtica en un ambiente
                            inigualable.
                        </motion.p>

                        {/* Hours Card */}
                        <motion.div variants={fadeInUp} className="bg-slate-50 p-8 border-l-4 border-[#09C9CB] space-y-6 text-left shadow-sm">
                            <h4 className="font-tertiary text-2xl text-slate-900 uppercase tracking-wider">Horario de Atención</h4>
                            <ul className="space-y-3 text-slate-600 text-sm font-medium">
                                <li className="flex justify-between border-b border-slate-200 pb-2 border-dotted">
                                    <span>Viernes – Sábado</span>
                                    <span className="text-slate-900">11:00 AM – 05:00 PM</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>Domingo</span>
                                    <span className="text-slate-900">11:00 AM – 05:00 PM</span>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="pt-6">
                            {isMobileOrTablet ? (
                                <a
                                    href={MENU_IMAGE}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block px-12 py-4 bg-slate-900 text-white font-tertiary uppercase tracking-[0.2em] text-xs hover:bg-[#09C9CB] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                                >
                                    Ver Menú
                                </a>
                            ) : (
                                <button
                                    onClick={() => setShowMenuModal(true)}
                                    className="inline-block px-12 py-4 bg-slate-900 text-white font-tertiary uppercase tracking-[0.2em] text-xs hover:bg-[#09C9CB] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                                >
                                    Ver Menú
                                </button>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </div>


            {/* 3. Discover Our Story (Moved to Bottom) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">



                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="max-w-6xl  mx-auto px-6 mb-16 text-center"
                >

                    <motion.h3 variants={fadeInUp} className="text-3xl md:text-7xl font-tertiary font-light uppercase text-[#3a7ca5] leading-none mb-6">
                        <span className="font-light text-slate-800">#</span>
                        <span className="font-light text-slate-800">AMARÁS</span>
                        <span className="font-light text-[#6ADCD5]">VERACRUZ</span>
                    </motion.h3>
                    <motion.p variants={fadeInUp} className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 mb-8 block font-principal max-w-4xl mx-auto leading-loose">
                        Como los pelícanos que reconocen a su pareja desde el primer encuentro, aquí el
                        flechazo sucede a primera vista.                    </motion.p>
                </motion.div>


                {/* Bricks / Masonry Layout */}
                {/* Desktop: Masonry Layout */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={staggerContainer}
                    className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 items-start"
                >
                    {/* Column 1 - 3 Images */}
                    <div className="flex flex-col gap-4">
                        <motion.div variants={fadeInUp} className="group overflow-hidden rounded-lg shadow-lg">
                            <img src="/home/menu/MATERIAL_009.webp" className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105" alt="Gallery 009" />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="group overflow-hidden rounded-lg shadow-lg">
                            <img src="/home/menu/MATERIAL_010.webp" className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105" alt="Gallery 010" />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="group overflow-hidden rounded-lg shadow-lg">
                            <img src="/home/menu/MATERIAL_011.webp" className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105" alt="Gallery 011" />
                        </motion.div>
                    </div>

                    {/* Column 2 - 2 Images (Top normal, bottom tall) */}
                    <div className="flex flex-col gap-4">
                        <motion.div variants={fadeInUp} className="group overflow-hidden rounded-lg shadow-lg">
                            <img src="/home/menu/MATERIAL_012.webp" className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105" alt="Gallery 012" />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="group overflow-hidden rounded-lg shadow-lg">
                            <img src="/home/menu/MATERIAL_013.webp" className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105" alt="Gallery 013" />
                        </motion.div>
                    </div>

                    {/* Column 3 - 2 Images */}
                    <div className="flex flex-col gap-4">
                        <motion.div variants={fadeInUp} className="group overflow-hidden rounded-lg shadow-lg">
                            <img src="/home/menu/MATERIAL_014.webp" className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105" alt="Gallery 014" />
                        </motion.div>
                        <motion.div variants={fadeInUp} className="group overflow-hidden rounded-lg shadow-lg">
                            <img src="/home/menu/MATERIAL_015.webp" className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105" alt="Gallery 015" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Mobile: Carousel Layout */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="block md:hidden relative"
                >
                    <div
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto px-4 pb-8 snap-x items-center scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {GALLERY_IMAGES.map((src, i) => (
                            <motion.div
                                key={i}
                                className="flex-none w-[280px] h-[350px] relative snap-center"
                            >
                                <img
                                    src={src}
                                    className="w-full h-full object-cover shadow-lg rounded-lg"
                                    alt={`Gallery Mobile ${i + 1}`}
                                />
                            </motion.div>
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-center gap-6 mt-4">
                        <button
                            onClick={() => scroll('left')}
                            className="w-10 h-10 rounded-full border border-[#09C9CB]/30 bg-white text-[#09C9CB] hover:bg-[#09C9CB]/5 flex items-center justify-center transition-all shadow-sm"
                        >
                            <IconArrowLeft size={18} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-10 h-10 rounded-full border border-[#09C9CB]/30 bg-white text-[#09C9CB] hover:bg-[#09C9CB]/5 flex items-center justify-center transition-all shadow-sm"
                        >
                            <IconArrowRight size={18} />
                        </button>
                    </div>
                </motion.div>



            </div>



            <MenuModal 
                isOpen={showMenuModal} 
                onClose={() => setShowMenuModal(false)} 
                pdfUrl={MENU_IMAGE} 
            />
        </section>
    );
};



export default RestaurantInfo;

const GALLERY_IMAGES = [
    "/home/menu/MATERIAL_009.webp",
    "/home/menu/MATERIAL_010.webp",
    "/home/menu/MATERIAL_011.webp",
    "/home/menu/MATERIAL_012.webp",
    "/home/menu/MATERIAL_013.webp",
    "/home/menu/MATERIAL_014.webp",

    "/home/menu/MATERIAL_015.webp"

];
