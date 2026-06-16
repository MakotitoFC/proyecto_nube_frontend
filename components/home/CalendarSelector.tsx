'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export type CalendarMode = 'single' | 'range';

interface CalendarSelectorProps {
    mode: CalendarMode;
    // Single mode props
    selectedDate?: string | null;
    onSelect?: (date: string) => void;
    // Range mode props
    startDate?: string | null;
    endDate?: string | null;
    onRangeSelect?: (start: string, end: string | null) => void;
    variant?: 'default' | 'minimal';
}

const CalendarSelector = ({
    mode,
    selectedDate,
    onSelect,
    startDate,
    endDate,
    onRangeSelect,
    variant = 'default'
}: CalendarSelectorProps) => {
    // Initialize with relevant date or today
    const initialDate = mode === 'single'
        ? (selectedDate ? new Date(selectedDate) : new Date())
        : (startDate ? new Date(startDate) : new Date());

    const [currentDate, setCurrentDate] = useState(initialDate);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isMounted, setIsMounted] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const daysOfWeek = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

    const totalDays = daysInMonth(year, month);
    let firstDay = firstDayOfMonth(year, month);
    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
        days.push(i);
    }

    // Helper to get consistent YYYY-MM-DD string avoiding timezone issues
    const getDateStr = (y: number, m: number, d: number) => {
        return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    };

    const isPastDate = (day: number) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const date = new Date(year, month, day);
        return date < today;
    };

    const isSelected = (day: number) => {
        const currentStr = getDateStr(year, month, day);

        if (mode === 'single') {
            return currentStr === selectedDate;
        } else {
            return currentStr === startDate || (endDate !== null && currentStr === endDate);
        }
    };

    const isInRange = (day: number) => {
        if (mode === 'single' || !startDate || !endDate) return false;
        const currentStr = getDateStr(year, month, day);
        return currentStr > startDate && currentStr < endDate;
    };

    const handleDateClick = (day: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isPastDate(day)) return;

        const dateStr = getDateStr(year, month, day);

        if (mode === 'single') {
            if (selectedDate === dateStr) {
                if (onSelect) onSelect(dateStr);
            } else {
                if (onSelect) onSelect(dateStr);
            }
        } else if (mode === 'range' && onRangeSelect) {
            // Range logic

            // Case 0: Deselect if clicking the start date again when it's the only one selected
            if (startDate && !endDate && startDate === dateStr) {
                onRangeSelect(null as any, null); // Clear selection
                return;
            }

            // Case 1: Start new selection if:
            // - No start date
            // - Both dates already selected (reset)
            if (!startDate || (startDate && endDate)) {
                onRangeSelect(dateStr, null);
                return;
            }

            // Case 2: Complete range
            if (startDate && !endDate) {
                if (dateStr >= startDate) {
                    onRangeSelect(startDate, dateStr);
                } else {
                    // Reverse selection: Clicked date becomes start
                    onRangeSelect(dateStr, startDate);
                }
            }
        }
    };

    const nextMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const prevMonth = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentDate(new Date(year, month - 1, 1));
    };

    // Determine days to show based on expansion state
    const visibleDays = () => {
        if (isExpanded) return days;

        // If collapsed
        let targetDay = 1;

        if (mode === 'single' && selectedDate) {
            const d = new Date(selectedDate + 'T12:00:00'); // Safe parse
            if (d.getFullYear() === year && d.getMonth() === month) targetDay = d.getDate();
        } else if (mode === 'range' && startDate) {
            const d = new Date(startDate + 'T12:00:00'); // Safe parse
            if (d.getFullYear() === year && d.getMonth() === month) targetDay = d.getDate();
        }

        const dayIndex = days.indexOf(targetDay);
        // Find start of that week
        const startOfWeek = Math.floor(dayIndex / 7) * 7;
        // Slice safely
        return days.slice(startOfWeek, startOfWeek + 7).map(d => d || null);
    };

    const currentVisibleDays = isExpanded ? days : visibleDays();


    if (!isMounted) {
        return (
            <div className="w-full bg-white rounded-2xl p-2 border border-slate-200 h-24 flex items-center justify-center">
                <div className="text-slate-400 text-xs animate-pulse font-principal uppercase tracking-widest font-bold">Cargando calendario...</div>
            </div>
        );
    }

    return (
        <div
            className={`w-full transition-all duration-300 ease-in-out cursor-pointer ${variant === 'minimal' ? 'bg-transparent p-0 border-none' : `bg-white rounded-2xl p-2 border hover:bg-slate-50/50 ${isExpanded ? 'border-slate-200' : 'border-transparent hover:border-slate-100'}`}`}
            onClick={() => variant !== 'minimal' && setIsExpanded(!isExpanded)}
        >
            <div className="flex justify-between items-center mb-2 px-2">
                <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 select-none">
                        {monthNames[month]} {year}
                    </h3>
                    {!isExpanded && (
                        <span className="bg-slate-100 text-[10px] font-bold px-2 py-0.5 rounded text-slate-500 uppercase tracking-wide">
                            Semana
                        </span>
                    )}
                </div>
                {isExpanded && (
                    <div className="flex gap-1">
                        <button onClick={prevMonth} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                            <ChevronLeft size={16} />
                        </button>
                        <button onClick={nextMonth} className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600">
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            <div className={`grid grid-cols-7 gap-0 mb-1 px-2 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-70'}`}>
                {daysOfWeek.map(day => (
                    <div key={day} className="text-center text-[10px] font-bold text-slate-400 py-1 select-none">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-0 px-2 leading-none">
                {currentVisibleDays.map((day, idx) => {
                    // Safety check for day
                    const dayStr = day ? getDateStr(year, month, day) : '';

                    return (
                        <div key={idx} className="aspect-square flex flex-col items-center justify-center relative p-0 m-0">
                            {day && (
                                <>
                                    {/* Range Background - Only in range mode */}
                                    {mode === 'range' && isInRange(day) && (
                                        <div className="absolute inset-y-1 inset-x-0 bg-slate-100/80 z-0" />
                                    )}

                                    {/* Connectors for start/end in range mode */}
                                    {mode === 'range' && startDate && endDate && dayStr === startDate && (
                                        <div className="absolute inset-y-1 right-0 w-1/2 bg-slate-100/80 z-0" />
                                    )}
                                    {mode === 'range' && startDate && endDate && dayStr === endDate && (
                                        <div className="absolute inset-y-1 left-0 w-1/2 bg-slate-100/80 z-0" />
                                    )}

                                    <button
                                        onClick={(e) => handleDateClick(day, e)}
                                        disabled={isPastDate(day)}
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all z-10 relative
                                        ${isSelected(day)
                                                ? 'bg-slate-900 text-white scale-105'
                                                : isPastDate(day)
                                                    ? 'text-slate-300 cursor-not-allowed decoration-slate-300/50 line-through'
                                                    : (mode === 'range' && isInRange(day))
                                                        ? 'text-slate-900 bg-transparent'
                                                        : 'text-slate-700 hover:bg-slate-100'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                </>
                            )}
                            {!day && isExpanded && <div className="w-8 h-8" />} {/* Spacer for null days if expanded to keep grid alignment */}
                            {!day && !isExpanded && (
                                // Null placeholder for collapsed view validation?
                                <span className="text-xs text-slate-200">-</span>
                            )}
                        </div>
                    )
                })}
            </div>
            {/* Visual indicator for expansion */}
            {variant !== 'minimal' && (
                <div className="w-full flex justify-center mt-1">
                    <div className={`w-8 h-1 rounded-full bg-slate-100 transition-colors ${isExpanded ? 'bg-slate-200' : ''}`} />
                </div>
            )}
        </div>
    );
};

export default CalendarSelector;
