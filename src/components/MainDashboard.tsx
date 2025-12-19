"use client";

import { useState } from "react";
import DeadhangTimer from "./DeadhangTimer";
import TrackForm from "./TrackForm";
import StatsCards from "./StatsCards";
import HistoryTable from "./HistoryTable";
import TrendChart from "./TrendChart";
import { LogOut, Plus, LayoutDashboard, History, Download } from "lucide-react";
import { signOutAction } from "@/lib/actions";
import ImportCSV from "./ImportCSV";

export default function MainDashboard({ initialSessions, initialStats, user }: any) {
    const [view, setView] = useState<"dashboard" | "track" | "history">("dashboard");
    const [timerDuration, setTimerDuration] = useState(0);

    const handleTimerStop = (seconds: number) => {
        setTimerDuration(seconds);
        setView("track");
    };

    const handleExport = () => {
        if (initialSessions.length === 0) return;
        const headers = ["Date", "Time", "Duration", "Location", "Grip", "PRE", "Weight", "Symptoms", "Notes"];
        const csvContent = [
            headers.join(","),
            ...initialSessions.map((s: any) => [
                s.date,
                s.time,
                s.duration,
                s.location,
                s.grip,
                s.pre,
                s.weight || "",
                `"${s.symptoms || ""}"`,
                `"${s.notes || ""}"`
            ].join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "deadhang_tracker_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 pb-24 md:pb-8">
            {/* Header */}
            <header className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-2xl font-black gradient-text">SAP DEADHANG</h1>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Active session: {user.name}</p>
                </div>
                <button
                    onClick={() => signOutAction()}
                    className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
                >
                    <LogOut size={20} />
                </button>
            </header>

            {/* Main Content */}
            <main className="space-y-12">
                {view === "dashboard" && (
                    <>
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Quick Overview</h2>
                            </div>
                            <StatsCards stats={initialStats} />
                        </section>

                        <section className="space-y-6">
                            <TrendChart sessions={initialSessions} />
                        </section>

                        <section className="flex flex-col items-center py-12">
                            <button
                                onClick={() => setView("track")}
                                className="btn-primary rounded-full px-12 py-4 shadow-xl shadow-blue-500/40 text-lg flex items-center gap-3"
                            >
                                <Plus size={24} /> Start New Session
                            </button>
                        </section>
                    </>
                )}

                {view === "track" && (
                    <section className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setView("dashboard")} className="text-slate-400 hover:text-white">← Back</button>
                            <h2 className="text-xl font-bold">New Session</h2>
                        </div>
                        <DeadhangTimer onStop={handleTimerStop} />
                        <TrackForm initialDuration={timerDuration} />
                    </section>
                )}

                {view === "history" && (
                    <section className="space-y-6 animate-in fade-in duration-500">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Full History</h2>
                            <div className="flex gap-2">
                                <ImportCSV />
                                <button onClick={handleExport} className="btn-secondary py-2 px-4 text-sm gap-2">
                                    <Download size={16} /> Export
                                </button>
                            </div>
                        </div>
                        <HistoryTable sessions={initialSessions} />
                    </section>
                )}
            </main>

            {/* Bottom Navigation (Modern Mobile Style) */}
            <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-4 rounded-full flex items-center gap-8 shadow-2xl z-50">
                <button
                    onClick={() => setView("dashboard")}
                    className={`flex flex-col items-center gap-1 transition-colors ${view === "dashboard" ? "text-blue-400" : "text-slate-500 hover:text-slate-300"}`}
                >
                    <LayoutDashboard size={20} />
                    <span className="text-[10px] font-bold uppercase">Stats</span>
                </button>
                <button
                    onClick={() => setView("track")}
                    className={`flex flex-col items-center gap-1 transition-colors ${view === "track" ? "text-blue-400" : "text-slate-500 hover:text-slate-300"}`}
                >
                    <Plus size={20} />
                    <span className="text-[10px] font-bold uppercase">Track</span>
                </button>
                <button
                    onClick={() => setView("history")}
                    className={`flex flex-col items-center gap-1 transition-colors ${view === "history" ? "text-blue-400" : "text-slate-500 hover:text-slate-300"}`}
                >
                    <History size={20} />
                    <span className="text-[10px] font-bold uppercase">History</span>
                </button>
            </nav>
        </div>
    );
}
