import React, { useRef, useEffect } from 'react';

import Image from 'next/image';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandWhatsapp,
} from '@tabler/icons-react';

interface HeroSectionProps {
  // setView removed
}

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.8;
    }
  }, []);

  return (
    <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-900 font-principal">

      {/* 1. VIDEOS DE FONDO DINÁMICOS */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60 transition-opacity duration-1000"
        >
          <source src="/home/Header.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="absolute top-32 md:top-48 left-0 w-full px-6 md:px-12 flex flex-col items-start z-20 gap-6 md:gap-8">



        <div className="flex flex-col gap-4 md:gap-6 pl-3">
          <SocialLink href="https://www.facebook.com/share/1UMyw3MZeD/?mibextid=wwXIfr" label="Facebook">
            <IconBrandFacebook className="w-6 h-6 md:w-8 md:h-8" stroke={1.5} />
          </SocialLink>
          <SocialLink href="https://www.instagram.com/pelicanos.beachclub?igsh=MTV5c2tldzRrajRwMg==" label="Instagram">
            <IconBrandInstagram className="w-6 h-6 md:w-8 md:h-8" stroke={1.5} />
          </SocialLink>
          <SocialLink href="https://www.tiktok.com/@pelicanosbeachclub?_r=1&_t=ZS-946wbZE0P81" label="TikTok">
            <IconBrandTiktok className="w-6 h-6 md:w-8 md:h-8" stroke={1.5} />
          </SocialLink>
          <SocialLink href="https://wa.me/522971193688" label="WhatsApp">
            <IconBrandWhatsapp className="w-6 h-6 md:w-8 md:h-8" stroke={1.5} />
          </SocialLink>
        </div>

      </div>



      {/* 4. Contenido Central (Logo y Título) */}
      <div className="relative mt-[20vh] md:mt-[15vh] z-10 flex flex-col items-center w-full select-none pb-10">
        <div className="w-[115%] md:w-full lg:w-full lg:max-w-4xl px-0 md:px-4 opacity-90">
          <Image
            src="/home/hero/seccionhero.webp"
            alt="Pelícanos Beach Club"
            width={1600}
            height={800}
            className="w-full h-auto drop-shadow-lg"
            draggable="false"
            priority
          />
        </div>
      </div>

      {/* 5. Imagen Inferior (Arena) */}
      <div className="absolute bottom-0 w-full z-20 pointer-events-none select-none leading-none">
        <img
          src="/home/mockup_sup.webp"
          alt="Detalle Arena"
          className="w-full h-auto object-cover object-bottom block origin-bottom"
          draggable="false"
        />
      </div>
    </section>
  );
};

// Componente auxiliar para los links
const SocialLink = ({ href, label, children }: { href: string; label: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-white opacity-60 hover:opacity-100 transition-all hover:scale-110 duration-300 block"
    aria-label={label}
  >
    {children}
  </a>
);