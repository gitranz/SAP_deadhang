"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";

export default function TrendChart({ sessions }: { sessions: any[] }) {
    const data = sessions
        .slice()
        .reverse()
        .map((s) => ({
            date: s.date,
            duration: s.duration,
            weight: s.weight || 0,
        }));

    return (
        <div className="glass p-6 rounded-3xl h-[400px]">
            <h3 className="text-lg font-bold mb-6 text-slate-300">Performance Over Time</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorDur" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                        dataKey="date"
                        stroke="#64748b"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#64748b"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        label={{ value: 'Seconds', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 10 }}
                    />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
                        itemStyle={{ color: '#f8fafc' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="duration"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorDur)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
