import { SpaceType } from '@/types';
import { IconUmbrella, IconPool, IconArmchair } from '@tabler/icons-react';
import React from 'react';

export const ZONES = [
    {
        id: 'palapa' as SpaceType,
        title: 'Zona Playa',
        desc: 'Sombra rústica frente al mar. Ideal para relajarse.',
        icon: React.createElement(IconUmbrella, { size: 40, className: "text-white" }),
        color: 'bg-amber-400',
        textColor: 'text-amber-500',
        image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'alberca' as SpaceType,
        title: 'Zona Alberca',
        desc: 'Ambiente social y refrescante. El centro de la acción.',
        icon: React.createElement(IconPool, { size: 40, className: "text-white" }),
        color: 'bg-sky-400',
        textColor: 'text-sky-500',
        image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'lounge' as SpaceType,
        title: ' ZONA LOUNGE VIP',
        desc: 'Comodidad superior con servicio exclusivo.',
        icon: React.createElement(IconArmchair, { size: 40, className: "text-white" }),
        color: 'bg-rose-400',
        textColor: 'text-rose-500',
        image: 'https://images.unsplash.com/photo-1561501900-3701fa6a0864?auto=format&fit=crop&w=800&q=80'
    },
];

export const HOURS = Array.from({ length: 11 }, (_, i) => 9 + i); // 9 am to 7 pm

export const EXISTING_BOOKINGS = [
    // Palapas
    { id: 'mock1', targetId: 'P1', date: new Date().toISOString().split('T')[0], checkIn: '10:00', checkOut: '14:00', status: 'confirmed' },
    { id: 'mock2', targetId: 'P5', date: new Date().toISOString().split('T')[0], checkIn: '12:00', checkOut: '16:00', status: 'confirmed' },
    { id: 'mock3', targetId: 'P15', date: new Date().toISOString().split('T')[0], checkIn: '09:00', checkOut: '11:00', status: 'confirmed' },

    // Alberca
    { id: 'mock4', targetId: 'A1', date: new Date().toISOString().split('T')[0], checkIn: '11:00', checkOut: '15:00', status: 'confirmed' },
    { id: 'mock5', targetId: 'A3', date: new Date().toISOString().split('T')[0], checkIn: '10:00', checkOut: '18:00', status: 'confirmed' },

    // Lounge
    { id: 'mock6', targetId: 'L1', date: new Date().toISOString().split('T')[0], checkIn: '13:00', checkOut: '17:00', status: 'confirmed' },
    { id: 'mock7', targetId: 'L2', date: new Date().toISOString().split('T')[0], checkIn: '09:00', checkOut: '19:00', status: 'confirmed' },
];
