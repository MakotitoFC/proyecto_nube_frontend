import React from 'react';
import Image from 'next/image';
interface PageHeaderProps {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    height?: string;
    grayscale?: boolean;
    objectFitClass?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, description, image, height = "h-[90vh]", grayscale = false, objectFitClass = "object-cover" }) => {
    return (
        <header className={`relative ${height}  flex flex-col justify-end items-center overflow-hidden bg-slate-900`}>
            <div className="absolute inset-0 z-0">
                <Image
                    src={image}
                    className={`w-full h-full ${objectFitClass} ${grayscale ? 'grayscale' : ''}`}
                    alt={title}
                    width={1920}
                    height={1080}
                    priority
                />
                <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/10 to-black/70"></div>
            </div>

            <div className="relative z-10 text-center text-white px-6 pb-24 md:pb-32 max-w-4xl mx-auto">
                <span
                    className="text-[10px] md:text-[15px] font-principal font-medium tracking-[0.3em] md:tracking-[0.5em] uppercase mb-4 block animate-fade-in-up">
                    {subtitle}</span>
                <h1
                    className="text-4xl md:text-8xl font-bold  font-principal  tracking-tight mb-6 leading-none animate-fade-in-up"
                >
                    {title}
                </h1>
                <p className="text-lg md:text-xl font-principal font-medium opacity-90 max-w-2xl mx-auto leading-relaxed">
                    {description}
                </p>
            </div>
        </header >
    );
};
