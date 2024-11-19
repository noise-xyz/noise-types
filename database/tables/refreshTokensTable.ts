import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./usersTable";

export const refreshTokensTable = pgTable("refreshTokensTable", {
    id: uuid("id").defaultRandom().primaryKey(),
    accountId: uuid("user_id").references(() => usersTable.id, {
        onDelete: "cascade",
    }),
    token: text("token").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
