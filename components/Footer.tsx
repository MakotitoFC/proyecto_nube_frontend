"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconBrandInstagram, IconBrandFacebook, IconBrandTiktok, IconBrandWhatsapp, IconUser } from '@tabler/icons-react';
import Image from 'next/image';

export const Footer: React.FC = () => {
  const pathname = usePathname();
  // Logic for hiding footer moved to SiteLayout


  return (
    <footer className="relative w-full bg-slate-900 text-white overflow-hidden flex flex-col justify-between">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=2000&q=80"
          className="w-full h-full object-cover opacity-20 grayscale"
          alt="Beach lifestyle"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/50 to-slate-900/80"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 pt-20 px-8 md:px-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">

          {/* Column 1: Address & Contact */}
          <div className="md:col-span-1 space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-principal font-medium text-slate-300">Calle Av. de los Pescadores, Calle 5</p>
              <p className="text-sm font-principal font-medium text-slate-300">Playa Zapote, 95263 | El Zapote, Ver.</p>
            </div>
            <div>
              <p className="text-lg font-semibold font-principal tracking-tight mb-2"> +52 297 119 3688</p>
              <a href="mailto:hola@pelicanosbeachclub.com" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                hola@pelicanosbeachclub.com
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold font-principal uppercase tracking-widest text-white mb-6">
              Explorar
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors w-fit"
              >
                Home
              </Link>
              <Link
                href="/beach-club"
                className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors w-fit"
              >
                Beach Club
              </Link>
              <Link
                href="/hospedaje"
                className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors w-fit"
              >
                Hospedaje
              </Link>
              <Link
                href="/menu"
                className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors w-fit"
              >
                Menú
              </Link>
            </div>
          </div>

          {/* Column 3: Legal & Info */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-extrabold font-principal uppercase tracking-widest text-white mb-6">
              Legal
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                href="/privacy-policy"
                className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors w-fit"
              >
                POLÍTICA DE PRIVACIDAD
              </Link>
              <Link
                href="/terms-and-conditions"
                className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors w-fit"
              >
                TÉRMINOS Y CONDICIONES
              </Link>
              <Link
                href="/cookie-policy"
                className="text-left text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors w-fit"
              >
                POLÍTICA DE COOKIES
              </Link>
            </div>
          </div>

          {/* Column 4: Socials */}
          <div className="flex flex-col gap-6 items-center md:items-end">
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/pelicanos.beachclub?igsh=MTV5c2tldzRrajRwMg=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all text-white"
              >
                <IconBrandInstagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/share/1UMyw3MZeD/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all text-white"
              >
                <IconBrandFacebook size={18} />
              </a>
              <a
                href="https://www.tiktok.com/@pelicanosbeachclub?_r=1&_t=ZS-946wbZE0P81"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all text-white"
              >
                <IconBrandTiktok size={18} />
              </a>
              <a
                href="https://wa.me/522971193688"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-[#25D366] transition-all text-white"
              >
                <IconBrandWhatsapp size={18} />
              </a>
            </div>
            <p className="text-left text-xs font-bold uppercase tracking-widest text-slate-400">
              VERACRUZ, MÉXICO
            </p>
            <div className="w-24 md:w-40 mb-6 opacity-90">
              <Image
                src="/home/logo_white.webp"
                alt="Logo Pelícanos"
                width={200}
                height={200}
                className="w-full h-auto"
                draggable="false"
              />
            </div>
          </div>
        </div>

        {/* BIG MONUMENTAL TEXT CONTAINER */}
        <div className="relative z-10 w-full select-none opacity-100 text-white pb-8">
          <svg viewBox="0 0 130 24" className="w-full h-auto block">
            <text x="50%" y="80%" textAnchor="middle" fill="currentColor" className="font-principal font-black tracking-tighter" fontSize="20">
              PELÍCANOS
            </text>
          </svg>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-medium uppercase tracking-widest">
          <p>© 2026 PELÍCANOS BEACH CLUB | ALL RIGHTS RESERVED</p>
          <div className="flex items-center gap-2 group/admin">
            <Link href="/panel" className="text-slate-500 hover:text-white transition-all">
              <IconUser size={12} />
            </Link>
            <p>POWERED BY DALAMBO</p>
          </div>
        </div>
      </div>
    </footer>
  );
};