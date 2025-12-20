"use client";

import { useState } from "react";
import { saveSessionAction } from "@/lib/actions";
import { Upload } from "lucide-react";

export default function ImportCSV() {
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState("");

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const reader = new FileReader();

        reader.onload = async (event) => {
            const text = event.target?.result as string;
            const lines = text.split("\n");
            const headers = lines[0].split(",");

            let count = 0;
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i]) continue;
                const vals = lines[i].split(",");
                const entry: any = {};
                headers.forEach((h, idx) => {
                    const key = h.trim().toLowerCase();
                    entry[key] = vals[idx]?.replace(/"/g, "").trim();
                });

                // Map to DB schema
                try {
                    await saveSessionAction({
                        date: entry.date,
                        time: entry.time,
                        duration: entry.duration || entry["duration (s)"],
                        location: entry.location,
                        grip: entry.grip || entry["grip type"],
                        pre: entry.pre,
                        weight: entry.weight || entry["weight (kg)"],
                        symptoms: entry.symptoms,
                        notes: entry.notes,
                    });
                    count++;
                } catch (err) {
                    console.error("Failed to import line", i);
                }
            }
            setFeedback(`Successfully imported ${count} entries.`);
            setLoading(false);
        };

        reader.readAsText(file);
    };

    return (
        <div className="relative">
            <label className="btn-secondary py-2 px-4 text-sm gap-2 cursor-pointer flex items-center justify-center">
                <Upload size={16} />
                <span>{loading ? "Importing..." : "Import CSV"}</span>
                <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} disabled={loading} />
            </label>
            {feedback && <p className="absolute top-full left-0 w-full text-[10px] text-blue-400 text-center mt-1">{feedback}</p>}
        </div>
    );
}
