'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { IconMenu2, IconX } from '@tabler/icons-react';

interface NavigationProps {
  // currentView prop removed as we use usePathname
}

export const Navigation: React.FC<NavigationProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const pathname = usePathname();
  // Logic for hiding navigation moved to SiteLayout

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);



  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Beach Club', href: '/beach-club' },
    { label: 'Hospedaje', href: '/hospedaje' },
    { label: 'Menú', href: '/menu' },
  ];

  // Determine transparency: Always transparent initially, white when scrolled or mobile menu open
  // User requested transparent by default on all tabs (routes)
  const isTransparent = !isScrolled && !isMobileMenuOpen;
  const textColor = isTransparent ? 'text-white' : 'text-slate-900';
  const borderColor = isTransparent ? 'border-white' : 'border-slate-800';

  // Texto que se repetirá
  const marqueeParts = ["SOLO ADULTOS (+18)", "RESERVA TU LUGAR"];

  return (
    <header className="fixed top-0 left-0 w-full z-100 flex flex-col font-principal select-none">

      {/* Estilos para la animación infinita */}
      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        .animate-infinite {
          animation: infinite-scroll 40s linear infinite;
        }
      `}</style>

      <div
        className={`w-full bg-[#09C9CB] overflow-hidden z-[70] transition-all duration-500 ease-in-out flex flex-col justify-center ${isScrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'
          }`}
      >
        <div className="flex w-full items-center">
          <div className="flex animate-infinite whitespace-nowrap">
            {[...Array(4)].map((_, i) => (
              <div key={`a-${i}`} className="flex items-center">
                {marqueeParts.map((part, index) => (
                  <React.Fragment key={index}>
                    <span className="text-white text-[10px] md:text-[15px] font-principal font-semibold tracking-[0.4em] md:tracking-[0.6em] uppercase px-8">
                      {part}
                    </span>
                    <span className="text-white text-[10px] md:text-[15px] font-principal font-semibold tracking-normal uppercase">
                      •
                    </span>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>

          <div className="flex animate-infinite whitespace-nowrap">
            {[...Array(4)].map((_, i) => (
              <div key={`b-${i}`} className="flex items-center">
                {marqueeParts.map((part, index) => (
                  <React.Fragment key={index}>
                    <span className="text-white text-[10px] md:text-[15px] font-principal font-semibold tracking-[0.4em] md:tracking-[0.6em] uppercase px-8">
                      {part}
                    </span>
                    <span className="text-white text-[10px] md:text-[15px] font-principal font-semibold tracking-normal uppercase">
                      •
                    </span>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>

        </div>
      </div>

      <nav
        className={`w-full z-[60] transition-all duration-500 px-6 md:px-12 flex justify-between items-center ${isScrolled ? 'py-2' : 'py-3 md:py-5'
          } ${isScrolled || !isTransparent
            ? 'bg-white/95 backdrop-blur-sm shadow-sm'
            : 'bg-transparent'
          }`}
      >
        <Link
          href="/"
          className="cursor-pointer flex items-center gap-3 group"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Image
            src={isTransparent ? "/home/logo_white.webp" : "/home/logo_black.webp"}
            alt="Logo Pelícanos"
            width={200}
            height={200}
            className={`h-auto object-contain transition-all ${isScrolled ? 'w-16 md:w-24' : 'w-20 md:w-32'
              }`}
            draggable="false" // Prevent ghost image dragging
          />
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-all hover:opacity-60 relative group ${textColor}`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-[2px] transition-all duration-300 bg-[#6ADCD5]
                    ${!isTransparent && isActive ? 'w-full' : 'w-0'} 
                    ${!isTransparent ? 'group-hover:w-full' : ''}`}
                ></span>
              </Link>
            );
          })}

        </div>

        <button
          className={`md:hidden transition-colors ${textColor}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <IconX size={28} stroke={1.5} /> : <IconMenu2 size={28} stroke={1.5} />}
        </button>
      </nav>

      {/* OVERLAY y MENU MÓVIL */}
      <div
        className={`fixed inset-0 bg-black/60 z-[90] transition-opacity duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 w-[80%] max-w-sm z-[100] flex flex-col items-center justify-center gap-10 transition-transform duration-500 ease-in-out md:hidden shadow-2xl bg-black ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <Image
          src="/img/Loader.webp"
          alt="Loading Background"
          fill
          priority
          sizes="100vw"
          className={`object-cover transition-opacity duration-700 -z-10 ${isImageLoaded ? 'opacity-80' : 'opacity-0'}`}
          onLoad={() => setIsImageLoaded(true)}
        />
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <IconX size={24} stroke={1.5} />
        </button>
        <div className="flex flex-col gap-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-2xl font-extrabold text-white uppercase tracking-widest hover:text-[#09C9CB] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="absolute bottom-12 opacity-80 flex flex-col items-center">
          <span className="text-[9px] font-extrabold tracking-[0.4em] uppercase text-gray-200 font-principal mb-1">
            Veracruz
          </span>
          <span className="font-secundaria text-2xl text-[#09C9CB] capitalize">
            playa zapote
          </span>
        </div>
      </div>
    </header>
  );
};