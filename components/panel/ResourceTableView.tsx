'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, IconUserCircle, Edit } from '../ui/Icons';

interface Column {
    header: string;
    key: string;
    render?: (item: any) => React.ReactNode;
}

interface ResourceTableViewProps {
    title: string;
    subtitle: string;
    columns: Column[];
    data: any[];
    emptyMessage?: string;
    onDelete?: (id: string) => void;
    onEdit?: (item: any) => void;
}

export const ResourceTableView: React.FC<ResourceTableViewProps> = ({
    title,
    subtitle,
    columns,
    data,
    emptyMessage = "No hay registros disponibles",
    onDelete,
    onEdit
}) => {
    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-principal font-extrabold text-slate-900 uppercase tracking-tight mb-2">
                        {title}
                    </h1>
                    <p className="text-slate-400 text-sm font-medium">{subtitle}</p>
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] md:rounded-[40px] shadow-sm border border-slate-200 overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                {columns.map((col, idx) => (
                                    <th key={idx} className="p-3 md:p-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                                        {col.header}
                                    </th>
                                ))}
                                {(onDelete || onEdit) && (
                                    <th className="p-3 md:p-6 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-center">
                                        Acciones
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {data.map((item, rowIdx) => (
                                <tr key={item.id || rowIdx} className="hover:bg-slate-50/50 transition-colors group">
                                    {columns.map((col, colIdx) => (
                                        <td key={colIdx} className="p-3 md:p-6">
                                            {col.render ? col.render(item) : (
                                                <span className="font-bold text-slate-800 text-sm">
                                                    {item[col.key]}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                    {(onDelete || onEdit) && (
                                        <td className="p-3 md:p-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {onEdit && (
                                                    <button
                                                        onClick={() => onEdit(item)}
                                                        className="p-2 text-slate-500 hover:text-[#09C9CB] hover:bg-[#09C9CB]/10 rounded-xl transition-all"
                                                    >
                                                        <Edit size={18} />
                                                    </button>
                                                )}
                                                {onDelete && (
                                                    <button
                                                        onClick={() => onDelete(item.id)}
                                                        className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {data.length === 0 && (
                                <tr>
                                    <td colSpan={columns.length + ((onDelete || onEdit) ? 1 : 0)} className="p-24 text-center">
                                        <div className="flex flex-col items-center opacity-30">
                                            <IconUserCircle size={48} className="mb-4 text-slate-300" />
                                            <p className="italic text-slate-400 font-medium font-principal">
                                                {emptyMessage}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};
