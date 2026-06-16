import React from 'react';

interface PageHeaderProps {
    title: string;
    subtitle: string;
    children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => {
    return (
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
            <div className="w-full md:w-auto">
                <h1 className="text-2xl md:text-3xl font-principal font-extrabold text-slate-900 uppercase tracking-tight mb-1 md:mb-2">
                    {title}
                </h1>
                <p className="text-slate-400 text-xs md:text-sm font-medium">{subtitle}</p>
            </div>
            {children && <div className="w-full md:w-auto">{children}</div>}
        </header>
    );
};
