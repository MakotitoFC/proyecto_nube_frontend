import React, { useState } from 'react';
import { ArrowRight } from '../ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';

export const TestimonialsSection: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      quote: "El lugar irradia serenidad, pero también una chispeante sensación de placer y posibilidad. Un verdadero paraíso escondido que supera todas las expectativas",
      source: "Cliente Frecuente"
    },
    {
      quote: "Una clase magistral de lujo descalzo. Logra ser increíblemente chic y a la vez totalmente libre de pretensiones",
      source: "BEACH LOVER"
    },
    {
      quote: "El secreto mejor guardado de Veracruz. Un escondite que te recuerda lo que se siente desconectarse verdaderamente del mundo",
      source: "HUÉSPED SATISFECHO"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Máscara con ondas curvas suaves en los 4 lados (muy sutil)
  const CARD_MASK = `data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
    <path d="
      M 0 0 
      Q 250 20, 500 0 
      Q 750 -20, 1000 0 
      L 1000 1000 
      Q 750 980, 500 1000 
      Q 250 1020, 0 1000 
      L 0 0 Z" 
      fill="black"/>
  </svg>`;

  return (
    <section className="relative z-40 py-32 overflow-hidden bg-teal-900">
      {/* Fondo de playa */}
      <div className="absolute inset-0 opacity-80">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          src="/img/Loader.webp"
          className="w-full h-full object-cover"
          alt="Beach water"
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            maskImage: `url('${CARD_MASK}')`,
            WebkitMaskImage: `url('${CARD_MASK}')`,
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat'
          }}
          className="bg-[#f4f1ea] p-12 md:p-24 shadow-2xl transform -rotate-1 mx-auto max-w-4xl text-center"
        >
          <span className="text-[15px] font-extrabold tracking-[0.3em] uppercase text-[#3a7ca5] block font-principal">
            Reseñas
          </span>

          <div className="py-10 flex items-center justify-center min-h-[200px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <h3 className="text-base md:text-2xl font-principal uppercase font-medium italic text-gray-500 leading-relaxed mb-8">
                  "{testimonials[currentTestimonial].quote}".
                </h3>
                <p className="font-principal font-bold text-slate-500 text-sm tracking-widest uppercase">
                  {testimonials[currentTestimonial].source}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center gap-6">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border bg-[#3a7ca5] hover:bg-[#347096] text-white flex items-center justify-center transition-all"
            >
              <ArrowRight className="transform rotate-180" size={20} />
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border bg-[#3a7ca5] hover:bg-[#347096] text-white flex items-center justify-center transition-all"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};