import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface LoadingScreenProps {
    onFinished: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinished }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
        if (!isImageLoaded) return;

        // Show loading screen for a brief period AFTER image load, then animate out
        const timer = setTimeout(() => {
            setIsVisible(false);
            // Wait for animation to finish before removing from DOM
            setTimeout(onFinished, 1000); // 1s matches the transition duration
        }, 900); // Show for 0.9 seconds

        return () => clearTimeout(timer);
    }, [onFinished, isImageLoaded]);

    return (
        <div
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-transform duration-1000 ease-[cubic-bezier(0.7,0,0.3,1)] ${isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/img/Loader.webp"
                    alt="Loading Background"
                    fill
                    priority
                    sizes="100vw"
                    className={`object-cover transition-opacity duration-700 ${isImageLoaded ? 'opacity-60' : 'opacity-0'}`}
                    onLoad={() => setIsImageLoaded(true)}
                />
                <div className="absolute inset-0 bg-black/30"></div>
            </div>

            {/* Water Flow Animation Container */}
            <div className={`relative z-10 flex flex-col items-center w-full transition-opacity duration-700 ${isImageLoaded ? 'animate-[waterFlow_8s_ease-in-out_infinite] opacity-100' : 'opacity-0'}`}>
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

            <style>{`
                @keyframes waterFlow {
                    0% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(5px, 5px) rotate(1deg); }
                    50% { transform: translate(0, 10px) rotate(0deg); }
                    75% { transform: translate(-5px, 5px) rotate(-1deg); }
                    100% { transform: translate(0, 0) rotate(0deg); }
                }
            `}</style>



        </div>
    );
};
