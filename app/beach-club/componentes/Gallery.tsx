'use client';

import React from 'react';
import { InteractiveMap } from './InteractiveMap';
import { Resource } from '@/services/resourceService';

interface GalleryProps {
    onSelect: (id: string) => void;
    selectedId: string | null;
    selectedDate?: string;
    resources: Resource[];
    occupiedIds: string[];
}

const Gallery = ({ onSelect, selectedId, selectedDate, resources, occupiedIds }: GalleryProps) => {
    return (
        <div className="relative w-full overflow-hidden p-2 md:p-4  border border-slate-200 group">
            <InteractiveMap
                onSelect={onSelect}
                selectedId={selectedId}
                selectedDate={selectedDate}
                resources={resources}
                occupiedIds={occupiedIds}
            />
        </div>
    );
};

export default Gallery;
