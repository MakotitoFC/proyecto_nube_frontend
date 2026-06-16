import React, { useRef, useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { IconPlayerPlayFilled } from '@tabler/icons-react';

const VideoCard = ({ src, rotate, title, index, poster }: { src: string, rotate: string, title: string, index: number, poster: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`flex-none w-[85vw] max-w-[340px] md:w-[450px] lg:w-[480px] flex flex-col items-center snap-center shrink-0 ${rotate}`}
        >
            <div
                className="relative w-full h-[450px] md:h-[600px] group cursor-pointer rounded-xl overflow-hidden shadow-2xl bg-gray-200"
                onClick={togglePlay}
            >
                {src ? (
                    <>
                        <video
                            ref={videoRef}
                            src={src}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loop
                            muted
                            playsInline
                            preload="metadata"
                        />
                        {/* Play Overlay */}
                        <div className={`absolute inset-0 flex items-center justify-center bg-black/10 transition-all duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                            <div className="bg-white/20 backdrop-blur-md p-6 rounded-full shadow-2xl border border-white/50 transform transition-transform group-hover:scale-110">
                                <IconPlayerPlayFilled className="text-white w-8 h-8 md:w-12 md:h-12 ml-1" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center animate-pulse">
                        <div className="w-12 h-12 bg-gray-300 rounded-full" />
                    </div>
                )}
            </div>

            <div className="mt-8 text-center">
                <p className="text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase text-gray-400 block font-principal">
                    {title}
                </p>
            </div>
        </motion.div>
    );
};

export const BeachClubIntro: React.FC = () => {

    const apiUrl = process.env.NEXT_PUBLIC_API_BACK_URL || 'http://localhost:4000';

    const carouselImages = [
        { 
            src: `${apiUrl}/minio/view/${encodeURIComponent("Zona Playa.webm")}`, 
            rotate: 'rotate-2', 
            z: 10, 
            title: "ZONA PLAYA", 
            poster: "/home/beach-club/mock/Playa_1.webp" 
        },
        { 
            src: `${apiUrl}/minio/view/${encodeURIComponent("Zona Alberca.webm")}`, 
            rotate: '-rotate-1', 
            z: 20, 
            title: "ZONA ALBERCA", 
            poster: "/home/beach-club/mock/Alberca_1.webp" 
        },
        { 
            src: `${apiUrl}/minio/view/${encodeURIComponent("Zona Lounge.webm")}`, 
            rotate: 'rotate-3', 
            z: 10, 
            title: "ZONA LOUNGE VIP", 
            poster: "/home/beach-club/mock/Lounge_1.webp" 
        },
    ];
    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1
            }
        }
    };

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <section className="relative w-full bg-[#fcfaf7] overflow-hidden ">


            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className=" mt-8 mx-1 lg:mx-4 px-4 mb-16 text-start"
            >
                <motion.h4 variants={fadeInUp} className="text-3xl font-bold text-slate-900 font-tertiary">
                    Descubre tu espacio
                </motion.h4>

                <motion.p variants={fadeInUp} className="text-slate-500 text-sm mt-1">
                    Explora nuestras tres áreas
                    exclusivas                </motion.p>
            </motion.div>




            {/* Carrusel */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative pb-16"
            >
                <div className="absolute left-0 top-0 h-full w-12 bg-linear-to-r from-[#fcfaf7] to-transparent z-30 pointer-events-none"></div>
                <div className="absolute right-0 top-0 h-full w-12 bg-linear-to-l from-[#fcfaf7] to-transparent z-30 pointer-events-none"></div>

                <div
                    className="flex overflow-x-auto snap-x snap-mandatory gap-8 px-6 pb-12 items-center lg:flex-wrap lg:justify-center scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {carouselImages.map((img, i) => (
                        <VideoCard key={i} {...img} index={i} />
                    ))}
                </div>
            </motion.div>
        </section>
    );
};