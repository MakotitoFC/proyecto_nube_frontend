'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { interpolate } from 'framer-motion';

interface HotelCalendarSelectorProps {
    startDate: string | null;
    endDate: string | null;
    onChange: (start: string, end: string | null) => void;
    className?: string;
}

const HotelCalendarSelector = ({ startDate, endDate, onChange, className }: HotelCalendarSelectorProps) => {
    // Initialize with start date or today
    const [currentDate, setCurrentDate] = useState(() => {
        return startDate ? new Date(startDate + 'T12:00:00') : new Date();
    });

    const [hoveredDate, setHoveredDate] = useState<string | null>(null);

    // Helpers
    const getMonthData = (year: number, month: number) => {
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        // Adjust firstDay to Monday=0, Sunday=6
        // Sun(0) -> 6, Mon(1) -> 0
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

        const days: (number | null)[] = [];
        for (let i = 0; i < adjustedFirstDay; i++) days.push(null);
        for (let i = 1; i <= daysInMonth; i++) days.push(i);
        return days;
    };

    const getDateStr = (year: number, month: number, day: number) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const isDatePast = (dateStr: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(dateStr + 'T12:00:00') < today;
    };

    // Navigation
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

    // Selection Logic
    const handleDayClick = (dateStr: string) => {
        if (isDatePast(dateStr)) return;

        if (!startDate || (startDate && endDate)) {
            onChange(dateStr, null);
        } else if (startDate && !endDate) {
            if (dateStr < startDate) {
                onChange(dateStr, startDate);
            } else {
                onChange(startDate, dateStr);
            }
        }
    };

    // Rendering a Single Month Grid
    const renderMonth = (offset: number) => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + offset;
        const displayDate = new Date(year, month, 1);
        const displayYear = displayDate.getFullYear();
        const displayMonth = displayDate.getMonth();

        const days = getMonthData(displayYear, displayMonth);
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

        return (
            <div className="w-full">
                <div className="text-center mb-6">
                    <span className="text-base font-semibold text-slate-800">
                        {monthNames[displayMonth]} {displayYear}
                    </span>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 mb-2">
                    {["LU", "MA", "MI", "JU", "VI", "SA", "DO"].map(d => (
                        <div key={d} className="text-center text-[10px] sm:text-xs text-slate-400 font-medium">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-y-1 sm:gap-y-2">
                    {days.map((day, idx) => {
                        if (!day) return <div key={`empty-${idx}`} />;

                        const dateStr = getDateStr(displayYear, displayMonth, day);
                        const isPast = isDatePast(dateStr);

                        const isSelectedStart = startDate === dateStr;
                        const isSelectedEnd = endDate === dateStr;
                        const isInRange = startDate && endDate && dateStr > startDate && dateStr < endDate;
                        const isHovered = hoveredDate === dateStr;

                        // Visual Styles
                        let cellClass = "w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-sm relative transition-all mx-auto";
                        let textClass = "font-medium z-10 relative";
                        let bgClass = "";

                        if (isPast) {
                            textClass = "text-slate-300 line-through cursor-not-allowed";
                        } else {
                            cellClass += " cursor-pointer hover:bg-slate-100";
                            textClass = "text-slate-700";

                            if (isSelectedStart || isSelectedEnd) {
                                bgClass = "bg-[#002B4E] text-white shadow-md z-20 hover:bg-[#002B4E]"; // Dark Navy from screenshot
                                textClass = "text-white font-bold";
                                cellClass = cellClass.replace("hover:bg-slate-100", "");
                            } else if (isInRange) {
                                bgClass = "bg-blue-50 text-slate-900"; // Light Blue range
                                cellClass += " rounded-none hover:bg-blue-100"; // Rectangular for range? or connected?
                                // To make them continuous, we mess with margins/widths or container.
                                // Simplest "pill" approximation: rounded-none or specific styling.
                            }
                        }

                        // Connected Range Styling Container
                        const isRangeStart = isSelectedStart && endDate;
                        const isRangeEnd = isSelectedEnd && startDate;
                        const isMiddle = isInRange;

                        return (
                            <div
                                key={dateStr}
                                className="relative p-0 flex items-center justify-center"
                                onMouseEnter={() => setHoveredDate(dateStr)}
                                onMouseLeave={() => setHoveredDate(null)}
                                onClick={() => handleDayClick(dateStr)}
                            >
                                {/* Connector Backgrounds */}
                                {(isMiddle || isRangeEnd) && startDate && endDate && (
                                    <div className="absolute left-0 w-[50%] h-8 sm:h-10 bg-[#BEE5EB] z-0" />
                                )}
                                {(isMiddle || isRangeStart) && startDate && endDate && (
                                    <div className="absolute right-0 w-[50%] h-8 sm:h-10 bg-[#BEE5EB] z-0" />
                                )}

                                {/* The Button/Circle */}
                                <button
                                    disabled={isPast}
                                    className={`
                                        w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm z-10 transition-all
                                        ${isPast ? 'text-slate-300' : 'text-slate-700'}
                                        ${(isSelectedStart || isSelectedEnd) ? '!bg-[#003B95] !text-white shadow-lg scale-105' : ''}
                                        ${(!isSelectedStart && !isSelectedEnd && isInRange) ? '!bg-transparent !text-[#003B95] font-bold' : ''}
                                        ${(!isSelectedStart && !isSelectedEnd && !isInRange && !isPast) ? 'hover:border-2 hover:border-[#003B95] hover:text-[#003B95]' : ''}
                                    `}
                                >
                                    {day}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Calculate Nights
    const getNights = () => {
        if (!startDate || !endDate) return 0;
        const diff = new Date(endDate).getTime() - new Date(startDate).getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const formatDateFriendly = (dateStr: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr + 'T12:00:00');
        return d.toLocaleDateString('es-MX', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className={`bg-white rounded-xl ${className}`}>
            {/* Header */}
            <div className="text-center mb-8 relative">
                <h2 className="text-lg font-medium text-slate-600">Llegada</h2>
                {/* Arrows positioned absolute to container width */}
                <button onClick={prevMonth} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-full text-slate-500">
                    <ChevronLeft size={24} />
                </button>
                <button onClick={nextMonth} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-slate-100 rounded-full text-slate-500">
                    <ChevronRight size={24} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 select-none">
                {renderMonth(0)}
                <div className="hidden md:block">
                    {renderMonth(1)}
                </div>
            </div>

            {/* Footer Summary */}
            {(startDate && endDate) && (
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-slate-600 font-medium text-sm sm:text-base">
                        <span className="capitalize">{formatDateFriendly(startDate)}</span> — <span className="capitalize">{formatDateFriendly(endDate)}</span>
                        <span className="font-bold text-slate-900 ml-2">({getNights()} Noches)</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default HotelCalendarSelector;
