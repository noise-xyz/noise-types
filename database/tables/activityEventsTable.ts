import {
    integer,
    numeric,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { assetsTable, usersTable } from './';

export const activityEventsTable = pgTable("activityEvent", {
    id: uuid("id").defaultRandom().primaryKey(),
    assetId: uuid("assetId").references(() => assetsTable.id),
    traderSafeAddress: varchar("traderSafeAddress").references(
        () => usersTable.safeAddress,
    ),
    timestampUnix: integer("timestampUnix"),
    timestamp: timestamp("timestamp"),
    eventType: varchar("eventType"),
    side: varchar("side"),
    priceAtTime: numeric("priceAtTime", { precision: 38, scale: 2 }),
    positionSize: numeric("positionSize", { precision: 38, scale: 2 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
