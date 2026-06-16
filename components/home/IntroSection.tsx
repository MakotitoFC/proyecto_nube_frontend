import React, { useRef } from 'react';
import { motion, Variants } from 'framer-motion';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';

export const IntroSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const carouselImages = [
    { src: "/home/introsection/MATERIAL_C1.webp", rotate: 'rotate-2', z: 10 },
    { src: "/home/introsection/MATERIAL_C2.webp", rotate: '-rotate-1', z: 20 },
    { src: "/home/introsection/MATERIAL_C3.webp", rotate: 'rotate-3', z: 10 },
    { src: "/home/introsection/MATERIAL_C4.webp", rotate: '-rotate-2', z: 10 },
    { src: "/home/introsection/MATERIAL_C6.webp", rotate: 'rotate-1', z: 20 },
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = window.innerWidth < 768 ? 300 : 500;
      if (direction === 'left') {
        current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

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

  return (
    <section className="relative w-full bg-[#fcfaf7] overflow-hidden pb-15">
      <div className="absolute  w-full z-20 pointer-events-none select-none leading-none">
        <img
          src="/home/mockup_inf.webp"
          alt="Detalle Arena"
          className="w-full h-auto object-cover object-bottom block origin-bottom"
          draggable="false"
        />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl mt-30 md:pt-24 mx-auto px-6 mb-16 text-center"
      >
        <motion.h4 variants={fadeInUp} className="font-principal uppercase tracking-[0.3em] text-xs md:text-sm font-bold text-gray-800 mb-2">
          SOBREVUELA EL GOLFO DE MÉXICO:
        </motion.h4>
        <motion.h3 variants={fadeInUp} className="text-3xl md:text-7xl font-tertiary font-light uppercase text-[#3a7ca5] leading-none mb-6">
          <span className="font-light text-gray-800">#</span>
          <span className="font-light text-gray-800">AMARÁS</span>
          <span className="font-light text-[#6ADCD5]">VERACRUZ</span>
        </motion.h3>
        <motion.p variants={fadeInUp} className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-gray-500 mb-8 block font-principal max-w-4xl mx-auto leading-loose">
          AMARÁS EL PRIMER CONTACTO DEL MAR EN TU PIEL. LAS VISTAS DEL HORIZONTE INFINITO. EL SONIDO DE LAS OLAS BESANDO LA ORILLA. AMARÁS DESCUBRIR LOS SABORES DE NUESTRA COCINA. CADA AMANECER, CADA MOMENTO, CADA TOQUE DE LUJO. AMARÁS CREAR RECUERDOS JUNTOS, Y AMARÁS QUE TODO ESTÉ DISEÑADO PARA TI.
        </motion.p>
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
          ref={scrollRef}
          className="flex gap-12 overflow-x-auto px-12 md:px-24 pb-12 snap-x items-center scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {carouselImages.map((img, i) => (
            // Se quitó 'hover:scale', 'group' y estilos internos
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`flex-none w-[300px] md:w-[400px] h-[350px] md:h-[450px] relative ${img.rotate}`}
            >
              <img
                src={img.src}
                className="w-full h-full object-cover shadow-lg rounded-sm"
                alt="Atmosphere"
              />
            </motion.div>
          ))}
          <div className="flex-none w-12"></div>
        </div>

        {/* Navegación del carrusel */}
        <div className="flex justify-center gap-6 mt-4">
          <button
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full border bg-[#3a7ca5] hover:bg-[#347096] text-white flex items-center justify-center transition-all"
          >
            <IconArrowLeft size={20} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full border bg-[#3a7ca5] hover:bg-[#347096] text-white flex items-center justify-center transition-all"
          >
            <IconArrowRight size={20} />
          </button>
        </div>
      </motion.div>
    </section>
  );
};