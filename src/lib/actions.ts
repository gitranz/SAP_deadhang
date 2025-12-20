"use server";

import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { signIn, signOut, auth } from "@/auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function signUpAction(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) return { error: "Missing fields" };

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        await db.insert(users).values({
            username,
            password: hashedPassword,
        });
        return { success: true };
    } catch (e) {
        return { error: "Username already exists" };
    }
}

export async function signInAction(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
        await signIn("credentials", {
            username,
            password,
            redirect: true,
            redirectTo: "/",
        });
    } catch (error: any) {
        if (error.type === "CredentialsSignin") {
            return { error: "Invalid credentials" };
        }
        throw error;
    }
}

export async function signOutAction() {
    await signOut({ redirectTo: "/login" });
}

export async function saveSessionAction(data: any) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.insert(sessions).values({
        userId: session.user.id,
        date: data.date,
        time: data.time,
        duration: parseInt(data.duration),
        location: data.location,
        grip: data.grip,
        pre: parseFloat(data.pre),
        weight: data.weight ? parseFloat(data.weight) : null,
        symptoms: data.symptoms,
        notes: data.notes,
    });

    revalidatePath("/");
}

export async function updateSessionAction(id: string, data: any) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.update(sessions)
        .set({
            date: data.date,
            time: data.time,
            duration: parseInt(data.duration),
            location: data.location,
            grip: data.grip,
            pre: parseFloat(data.pre),
            weight: data.weight ? parseFloat(data.weight) : null,
            symptoms: data.symptoms,
            notes: data.notes,
        })
        .where(eq(sessions.id, id));

    revalidatePath("/");
}

export async function deleteSessionAction(id: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await db.delete(sessions).where(eq(sessions.id, id));
    revalidatePath("/");
}

export async function getSessionsAction() {
    const session = await auth();
    if (!session?.user?.id) return [];

    return db.select().from(sessions).where(eq(sessions.userId, session.user.id)).orderBy(desc(sessions.createdAt));
}

export async function getStatsAction() {
    const session = await auth();
    if (!session?.user?.id) return null;

    const allSessions = await db.select().from(sessions).where(eq(sessions.userId, session.user.id));

    if (allSessions.length === 0) return null;

    const totalSessions = allSessions.length;
    const totalDuration = allSessions.reduce((acc, s) => acc + s.duration, 0);
    const avgDuration = totalDuration / totalSessions;
    const maxDuration = Math.max(...allSessions.map(s => s.duration));

    // Last 7 sessions avg
    const last7 = allSessions.slice(-7);
    const last7Avg = last7.reduce((acc, s) => acc + s.duration, 0) / last7.length;

    return {
        totalSessions,
        avgDuration: avgDuration.toFixed(1),
        maxDuration,
        last7Avg: last7Avg.toFixed(1),
    };
}
