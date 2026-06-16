import { signOut } from "next-auth/react";

export const API_URL = process.env.NEXT_PUBLIC_API_BACK_URL || 'http://localhost:4000';

export async function authenticatedFetch(path: string, options: RequestInit = {}) {
    const url = path.startsWith('http') ? path : `${API_URL}${path}`;

    const response = await fetch(url, options);

    if (response.status === 401) {
        // Token might be expired or invalid
        console.warn("Unauthorized access detected (401). Signing out...");
        
        if (typeof window !== 'undefined') {
            await signOut({ redirect: false });
            window.location.href = '/login';
        } else {
            await signOut({ callbackUrl: '/login', redirect: true });
        }
        
        return response; // Return to allow the caller to handle it if needed before redirect
    }

    return response;
}
