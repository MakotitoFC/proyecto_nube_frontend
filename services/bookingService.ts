const API_URL = process.env.NEXT_PUBLIC_API_BACK_URL || 'http://localhost:4000';

export interface CreateBookingData {
    resourceId: string;
    fullName: string;
    email: string;
    phone: string;
    startDate: string;
    endDate: string;
    estimatedArrivalTime?: string;
    notes?: string;
    userId?: string;
    guestCount?: number;
    status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
}

export async function createBooking(data: CreateBookingData) {
    const response = await fetch(`${API_URL}/bookings`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create booking');
    }

    return response.json();
}

export async function getOccupiedIds(date: string, endDate?: string): Promise<string[]> {
    const url = endDate
        ? `${API_URL}/bookings/occupied-ids?date=${date}&endDate=${endDate}`
        : `${API_URL}/bookings/occupied-ids?date=${date}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch occupied IDs');
    }
    return response.json();
}
export async function createAdminBooking(token: string, data: CreateBookingData) {
    const response = await fetch(`${API_URL}/bookings/panel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create admin booking');
    }

    return response.json();
}

export async function updateBooking(token: string, id: string, data: Partial<CreateBookingData>) {
    const response = await fetch(`${API_URL}/bookings/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update booking');
    }

    return response.json();
}

export async function getAllBookings(token: string): Promise<any[]> {
    const response = await fetch(`${API_URL}/bookings`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch bookings');
    }
    return response.json();
}
