"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Square, RotateCcw } from "lucide-react";

interface DeadhangTimerProps {
    onStop: (seconds: number) => void;
}

export default function DeadhangTimer({ onStop }: DeadhangTimerProps) {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const startTimeRef = useRef<number | null>(null);

    useEffect(() => {
        let interval: any;
        if (isActive) {
            interval = setInterval(() => {
                setTime(Math.round((Date.now() - (startTimeRef.current || Date.now())) / 1000));
            }, 100);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const handleStart = () => {
        startTimeRef.current = Date.now() - time * 1000;
        setIsActive(true);
    };

    const handleStop = () => {
        setIsActive(false);
        onStop(time);
    };

    const handleReset = () => {
        setIsActive(false);
        setTime(0);
        startTimeRef.current = null;
    };

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="glass p-8 rounded-3xl flex flex-col items-center gap-6">
            <div className="text-6xl font-mono font-black tabular-nums tracking-tighter text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                {formatTime(time)}
            </div>

            <div className="flex gap-4">
                {!isActive ? (
                    <button onClick={handleStart} className="btn-primary px-8">
                        <Play size={20} fill="currentColor" /> Start
                    </button>
                ) : (
                    <button onClick={handleStop} className="btn-secondary px-8 bg-rose-600/20 text-rose-400 hover:bg-rose-600/30 border border-rose-600/50">
                        <Square size={20} fill="currentColor" /> Stop + Fill
                    </button>
                )}
                <button onClick={handleReset} className="btn-secondary">
                    <RotateCcw size={20} />
                </button>
            </div>
        </div>
    );
}
