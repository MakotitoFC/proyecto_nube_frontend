import { API_URL } from "./api";

export interface Subscriber {
    id: string;
    email: string;
    createdAt: string;
}

export async function getSubscribers(token: string): Promise<Subscriber[]> {
    const response = await fetch(`${API_URL}/newsletter`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) throw new Error('Failed to fetch subscribers');
    return response.json();
}
