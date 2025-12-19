import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    username: text("username").notNull().unique(),
    password: text("password").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const sessions = sqliteTable("sessions", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
    date: text("date").notNull(),
    time: text("time").notNull(),
    duration: integer("duration").notNull(),
    location: text("location").notNull(),
    grip: text("grip").notNull(),
    pre: real("pre"),
    weight: real("weight"),
    symptoms: text("symptoms"), // JSON string or comma separated
    notes: text("notes"),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
