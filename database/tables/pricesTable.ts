import {
    numeric,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { assetsTable } from "./";

export const pricesTable = pgTable("prices", {
    id: uuid("id").defaultRandom().primaryKey(),
    assetId: uuid("assetId")
        .references(() => assetsTable.id)
        .notNull(),
    open: numeric("open", { precision: 38, scale: 20 }).notNull(),
    high: numeric("high", { precision: 38, scale: 20 }).notNull(),
    low: numeric("low", { precision: 38, scale: 20 }).notNull(),
    close: numeric("close", { precision: 38, scale: 20 }).notNull(), // used as primary price in OHLC model
    interval: varchar("interval", { length: 5 }).notNull(),
    timestamp: timestamp("timestamp").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
