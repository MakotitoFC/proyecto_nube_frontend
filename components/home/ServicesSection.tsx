import Link from 'next/link';
import { ViewState } from '@/types';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

interface ServiceContent {
  id: ViewState;
  tagline: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  alignRight?: boolean;
  href: string; // Add href
}

const SERVICES_DATA: ServiceContent[] = [
  {
    id: 'beach-club',
    tagline: 'Experiencia Diurna',
    title: 'BEACH CLUB',
    description: 'Palapas privadas, alberca, zona lounge y el mejor servicio de playa en Veracruz. Explora el mapa y selecciona tu espacio.',
    image: '/home/services/MATERIAL_001.webp',
    buttonText: 'RESERVA AHORA',
    href: '/beach-club',
  },
  {
    id: 'hospedaje',
    tagline: 'Descanso Absoluto',
    title: 'HOSPEDAJE',
    description: '12 habitaciones diseñadas para la desconexión total, con el máximo confort. Despierta con el sonido del mar y vistas inigualables.',
    image: '/home/services/MATERIAL_002.webp',
    buttonText: 'Ver Disponibilidad',
    href: '/hospedaje',
  },
  {
    id: 'menu',
    tagline: 'SABORES ÚNICOS',
    title: 'DRINK & GASTRO',
    description: 'Mixología de primer nivel y cocina fusión, con una propuesta honesta inspirada en la pesca del día y productos auténticos de la región.',
    image: '/home/services/MATERIAL_003.webp',
    buttonText: 'Ver Menú',
    href: '/menu',
  },
];

const TOP_MASKS_DESKTOP = [
  `data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 1200 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 100 L0 4 Q150 2 300 4 Q450 6 600 4 Q750 2 900 4 Q1050 6 1200 4 L1200 100 Z" fill="black"/></svg>`,
  `data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 1200 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 100 L0 5 Q150 3 300 5 Q450 7 600 5 Q750 3 900 5 Q1050 7 1200 5 L1200 100 Z" fill="black"/></svg>`,
  `data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 1200 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 100 L0 3 Q150 1 300 3 Q450 5 600 3 Q750 1 900 3 Q1050 5 1200 3 L1200 100 Z" fill="black"/></svg>`
];

const TOP_MASKS_MOBILE = [
  `data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 1200 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 100 L0 4 Q400 2 800 4 Q1200 6 1200 4 L1200 100 Z" fill="black"/></svg>`,
  `data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 1200 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 100 L0 5 Q400 3 800 5 Q1200 7 1200 5 L1200 100 Z" fill="black"/></svg>`,
  `data:image/svg+xml;utf8,<svg preserveAspectRatio="none" viewBox="0 0 1200 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 100 L0 3 Q400 1 800 3 Q1200 5 1200 3 L1200 100 Z" fill="black"/></svg>`
];

interface ServicesSectionProps { } // Restoring interface

export const ServicesSection: React.FC<ServicesSectionProps> = () => {
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 40 },
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
    <div className="relative w-full pb-[100vh]">
      {SERVICES_DATA.map((service, index) => {
        return (
          <section
            key={service.id}
            style={{
              zIndex: (index + 1) * 10,
              marginTop: '-2vh', // Reduced overlap since amplitude is tiny
            }}
            className={`sticky top-0 h-screen w-full flex items-center px-6 md:px-24 overflow-hidden border-t-0 group ${service.alignRight ? 'justify-end' : 'justify-start'} service-mask-${index}`}
          >
            <div className="absolute inset-0 overflow-hidden">
              {service.image.endsWith('.mp4') ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src={service.image} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={service.image}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="object-cover transition-transform duration-[20s] ease-linear"
                  alt={service.title}
                />
              )}
              <div className="absolute inset-0 bg-black/40 transition-colors duration-700 "></div>
            </div>

            {/* Content with Staggered Fade Up Animation */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className={`relative z-10 text-white max-w-2xl ${service.alignRight ? 'text-right' : 'text-left'
                }`}
            >
              <motion.span
                variants={fadeInUp}
                className="text-[10px] md:text-[15px] font-principal font-medium tracking-[0.3em] md:tracking-[0.5em] uppercase mb-4 block"
              >
                {service.tagline}
              </motion.span>
              <motion.h2
                variants={fadeInUp}
                className="text-3xl md:text-6xl lg:text-8xl font-extrabold font-principal tracking-tight mb-6 leading-none"
              >
                {service.title}
              </motion.h2>
              <motion.p
                variants={fadeInUp}
                className={`text-lg mb-10 font-principal font-medium leading-relaxed max-w-3xl ${service.alignRight ? 'ml-auto' : ''
                  }`}
              >
                {service.description}
              </motion.p>
              <Link href={service.href} passHref>
                <motion.button
                  variants={fadeInUp}
                  className="bg-white text-slate-900 px-10 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all shadow-xl  hover:text-zinc-900 hover:scale-105"
                >
                  {service.buttonText}
                </motion.button>
              </Link>
            </motion.div>
          </section>
        );
      })}
      <style>{`
        /* Generate dynamic mask classes for responsiveness */
        ${SERVICES_DATA.map((_, i) => `
          .service-mask-${i} {
             mask-image: url('${TOP_MASKS_MOBILE[i % 3]}');
             -webkit-mask-image: url('${TOP_MASKS_MOBILE[i % 3]}');
             mask-size: 100% 100%;
             -webkit-mask-size: 100% 100%;
             mask-repeat: no-repeat;
             -webkit-mask-repeat: no-repeat;
          }
          @media (min-width: 1024px) {
            .service-mask-${i} {
              mask-image: url('${TOP_MASKS_DESKTOP[i % 3]}');
              -webkit-mask-image: url('${TOP_MASKS_DESKTOP[i % 3]}');
            }
          }
        `).join('')}

      `}</style>
    </div>
  );
};