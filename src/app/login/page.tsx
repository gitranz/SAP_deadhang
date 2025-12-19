"use client";

import { useState } from "react";
import { signInAction, signUpAction } from "@/lib/actions";

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(formData: FormData) {
        setError("");
        if (isSignUp) {
            const res = await signUpAction(formData);
            if (res?.error) {
                setError(res.error);
            } else {
                setIsSignUp(false);
                setError("Success! Please sign in.");
            }
        } else {
            const res = await signInAction(formData);
            if (res?.error) {
                setError(res.error);
            }
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="glass w-full max-w-md p-8 rounded-3xl shadow-2xl">
                <h1 className="text-3xl font-bold text-center mb-8 gradient-text">
                    {isSignUp ? "Create Account" : "Control Center"}
                </h1>

                <form action={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="username">Username</label>
                        <input name="username" id="username" type="text" required />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input name="password" id="password" type="password" required />
                    </div>

                    {error && (
                        <p className={`text-sm text-center ${error.includes("Success") ? "text-emerald-400" : "text-rose-400"}`}>
                            {error}
                        </p>
                    )}

                    <button type="submit" className="btn-primary w-full shadow-lg shadow-blue-500/20">
                        {isSignUp ? "Sign Up" : "Sign In"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    );
}
