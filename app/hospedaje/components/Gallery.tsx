'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
    {
        id: 1,
        src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1548&q=80",
        alt: "Main Bedroom",
        category: "Suite"
    },
    {
        id: 2,
        src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        alt: "Room View",
        category: "Interior"
    },

    {
        id: 3,
        src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        alt: "Another View",
        category: "Bathroom"
    },
    {
        id: 4,
        src: "https://images.unsplash.com/photo-1631049552057-403cdb8f0658?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
        alt: "Detail 2",
        category: "Amenities"
    },

    {
        id: 5,
        src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=2070",
        alt: "Lounge",
        category: "Common Area"
    }
];

const Gallery = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prevIndex) => (prevIndex + newDirection + images.length) % images.length);
    };

    return (
        <div className="relative w-full h-[300px] md:h-[500px] lg:h-[600px] overflow-hidden  group">
            <AnimatePresence initial={false} custom={direction}>
                <motion.img
                    key={currentIndex}
                    src={images[currentIndex].src}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={1}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = swipePower(offset.x, velocity.x);

                        if (swipe < -swipeConfidenceThreshold) {
                            paginate(1);
                        } else if (swipe > swipeConfidenceThreshold) {
                            paginate(-1);
                        }
                    }}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt={images[currentIndex].alt}
                />
            </AnimatePresence>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/50 pointer-events-none z-10" />

            {/* Navigation Arrows */}
            <div className="absolute inset-0 flex items-center justify-between p-0 pointer-events-none z-20">
                <button
                    className="h-16 w-10 flex items-center justify-center rounded-none bg-black/30 text-white hover:bg-black/50 transition-colors backdrop-blur-sm pointer-events-auto"
                    onClick={() => paginate(-1)}
                >
                    <ChevronLeft size={24} className="md:w-8 md:h-8" />
                </button>
                <button
                    className="h-16 w-10 flex items-center justify-center rounded-none bg-black/30 text-white hover:bg-black/50 transition-colors backdrop-blur-sm pointer-events-auto"
                    onClick={() => paginate(1)}
                >
                    <ChevronRight size={24} className="md:w-8 md:h-8" />
                </button>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-0 right-0 bg-black/50 text-white px-3 py-1 rounded-none text-sm font-medium backdrop-blur-md pointer-events-none z-20">
                {currentIndex + 1} / {images.length}
            </div>

            {/* Optional Category Label */}
            <div className="absolute top-0 left-0 bg-black/50 text-white px-4 py-2 text-lg md:text-xl font-medium backdrop-blur-md pointer-events-none z-20">
                {images[currentIndex].alt}
                <span className="block text-xs md:text-sm font-light opacity-80 uppercase tracking-wider">{images[currentIndex].category}</span>
            </div>
        </div>
    );
};

export default Gallery;
