'use client';

import { useState, useEffect, useRef, useMemo, useId } from 'react';
import { motion } from 'framer-motion';
import { IconZoomIn, IconZoomOut } from '@tabler/icons-react';
import { Resource } from '@/services/resourceService';

interface InteractiveMapProps {
    onSelect: (id: string) => void;
    selectedId: string | null;
    selectedDate?: string;
    resources: Resource[];
    occupiedIds: string[];
}

// Datos originales del mapa (Base width: 3200px)
const ZONES = [
    // Palapas (Circles: x, y, radius)
    { id: 'P1', coords: [234, 975, 81], shape: 'circle' },
    { id: 'P2', coords: [548, 975, 81], shape: 'circle' },
    { id: 'P3', coords: [857, 975, 81], shape: 'circle' },
    { id: 'P4', coords: [1173, 975, 81], shape: 'circle' },
    { id: 'P5', coords: [1460, 975, 81], shape: 'circle' },
    { id: 'P6', coords: [1780, 975, 81], shape: 'circle' },
    { id: 'P7', coords: [2082, 975, 81], shape: 'circle' },
    { id: 'P8', coords: [2395, 975, 81], shape: 'circle' },
    { id: 'P9', coords: [2700, 975, 81], shape: 'circle' },
    { id: 'P10', coords: [3015, 975, 81], shape: 'circle' },
    { id: 'P11', coords: [368, 720, 81], shape: 'circle' },
    { id: 'P12', coords: [682, 720, 81], shape: 'circle' },
    { id: 'P13', coords: [988, 720, 81], shape: 'circle' },
    { id: 'P14', coords: [1307, 720, 81], shape: 'circle' },
    { id: 'P15', coords: [1597, 720, 81], shape: 'circle' },
    { id: 'P16', coords: [1912, 720, 81], shape: 'circle' },
    { id: 'P17', coords: [2210, 720, 81], shape: 'circle' },
    { id: 'P18', coords: [2529, 720, 81], shape: 'circle' },
    { id: 'P19', coords: [2830, 720, 81], shape: 'circle' },
    // Lounges (Rects: x1, y1, x2, y2)
    { id: 'L1', coords: [2131, 1323, 2262, 1424], shape: 'rect' },
    { id: 'L2', coords: [2317, 1323, 2448, 1424], shape: 'rect' },
    { id: 'L3', coords: [2507, 1323, 2638, 1424], shape: 'rect' },
    { id: 'L4', coords: [2697, 1323, 2829, 1424], shape: 'rect' },
    { id: 'L5', coords: [2887, 1323, 3022, 1424], shape: 'rect' },
    // Albercas (Polys)
    { id: 'A1', coords: [1247, 1384, 1188, 1468, 1141, 1437, 1202, 1353], shape: 'poly' },
    { id: 'A2', coords: [1102, 1511, 1085, 1609, 1135, 1612, 1152, 1517], shape: 'poly' },
    { id: 'A3', coords: [1096, 1701, 1121, 1801, 1174, 1784, 1146, 1687], shape: 'poly' },
    { id: 'A4', coords: [1160, 1886, 1205, 1973, 1253, 1953, 1205, 1855], shape: 'poly' },
    { id: 'A5', coords: [1306, 2006, 1275, 2048, 1353, 2110, 1387, 2065], shape: 'poly' },
    { id: 'A6', coords: [1474, 2094, 1462, 2147, 1563, 2164, 1574, 2116], shape: 'poly' },
    { id: 'A7', coords: [1834, 1837, 1887, 1837, 1887, 1937, 1837, 1940], shape: 'poly' },
    { id: 'A8', coords: [1770, 1673, 1731, 1703, 1798, 1782, 1837, 1748], shape: 'poly' },
    { id: 'A9', coords: [1736, 1495, 1790, 1506, 1770, 1604, 1720, 1598], shape: 'poly' }
];

