// services/userService.ts
import { User, UserRole } from '../types';
import { authenticatedFetch } from './api';

interface CreateUserDto {
    email: string;
    fullName: string;
    password?: string;
    role?: string;
    isActive?: boolean;
    photo?: string;
    phone?: string;
}

export const getProfile = async (token: string): Promise<User> => {
    const res = await authenticatedFetch(`/auth/profile`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    const u = await res.json();
    return {
        id: u.id,
        name: u.fullName,
        email: u.email,
        role: u.role.toLowerCase() as UserRole,
        isActive: u.isActive,
        photo: u.photo,
        phone: u.phone
    };
};

export const updateProfileInfo = async (token: string, data: Partial<CreateUserDto>): Promise<User> => {
    const res = await authenticatedFetch(`/auth/profile`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update profile');
    }
    const u = await res.json();
    return {
        id: u.id,
        name: u.fullName,
        email: u.email,
        role: u.role.toLowerCase() as UserRole,
        isActive: u.isActive,
        photo: u.photo,
        phone: u.phone
    };
};

export const getUsers = async (token: string): Promise<User[]> => {
    const res = await authenticatedFetch(`/api/panel/users`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    const data = await res.json();
    // Map backend user to frontend User interface if needed
    // Backend returns: { id, email, fullName, role, isActive, ... }
    // Frontend expects: { id, name, email, role, avatar?, isActive }
    return data.map((u: any) => ({
        id: u.id,
        name: u.fullName,
        email: u.email,
        role: u.role.toLowerCase() as UserRole, // 'ADMIN' -> 'admin'
        isActive: u.isActive,
        photo: u.photo,
        phone: u.phone,
        avatar: undefined
    }));
};

export const createUser = async (token: string, data: CreateUserDto): Promise<User> => {
    const res = await authenticatedFetch(`/api/panel/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            ...data,
            role: data.role?.toUpperCase()
        })
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create user');
    }
    const u = await res.json();
    return {
        id: u.id,
        name: u.fullName,
        email: u.email,
        role: u.role.toLowerCase() as UserRole,
        isActive: u.isActive,
        photo: u.photo,
        phone: u.phone
    };
};

export const updateUser = async (token: string, id: string, data: Partial<CreateUserDto>): Promise<User> => {
    const res = await authenticatedFetch(`/api/panel/users/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            ...data,
            role: data.role?.toUpperCase()
        })
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to update user');
    }
    const u = await res.json();
    return {
        id: u.id,
        name: u.fullName,
        email: u.email,
        role: u.role.toLowerCase() as UserRole,
        isActive: u.isActive,
        photo: u.photo,
        phone: u.phone
    };
};
