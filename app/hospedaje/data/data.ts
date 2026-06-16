export interface Room {
    id: number;
    name: string;
    status: 'available' | 'occupied' | 'maintenance';
    price: number;
}

export const activeRooms: Room[] = Array.from({ length: 11 }, (_, i) => ({
    id: i + 1,
    name: `Bungalow #${i + 1}`,
    // Simulate some occupied rooms for demo purposes
    status: i === 2 || i === 5 ? 'occupied' : 'available',
    price: 250 // Base nightly rate
}));

export const getRoomsAvailability = async (checkIn: string, checkOut: string): Promise<Room[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate random availability changes based on dates
    // In a real app, this would query the backend
    return activeRooms.map(room => ({
        ...room,
        status: Math.random() > 0.8 ? 'occupied' : room.status // Add some randomness
    }));
};
