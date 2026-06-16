'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UsersView } from '@/components/panel/UsersView';

export default function UsersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const role = (session?.user as any)?.role || '';

    useEffect(() => {
        if (status === 'authenticated' && role && role !== 'ADMIN') {
            router.replace('/panel/hotel');
        }
    }, [status, role, router]);

    if (status === 'loading' || (status === 'authenticated' && role !== 'ADMIN')) {
        return <div className="p-8 flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs">Verificando accesos...</div>;
    }

    return <UsersView />;
}
