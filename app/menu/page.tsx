'use client';

import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import RestaurantInfo from './components/RestaurantInfo';



export default function MenuPage() {
    return (
        <div className="bg-white min-h-screen flex flex-col font-sans antialiased text-slate-900">
            {/* Page Header (Hero Style) */}
            <PageHeader
                title="TÚ LO MERECES"
                subtitle="SABOREA VERACRUZ:"
                description="Es hora de consentir tu paladar."
                image="/home/menu/MATERIAL_006.webp"
                objectFitClass="object-cover lg:object-fill origin-bottom"
                height='h-[70vh] md:h-[75vh] lg:h-[90vh]'

            />

            <RestaurantInfo />

        </div>
    );
}
