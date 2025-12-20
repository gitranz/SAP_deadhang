"use client";

import { useState } from "react";
import { Trash2, Pencil, Check, X } from "lucide-react";
import { deleteSessionAction, updateSessionAction } from "@/lib/actions";

interface Session {
    id: string;
    date: string;
    time: string;
    duration: number;
    grip: string;
    weight: number | null;
    pre: number;
    location: string;
    symptoms: string | null;
    notes: string | null;
}

export default function HistoryTable({ sessions }: { sessions: Session[] }) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editForm, setEditForm] = useState<Record<string, string | number | null>>({});

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this session?")) {
            await deleteSessionAction(id);
        }
    };

    const handleEditClick = (session: Session) => {
        setEditingId(session.id);
        setEditForm({
            date: session.date,
            time: session.time,
            duration: session.duration,
            grip: session.grip,
            weight: session.weight,
            pre: session.pre,
            location: session.location, // preserving hidden fields
            symptoms: session.symptoms,
            notes: session.notes
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSave = async (id: string) => {
        try {
            await updateSessionAction(id, editForm);
            setEditingId(null);
            setEditForm({});
        } catch {
            alert("Failed to update session");
        }
    };

    const handleChange = (field: string, value: string | number | null) => {
        setEditForm((prev) => ({ ...prev, [field]: value }));
    };

    const GRIP_OPTIONS = [
        "Passive Hang",
        "Active Hang",
        "One-Arm Assis",
        "Towel Grip",
        "Fingerboard",
        "Mixed Grip"
    ];

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
                        {sessions.map((s) => {
                            const isEditing = editingId === s.id;
                            return (
                                <tr key={s.id} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    type="date"
                                                    value={editForm.date ?? ""}
                                                    onChange={(e) => handleChange("date", e.target.value)}
                                                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                                                />
                                                <input
                                                    type="time"
                                                    value={editForm.time ?? ""}
                                                    onChange={(e) => handleChange("time", e.target.value)}
                                                    className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <p className="text-sm font-medium">{s.date}</p>
                                                <p className="text-[10px] text-slate-500">{s.time}</p>
                                            </>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                value={editForm.duration ?? ""}
                                                onChange={(e) => handleChange("duration", e.target.value)}
                                                className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                                            />
                                        ) : (
                                            <span className="text-sm font-bold text-blue-400">{s.duration}s</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <select
                                                value={editForm.grip ?? ""}
                                                onChange={(e) => handleChange("grip", e.target.value)}
                                                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                                            >
                                                {GRIP_OPTIONS.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className="text-sm text-slate-300">{s.grip}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={editForm.weight ?? ""}
                                                onChange={(e) => handleChange("weight", e.target.value)}
                                                placeholder="0"
                                                className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                                            />
                                        ) : (
                                            <span className="text-sm text-slate-300">{s.weight ? `${s.weight}kg` : "-"}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {isEditing ? (
                                            <input
                                                type="number"
                                                min="1"
                                                max="10"
                                                value={editForm.pre ?? ""}
                                                onChange={(e) => handleChange("pre", e.target.value)}
                                                className="w-14 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 focus:outline-none focus:border-blue-500"
                                            />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-500"
                                                        style={{ width: `${(s.pre / 10) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-[10px] text-slate-500">{s.pre}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={() => handleSave(s.id)}
                                                        className="p-2 text-emerald-500 hover:text-emerald-400 transition-colors"
                                                        title="Save"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="p-2 text-slate-500 hover:text-slate-400 transition-colors"
                                                        title="Cancel"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEditClick(s)}
                                                        className="p-2 text-blue-500 hover:text-blue-400 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(s.id)}
                                                        className="p-2 text-rose-500 hover:text-rose-400 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
