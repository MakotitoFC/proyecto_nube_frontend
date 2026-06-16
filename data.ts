export const ROOMS_DATA = Array.from({ length: 12 }, (_, i) => ({
    id: `B${i + 1}`,
    name: `Bungalow Vista al Mar ${i + 1}`,
    description: 'Exclusiva habitación frente al mar con terraza privada.',
    price: 350,
    capacity: 2,
    imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1548&q=80',
    amenities: ['Wifi', 'Aire Acondicionado', 'Minibar', 'Vista al Mar']
}));
