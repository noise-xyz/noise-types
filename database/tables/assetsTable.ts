import { pgTable, uuid, varchar, timestamp } from "drizzle-orm/pg-core";

export const assetsTable = pgTable("assets", {
    id: uuid("id").defaultRandom().primaryKey(),
    assetName: varchar("assetName"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