export function InteractiveMap({ onSelect, selectedId, selectedDate, resources, occupiedIds }: InteractiveMapProps) {
    const [scale, setScale] = useState(1);
    const [imgWidth, setImgWidth] = useState<number | null>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const motionRef = useRef<any>(null);
    const mapId = useId();

    // Actualizar width de la imagen para cálculos de coordenadas
    const updateDimensions = () => {
        if (imgRef.current) {
            setImgWidth(imgRef.current.offsetWidth);
        }
    };

    useEffect(() => {
        window.addEventListener('resize', updateDimensions);
        // Observer para cambios de tamaño del contenedor/imagen
        const observer = new ResizeObserver(updateDimensions);
        if (imgRef.current) observer.observe(imgRef.current);

        return () => {
            window.removeEventListener('resize', updateDimensions);
            observer.disconnect();
        };
    }, []);

    // Helper to get real availability based on date and ID
    const getAvailability = (id: string) => {
        const resource = resources.find(r => {
            const rName = r.name.toLowerCase();
            const searchId = id.toLowerCase(); // e.g. "p1"

            // Exact match
            if (r.id === id || rName === searchId) return true;

            // Handle P1 -> "Palapa 1"
            if (searchId.startsWith('p') && rName.includes('palapa')) {
                const num = searchId.substring(1);
                return rName.endsWith(` ${num}`) || rName.endsWith(` 0${num}`) || rName === `palapa ${num}`;
            }
            // Handle L1 -> "Lounge 1"
            if (searchId.startsWith('l') && rName.includes('lounge')) {
                const num = searchId.substring(1);
                return rName.endsWith(` ${num}`) || rName.endsWith(` 0${num}`);
            }
            // Handle A1 -> "Alberca 1"
            if (searchId.startsWith('a') && rName.includes('alberca')) {
                const num = searchId.substring(1);
                return rName.endsWith(` ${num}`) || rName.endsWith(` 0${num}`);
            }

            return rName.includes(searchId);
        });

        if (!resource) return 'available'; // Default if not found in backend

        // 1. Check strict status from backend (Maintenance, Inactive, etc)
        if (resource.status && resource.status !== 'AVAILABLE') {
            return 'reserved'; // Treat as reserved (Red)
        }

        // 2. Check if its UUID is in occupiedIds
        const isReserved = occupiedIds.includes(resource.id);

        return isReserved ? 'reserved' : 'available';
    };

    // Calcular coordenadas escaladas dinámicamente
    const scaledZones = useMemo(() => {
        if (!imgWidth) return [];
        const ORIGINAL_WIDTH = 3200;
        const ratio = imgWidth / ORIGINAL_WIDTH;

        return ZONES.map(zone => ({
            ...zone,
            scaledCoords: zone.coords.map(c => Math.round(c * ratio)), // Keep as array of numbers
            status: getAvailability(zone.id)
        }));
    }, [imgWidth, selectedDate, resources, occupiedIds]);

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
    const handleZoomOut = () => {
        setScale(prev => {
            const newScale = Math.max(prev - 0.5, 1);
            // Resetear posición en cada zoom out
            setTimeout(() => {
                if (motionRef.current) {
                    motionRef.current.style.transform = `scale(${newScale}) translate(0px, 0px)`;
                }
            }, 0);
            return newScale;
        });
    };
    const handleReset = () => setScale(1);

    const handleAreaClick = (e: React.MouseEvent, id: string, status: string) => {
        e.preventDefault();
        e.stopPropagation(); // Evitar propagación al drag
        if (status === 'reserved') return;
        onSelect(id);
    };

    return (
        <div ref={containerRef} className="flex flex-col h-full w-full group">

            <div className="relative flex-1 flex justify-center items-center backdrop-blur-[2px] overflow-hidden min-h-[300px]   md:min-h-[400px] lg:min-h-[500px]">
                <motion.div
                    ref={motionRef}
                    drag={scale > 1} // Solo permitir arrastrar si hay zoom
                    dragConstraints={{
                        left: -(imgWidth || 0) * (scale - 1) / 2,
                        right: (imgWidth || 0) * (scale - 1) / 2,
                        top: -(imgWidth || 0) * (scale - 1) / 2,
                        bottom: (imgWidth || 0) * (scale - 1) / 2,
                    }}
                    dragElastic={0.05}
                    dragMomentum={false}
                    animate={{
                        scale,
                        x: scale === 1 ? 0 : undefined,
                        y: scale === 1 ? 0 : undefined
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    style={{ transformOrigin: 'center' }}
                    className={`relative ${scale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}`}
                    whileTap={scale > 1 ? { cursor: 'grabbing' } : undefined}
                >
                    <img
                        ref={imgRef}
                        src="/home/beach-club/Croquis.webp"
                        useMap={`#map-${mapId}`}
                        alt="Mapa Beach Club"
                        draggable="false"
                        onLoad={updateDimensions}
                        className={`w-full h-auto block select-none max-w-none relative z-10 ${scale > 1 ? 'touch-none' : 'touch-auto'}`}
                    // max-w-none importante para que al hacer zoom no se limite por CSS
                    />

                    {/* SVG Overlay for Colors */}
                    <svg
                        className="absolute inset-0 z-20 pointer-events-none w-full h-full"
                        style={{ width: imgWidth || '100%', height: 'auto' }}
                        viewBox={`0 0 ${imgWidth || 3200} ${imgWidth ? imgWidth * (2314 / 3200) : 2314}`} // Assuming approx aspect ratio or rely on absolute positioning
                    >
                        {/* NOTE: We can just use absolute positioning on divs or svg paths directly using the coords.
                                 Using SVG with the same viewBox as the image size would be easiest if we knew the original height. 
                                 But here we are scaling based on width. 
                                 Let's just use the scaledCoords which are already in pixels matching the current img size.
                             */}
                        {scaledZones.map(zone => {
                            const isSelected = selectedId === zone.id;
                            // Colores fosforecentes: Verde Neón (#39FF14) y Rojo Neón (#FF0033)
                            const color = zone.status === 'reserved' ? '#FF0033' : '#39FF14';
                            const opacity = isSelected ? 0.8 : 0.45; // slightly higher opacity for neon effect
                            const stroke = isSelected ? '#ffffff' : (zone.status === 'reserved' ? '#990000' : '#006600');
                            const strokeWidth = isSelected ? 3 : 1;

                            if (zone.shape === 'circle') {
                                const [cx, cy, r] = zone.scaledCoords;
                                return (
                                    <circle
                                        key={zone.id}
                                        cx={cx} cy={cy} r={r}
                                        fill={color}
                                        fillOpacity={opacity}
                                        stroke={stroke}
                                        strokeWidth={strokeWidth}
                                    />
                                );
                            } else if (zone.shape === 'rect') {
                                const [x1, y1, x2, y2] = zone.scaledCoords;
                                return (
                                    <rect
                                        key={zone.id}
                                        x={x1} y={y1} width={x2 - x1} height={y2 - y1}
                                        fill={color}
                                        fillOpacity={opacity}
                                        stroke={stroke}
                                        strokeWidth={strokeWidth}
                                    />
                                );
                            } else if (zone.shape === 'poly') {
                                return (
                                    <polygon
                                        key={zone.id}
                                        points={zone.scaledCoords.join(',')}
                                        fill={color}
                                        fillOpacity={opacity}
                                        stroke={stroke}
                                        strokeWidth={strokeWidth}
                                    />
                                );
                            }
                            return null;
                        })}
                    </svg>


                    <map name={`map-${mapId}`} className="cursor-pointer relative z-30">
                        {scaledZones.map((zone) => (
                            <area
                                key={zone.id}
                                alt={zone.id}
                                title={`${zone.id} - ${zone.status === 'reserved' ? 'Reservado' : 'Disponible'}`}
                                href="#"
                                shape={zone.shape}
                                coords={zone.scaledCoords.join(',')}
                                onClick={(e) => handleAreaClick(e, zone.id, zone.status)}
                                onPointerDown={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                className={`outline-none ${zone.status === 'reserved' ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                style={{ cursor: zone.status === 'reserved' ? 'not-allowed' : 'pointer' }}
                            />
                        ))}
                    </map>
                </motion.div>
            </div>

            {/* CONTROLES DE ZOOM - DEBAJO DEL MAPA */}
            <div className="flex justify-center gap-4  border-t mt-5 pt-5 border-slate-100 bg-white/50 backdrop-blur-sm z-30">
                <button
                    onClick={handleZoomOut}
                    className="p-3 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 active:scale-90 flex items-center gap-2"
                    title="Alejar"
                >
                    <IconZoomOut size={22} />
                    <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Alejar</span>
                </button>
                <div className="w-px bg-slate-200 my-2" />
                <button
                    onClick={handleZoomIn}
                    className="p-3 hover:bg-slate-100 rounded-xl transition-colors text-slate-600 active:scale-90 flex items-center gap-2"
                    title="Acercar"
                >
                    <IconZoomIn size={22} />
                    <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline">Acercar</span>
                </button>
            </div>
        </div>
    );
}
