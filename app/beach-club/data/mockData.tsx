import { ReactNode } from "react";
import {
    IconFlame,
    IconSmoking,
    IconBan,
    IconPool,
    IconEye,
    IconCrown,
    IconDiamond,
    IconSmokingNo,
    IconPaw
} from '@tabler/icons-react';

export interface SpaceDetails {
    id: string; // "P" | "A" | "L"
    title: string;
    description: string;
    shortDescription: string;
    capacity: number;
    adultsOnly: boolean;
    images: string[];
    tags: { icon?: ReactNode; label: string, color: string }[];
    inclusions: string[];
    rules: string[];
}

export const SPACE_TYPES: Record<string, SpaceDetails> = {
    P: {
        id: "P",
        title: "Zona Playa",
        shortDescription: "Capacidad máxima por mesa: 4 personas",
        description: "Experience ultimate relaxation in your private island bed. Located right in the heart of the action with premium service.",
        capacity: 4,
        adultsOnly: true,
        images: [
            "/home/beach-club/mock/Playa_1.webp",
            "/home/beach-club/mock/Playa_2.webp",
            "/home/beach-club/mock/Playa_3.webp",
        ],
        tags: [
            { label: "Hot", color: "bg-orange-100 text-orange-600", icon: <IconFlame size={16} /> },
            { label: "Espacio libre de humo", color: "bg-cyan-100 text-cyan-600", icon: <IconSmokingNo size={16} /> },
            { label: "No mascotas", color: "bg-purple-100 text-purple-600", icon: <IconBan size={16} /> }
        ],
        inclusions: [
            "Welcome shooters",
            "Alcoholic Party Popsicles",
            "Escorted entry & valet service",
            "High-speed Wi-Fi",
            "Bottle service",
            "Towel rental",
            "Complimentary cold face towel, face mist & sunscreen",
            "15% exclusive discount at FINNS Grand boutique"
        ],
        rules: ["Adults Only (18+)"]
    },
    A: {
        id: "A",
        title: "Zona Alberca",
        shortDescription: "Capacidad máxima por mesa: 2 personas",
        description: "Reserved sun loungers on the pool deck. The perfect spot to soak up the sun and enjoy the pool vibes.",
        capacity: 2,
        adultsOnly: true,
        images: [
            "/home/beach-club/mock/Alberca_1.webp",
            "/home/beach-club/mock/Alberca_2.webp",
            "/home/beach-club/mock/Alberca_3.webp",
            "/home/beach-club/mock/Alberca_4.webp",
            "/home/beach-club/mock/Alberca_5.webp"
        ],
        tags: [
            { label: "Hot", color: "bg-orange-100 text-orange-600", icon: <IconFlame size={16} /> },
            { label: "Espacio libre de humo", color: "bg-cyan-100 text-cyan-600", icon: <IconSmokingNo size={16} /> },
            { label: "No mascotas", color: "bg-purple-100 text-purple-600", icon: <IconBan size={16} /> }
        ],
        inclusions: [
            "Towel rental ($100 p/p)",
            "Pool access",
            "Waiter service",
            "High-speed Wi-Fi (Zones)"
        ],
        rules: ["Adults Only (18+)"]
    },
    L: {
        id: "L",
        title: "Zona Lounge VIP",
        shortDescription: "Capacidad máxima por mesa: 6 personas",
        description: "Our most exclusive area. Premium sofas, dedicated mixologist, and extended privacy for your group.",
        capacity: 6,
        adultsOnly: true,
        images: [
            "/home/beach-club/mock/Lounge_1.webp",
            "/home/beach-club/mock/Lounge_2.webp",
            "/home/beach-club/mock/Lounge_3.webp",
        ],
        tags: [
            { label: "Hot", color: "bg-orange-100 text-orange-600", icon: <IconFlame size={16} /> },
            { label: "Espacio libre de humo", color: "bg-cyan-100 text-cyan-600", icon: <IconSmokingNo size={16} /> },
            { label: "No mascotas", color: "bg-amber-100 text-amber-600", icon: <IconBan size={16} /> }
        ],
        inclusions: [
            "Private Butler",
            "Premium Bottle Service",
            "Priority Entry",
            "Private Bathroom Access",
            "Welcome Champagne"
        ],
        rules: ["Adults Only (18+)"]
    }
};

export const getNextAvailability = (startDate: string) => {
    const days = [];
    const start = new Date(startDate);

    for (let i = 0; i < 5; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        days.push({
            date: d.toISOString().split('T')[0],
            status: Math.random() > 0.3 ? 'available' : (Math.random() > 0.5 ? 'fast' : 'full')
        });
    }
    return days;
};
