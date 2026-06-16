const API_URL = process.env.NEXT_PUBLIC_API_BACK_URL || 'http://localhost:4000';

export interface ResourceCategory {
    id: string;
    name: string;
    minCapacity: number;
    maxCapacity: number;
    basePrice?: number;
    type: 'BEACH_CLUB' | 'HOTEL';
}

export interface Resource {
    id: string;
    name: string;
    type: 'BEACH_CLUB' | 'HOTEL';
    categoryId: string;
    category: ResourceCategory;
    status: 'AVAILABLE' | 'MAINTENANCE';
    createdAt: string;
    updatedAt: string;
}

export async function getResourceCategories(token: string, type?: string): Promise<ResourceCategory[]> {
    const url = type ? `${API_URL}/resource-categories?type=${type}` : `${API_URL}/resource-categories`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        let errorMsg = 'Failed to fetch resource categories';
        try {
            const errorText = await response.text();
            errorMsg = `Failed to fetch resource categories: ${response.status} ${response.statusText} - ${errorText}`;
        } catch (e) {
            // ignore
        }
        console.error(errorMsg);
        throw new Error(errorMsg);
    }
    return response.json();
}

export async function createResourceCategory(token: string, data: Omit<ResourceCategory, 'id'>): Promise<ResourceCategory> {
    const response = await fetch(`${API_URL}/resource-categories`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to create resource category');
    }

    return response.json();
}

export async function updateResourceCategory(token: string, id: string, data: Partial<ResourceCategory>): Promise<ResourceCategory> {
    const response = await fetch(`${API_URL}/resource-categories/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update resource category');
    }

    return response.json();
}

export async function deleteResourceCategory(token: string, id: string): Promise<void> {
    const response = await fetch(`${API_URL}/resource-categories/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete resource category');
    }
}

export async function getBeachClubResources(token: string): Promise<Resource[]> {
    console.log('📡 Calling Beach Club API:', `${API_URL}/resources/beach-club`);
    const response = await fetch(`${API_URL}/resources/beach-club`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    console.log('📊 Response status:', response.status);

    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`Failed to fetch beach club resources: ${response.status}`);
    }

    return response.json();
}

export async function getHotelResources(token: string): Promise<Resource[]> {
    const response = await fetch(`${API_URL}/resources/hotel`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch hotel resources');
    }

    return response.json();
}

export async function getAllResources(
    token: string,
    type?: 'BEACH_CLUB' | 'HOTEL',
    category?: string,
    status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE'
): Promise<Resource[]> {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (category) params.append('category', category);
    if (status) params.append('status', status);

    const url = `${API_URL}/resources${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch resources');
    }

    return response.json();
}

export async function createResource(token: string, data: Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'category'>): Promise<Resource> {
    const response = await fetch(`${API_URL}/resources`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to create resource');
    }

    return response.json();
}

export async function updateResource(token: string, id: string, data: Partial<Resource>): Promise<Resource> {
    const response = await fetch(`${API_URL}/resources/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update resource');
    }

    return response.json();
}

export async function deleteResource(token: string, id: string): Promise<void> {
    const response = await fetch(`${API_URL}/resources/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete resource');
    }
}
