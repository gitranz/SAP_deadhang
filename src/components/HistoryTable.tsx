"use client";

import { Trash2 } from "lucide-react";
import { deleteSessionAction } from "@/lib/actions";

export default function HistoryTable({ sessions }: { sessions: any[] }) {
    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this session?")) {
            await deleteSessionAction(id);
        }
    };

    return (
        <div className="glass rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/50">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Date/Time</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Grip</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Weight</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">PRE</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {sessions.map((s) => (
                            <tr key={s.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium">{s.date}</p>
                                    <p className="text-[10px] text-slate-500">{s.time}</p>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-blue-400">{s.duration}s</td>
                                <td className="px-6 py-4 text-sm text-slate-300">{s.grip}</td>
                                <td className="px-6 py-4 text-sm text-slate-300">{s.weight ? `${s.weight}kg` : "-"}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500"
                                                style={{ width: `${(s.pre / 10) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-[10px] text-slate-500">{s.pre}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDelete(s.id)}
                                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
