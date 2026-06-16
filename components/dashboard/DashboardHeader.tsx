import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { es } from 'date-fns/locale/es';
import { PageHeader } from '../panel/PageHeader';

registerLocale('es', es);

interface DashboardHeaderProps {
    dateRange: { start: Date; end: Date };
    setDateRange: (range: { start: Date; end: Date }) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ dateRange, setDateRange }) => {

    const CustomInput = React.forwardRef(({ value, onClick, label }: any, ref: any) => (
        <div
            onClick={onClick}
            ref={ref}
            className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-slate-50 transition-colors rounded-xl group relative"
        >
            <CalendarIcon size={16} className="text-slate-400 group-hover:text-[#07A0A2] transition-colors" />
            <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">{label}</span>
                <span className="text-xs font-bold text-slate-800 leading-none mt-1 capitalize">
                    {value}
                </span>
            </div>
        </div>
    ));
    CustomInput.displayName = 'CustomInput';

    return (
        <PageHeader
            title="Dashboard General"
            subtitle="Vista General del Rendimiento"
        >
            <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                <div className="border-r border-slate-100">
                    <DatePicker
                        selected={dateRange.start}
                        onChange={(date: Date | null) => date && setDateRange({ ...dateRange, start: date })}
                        selectsStart
                        startDate={dateRange.start}
                        endDate={dateRange.end}
                        locale="es"
                        dateFormat="dd MMM yyyy"
                        customInput={<CustomInput label="Desde" />}
                        popperClassName="z-50"
                    />
                </div>

                <div>
                    <DatePicker
                        selected={dateRange.end}
                        onChange={(date: Date | null) => date && setDateRange({ ...dateRange, end: date })}
                        selectsEnd
                        startDate={dateRange.start}
                        endDate={dateRange.end}
                        minDate={dateRange.start}
                        locale="es"
                        dateFormat="dd MMM yyyy"
                        customInput={<CustomInput label="Hasta" />}
                        popperClassName="z-50"
                    />
                </div>
            </div>
        </PageHeader>
    );
};
