export type SpaceType = 'palapa' | 'lounge' | 'alberca';

export interface BeachSpace {
    id: string;
    type: SpaceType;
    label: string;
}

export interface Room {
    id: string;
    name: string;
    description: string;
    price: number;
    capacity: number;
    imageUrl: string;
    amenities: string[];
}

export interface Booking {
    id: string;
    targetId: string;
    type: 'room' | 'beach';
    guestName: string;
    date: string;
    endDate?: string;
    checkIn?: string; // HH:mm (e.g., "11:00")
    checkOut?: string; // HH:mm (e.g., "15:00")
    status: 'confirmed' | 'pending';
}

export type ViewState = 'home' | 'beach-club' | 'hospedaje' | 'menu' | 'admin';

export type UserRole = 'admin' | 'receptionist';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    isActive: boolean;
    avatar?: string;
    photo?: string;
    phone?: string;
}