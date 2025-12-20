"use client";

import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

interface Session {
    date: string;
    time: string;
    duration: number;
    weight: number | null;
}

export default function TrendChart({ sessions }: { sessions: Session[] }) {
    // Sort sessions chronologically first
    const sortedSessions = sessions.slice().sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA.getTime() - dateB.getTime();
    });

    // Map to data with unique keys to handle same-minute entries
    const data = sortedSessions.map((s, i) => ({
        date: s.date,
        uniqueDatetime: `${s.date} ${s.time}#${i}`, // Unique key for XAxis
        displayTime: `${s.date} ${s.time}`, // For tooltip display
        duration: s.duration,
        weight: s.weight || 0,
    }));

    return (
        <div className="glass p-6 rounded-3xl h-[400px] flex flex-col">
            <style jsx global>{`
                .recharts-wrapper:focus,
                .recharts-wrapper:focus-visible,
                .recharts-surface:focus,
                .recharts-surface:focus-visible,
                .recharts-layer:focus,
                .recharts-layer:focus-visible {
                    outline: none !important;
                    box-shadow: none !important; // Tailwind uses box-shadow for rings
                    border: none !important;
                }
                
                /* Target all SVGs and paths within the chart */
                .recharts-wrapper svg:focus,
                .recharts-wrapper svg:focus-visible,
                .recharts-wrapper path:focus,
                .recharts-wrapper path:focus-visible {
                    outline: none !important;
                    box-shadow: none !important;
                }
            `}</style>
            <h3 className="text-lg font-bold mb-6 text-slate-300">Performance Over Time</h3>
            <div className="flex-1 min-h-0 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorDur" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis
                            dataKey="uniqueDatetime"
                            stroke="#64748b"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(val) => val.split(' ')[0]}
                        />
                        <YAxis
                            yAxisId="left"
                            stroke="#64748b"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            label={{ value: 'Seconds', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            stroke="#64748b"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            label={{ value: 'Weight (kg)', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 10 }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
                            itemStyle={{ color: '#f8fafc' }}
                            labelStyle={{ color: '#94a3b8', marginBottom: '8px' }}
                            labelFormatter={(label) => label.split('#')[0]}
                        />
                        <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="duration"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorDur)"
                            name="Duration"
                        />
                        <Area
                            yAxisId="right"
                            type="monotone"
                            dataKey="weight"
                            stroke="#f59e0b"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorWeight)"
                            name="Weight"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
