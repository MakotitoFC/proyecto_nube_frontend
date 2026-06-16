import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Menu, X, IconSettings, IconLogout, ChevronDown, Bed, Umbrella, Calendar, Mail } from '../ui/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const pathname = usePathname();
    const { data: session } = useSession();
    const role = (session?.user as any)?.role || '';

    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
        'beach-club': false,
        'hotel': false
    });

    const navigation = [
        {
            section: 'Principal',
            items: [
                { label: 'Dashboard', icon: LayoutDashboard, href: '/panel' },

            ]
        },
        {
            section: 'Reservas',
            items: [
                {
                    label: 'Beach Club',
                    icon: Umbrella,
                    id: 'beach-club',
                    children: [
                        { label: 'Calendario', icon: Calendar, href: '/panel/beach-club' },
                        { label: 'Configuración', icon: IconSettings, href: '/panel/beach-club/config' },
                    ]
                },
                {
                    label: 'Hotel',
                    icon: Bed,
                    id: 'hotel',
                    children: [
                        { label: 'Calendario', icon: Calendar, href: '/panel/hotel' },
                        { label: 'Configuración', icon: IconSettings, href: '/panel/hotel/config' },
                    ]
                },
            ]
        },
        {
            section: 'Usuarios',
            items: [
                { label: 'Usuarios', icon: Users, href: '/panel/users' },

            ]
        },
        {
            section: 'Marketing',
            items: [
                { label: 'Newsletter', icon: Mail, href: '/panel/newsletter' },
            ]
        },
        {
            section: 'Preferencias',
            items: [
                { label: 'Ajustes', icon: IconSettings, href: '/panel/settings' },
            ]
        }
    ].filter(group => {
        if (role !== 'ADMIN') {
            // Receptionists cannot see Dashboard (Principal) or Users
            if (group.section === 'Principal' || group.section === 'Usuarios') {
                return false;
            }
        }
        return true;
    });

    const toggleGroup = (group: string) => {
        setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
    };

    const NavItem = ({ icon: Icon, label, href, isChild = false }: any) => {
        const isActive = pathname === href || (href !== '/panel' && pathname.startsWith(href) && !isChild) || (isChild && pathname === href);

        return (
            <div className="relative">
                {isChild && (
                    <div className="absolute left-8 top-0 bottom-0 flex flex-col items-center">
                        <div className="w-px h-full border-l border-dashed border-white/20" />
                        <div className="absolute top-1/2 left-0 w-4 h-px border-t border-dashed border-white/20" />
                    </div>
                )}
                <Link
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl transition-all duration-300 group relative
                    ${isActive ? 'bg-white/10 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}
                    ${isChild ? 'pl-14 py-2' : ''}`}
                >
                    <div className={`p-1.5 rounded-lg transition-colors 
                        ${isActive ? 'bg-[#09C9CB] text-white' : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'}
                        ${isChild ? 'p-1' : ''}`}>
                        <Icon size={isChild ? 13 : 16} />
                    </div>
                    <span className={`font-bold uppercase tracking-wider ${isChild ? 'text-[9px]' : 'text-[10px]'}`}>{label}</span>
                </Link>
            </div>
        );
    };

    const NavGroup = ({ icon: Icon, label, id, children }: any) => {
        const isOpen = openGroups[id];
        const hasActiveChild = children.some((child: any) => pathname === child.href);

        return (
            <div className="space-y-1 relative">
                <button
                    onClick={() => toggleGroup(id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl transition-all duration-300 group
                    ${hasActiveChild ? 'text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
                >
                    <div className={`p-1.5 rounded-lg transition-colors ${hasActiveChild ? 'bg-[#09C9CB]/20 text-[#09C9CB]' : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'}`}>
                        <Icon size={16} />
                    </div>
                    <span className="font-bold text-[10px] uppercase tracking-wider flex-1 text-left">{label}</span>
                    <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-slate-500"
                    >
                        <ChevronDown size={16} />
                    </motion.div>
                </button>
                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                                height: 'auto',
                                opacity: 1,
                                transition: {
                                    height: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] },
                                    opacity: { duration: 0.2, ease: 'easeOut' }
                                }
                            }}
                            exit={{
                                height: 0,
                                opacity: 0,
                                transition: {
                                    height: { duration: 0.3, ease: [0.4, 0.0, 0.2, 1] },
                                    opacity: { duration: 0.2, ease: 'easeIn' }
                                }
                            }}
                            className="overflow-hidden space-y-1 relative"
                        >
                            {/* Vertical connecting line for the whole group */}
                            <div className="absolute left-8 top-0 bottom-4 w-px border-l border-dashed border-white/20 z-0" />

                            {children.map((child: any) => (
                                <NavItem key={child.href} {...child} isChild />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

    return (
        <>
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-white flex flex-col transform transition-transform duration-500 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0
                ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
            `}>
                {/* Header Section */}
                <div className="p-6 pb-2 flex flex-col items-center shrink-0 text-center">
                    <img src="/home/logo_white.webp" alt="Logo" className="w-24 mb-3 drop-shadow-md" />
                    <p className="text-white text-[11px] font-principal uppercase tracking-widest opacity-80">Pelícanos Beach Club</p>
                    <div className="h-px w-16 bg-linear-to-r from-transparent via-white/20 to-transparent mt-4" />
                </div>

                {/* Scrollable Navigation */}
                <nav className="flex-1 overflow-y-auto px-5 py-3 space-y-1 custom-scrollbar">
                    {navigation.map((group) => (
                        <React.Fragment key={group.section}>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.25em] ml-3 mb-3 mt-5 first:mt-0">
                                {group.section}
                            </p>
                            {group.items.map((item: any) => (
                                item.children ? (
                                    <NavGroup key={item.id} {...item} />
                                ) : (
                                    <NavItem key={item.href} {...item} />
                                )
                            ))}
                        </React.Fragment>
                    ))}
                </nav>

                {/* Fixed Bottom Section */}
                <div className="p-6 py-4 border-t border-white/10 shrink-0">
                    <button
                        onClick={async () => {
                            await signOut({ redirect: false });
                            window.location.href = '/login';
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 text-slate-400 hover:bg-rose-500/10 hover:text-rose-500 group"
                    >
                        <div className="p-2 rounded-lg bg-slate-800 text-slate-500 group-hover:bg-rose-500/20 group-hover:text-rose-500 transition-colors">
                            <IconLogout size={16} />
                        </div>
                        <span className="font-bold text-[10px] uppercase tracking-widest">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Overlay mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};
