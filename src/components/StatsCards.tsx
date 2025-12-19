export default function StatsCards({ stats }: { stats: any }) {
    if (!stats) return null;

    const items = [
        { label: "Sessions", value: stats.totalSessions, sub: "Total tracked" },
        { label: "Avg Duration", value: `${stats.avgDuration}s`, sub: "Lifetime average" },
        { label: "Max Duration", value: `${stats.maxDuration}s`, sub: "Personal record" },
        { label: "Last 7 Avg", value: `${stats.last7Avg}s`, sub: "Recent trend" },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item, i) => (
                <div key={i} className="stat-card">
                    <p className="text-slate-400 text-sm font-medium mb-1">{item.label}</p>
                    <p className="text-3xl font-black gradient-text">{item.value}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-2">{item.sub}</p>
                </div>
            ))}
        </div>
    );
}
