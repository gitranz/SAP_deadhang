"use client";

import { useState, useEffect } from "react";
import { saveSessionAction } from "@/lib/actions";

interface TrackFormProps {
    initialDuration?: number;
}

const SYMPTOMS_OPTIONS = [
    "Forearm tightness",
    "Elbow soreness",
    "Wrist discomfort",
    "Shoulder strain",
    "Back tension",
];

export default function TrackForm({ initialDuration = 0 }: TrackFormProps) {
    const [duration, setDuration] = useState(initialDuration);
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (initialDuration > 0) {
            setDuration(initialDuration);
        }
    }, [initialDuration]);

    const toggleSymptom = (s: string) => {
        setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
    };

    async function handleSubmit(formData: FormData) {
        setStatus("Saving...");
        const data = {
            date: formData.get("date"),
            time: formData.get("time"),
            duration: duration,
            location: formData.get("location"),
            grip: formData.get("grip"),
            pre: formData.get("pre"),
            weight: formData.get("weight"),
            symptoms: symptoms.join(", "),
            notes: formData.get("notes"),
        };

        try {
            await saveSessionAction(data);
            setStatus("Saved successfully!");
            setSymptoms([]);
            setTimeout(() => setStatus(""), 3000);
        } catch (e) {
            setStatus("Error saving entry");
        }
    }

    const now = new Date();
    const defaultDate = now.toISOString().split('T')[0];
    const defaultTime = now.toTimeString().substring(0, 5);

    return (
        <form action={handleSubmit} className="glass p-6 rounded-3xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label>Date</label>
                    <input name="date" type="date" defaultValue={defaultDate} required />
                </div>
                <div>
                    <label>Time</label>
                    <input name="time" type="time" defaultValue={defaultTime} required />
                </div>
                <div>
                    <label>Duration (sec)</label>
                    <input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
                        required
                    />
                </div>
                <div>
                    <label>Location</label>
                    <select name="location" defaultValue="At Home">
                        <option>At Home</option>
                        <option>Gym</option>
                        <option>Hotel</option>
                        <option>At Work</option>
                    </select>
                </div>
                <div>
                    <label>Grip Type</label>
                    <select name="grip" defaultValue="Passive Hang">
                        <option>Passive Hang</option>
                        <option>Active Hang</option>
                        <option>One-Arm Assis</option>
                        <option>Towel Grip</option>
                        <option>Fingerboard</option>
                        <option>Mixed Grip</option>
                    </select>
                </div>
                <div>
                    <label>PRE (1-10)</label>
                    <div className="flex gap-4 items-center">
                        <input name="pre" type="range" min="1" max="10" step="1" className="accent-blue-500" />
                    </div>
                </div>
                <div>
                    <label>Weight (kg) [Optional]</label>
                    <input name="weight" type="number" step="0.1" placeholder="Add weight..." />
                </div>
            </div>

            <div>
                <label>Symptoms</label>
                <div className="flex flex-wrap gap-2">
                    {SYMPTOMS_OPTIONS.map(s => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => toggleSymptom(s)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${symptoms.includes(s)
                                    ? "bg-blue-600 border-blue-500 text-white"
                                    : "bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500"
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label>Notes</label>
                <textarea name="notes" rows={3} placeholder="How did it feel?"></textarea>
            </div>

            <div className="flex items-center justify-between gap-4">
                {status && <span className="text-sm text-blue-400 font-medium">{status}</span>}
                <button type="submit" className="btn-primary flex-1 max-w-[200px] ml-auto">
                    Save Entry
                </button>
            </div>
        </form>
    );
}
