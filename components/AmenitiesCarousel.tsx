'use client';

import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface Amenity {
    icon: React.ReactNode;
    label: string;
    sub: string;
}

interface AmenitiesCarouselProps {
    amenities: Amenity[];
    title?: string;
    className?: string;
}

const SCROLL_AMOUNT = 300;

function AmenityItem({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <div className="min-w-[100px] md:min-w-[110px] lg:min-w-[140px] px-2 md:px-3 lg:px-4 flex flex-col items-center text-center gap-2 md:gap-3 shrink-0 snap-start">
            <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center text-black">
                <div className="scale-75 md:scale-100 flex items-center justify-center">
                    {icon}
                </div>
            </div>
            <div>
                <p className="font-bold text-slate-800 text-xs md:text-sm leading-tight">{label}</p>
            </div>
        </div>
    );
}

export default function AmenitiesCarousel({ amenities, title = "Amenidades Premium", className = "" }: AmenitiesCarouselProps) {
    const carousel = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const x = useMotionValue(0);

    useEffect(() => {
        if (carousel.current) {
            setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
        }
    }, [amenities]);

    return (
        <div className={`space-y-4 md:space-y-8 rounded-[40px] relative pb-4 ${className}`}>
            <div className="pb-1">
                <h3 className="text-2xl font-bold text-slate-900 font-tertiary">{title}</h3>
            </div>

            <div className="relative group px-8 md:px-10 lg:px-12">
                <button
                    onClick={() => {
                        const newX = Math.min(x.get() + SCROLL_AMOUNT, 0);
                        animate(x, newX, { type: "spring", stiffness: 300, damping: 30 });
                    }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 text-black transition-opacity disabled:opacity-0"
                >
                    <IconChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
                </button>

                <motion.div ref={carousel} className="cursor-grab overflow-hidden">
                    <motion.div
                        drag="x"
                        dragConstraints={{ right: 0, left: -width }}
                        style={{ x }}
                        className="flex gap-4 py-4"
                    >
                        {amenities.map((item, index) => (
                            <AmenityItem key={index} icon={item.icon} label={item.label} />
                        ))}
                    </motion.div>
                </motion.div>

                <button
                    onClick={() => {
                        const newX = Math.max(x.get() - SCROLL_AMOUNT, -width);
                        animate(x, newX, { type: "spring", stiffness: 300, damping: 30 });
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 text-black transition-opacity"
                >
                    <IconChevronRight className="w-6 h-6 md:w-8 md:h-8" />
                </button>
            </div>
        </div>
    );
}
