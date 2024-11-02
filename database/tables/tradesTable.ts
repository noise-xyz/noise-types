import {
    boolean,
    integer,
    numeric,
    pgTable,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { usersTable, assetsTable, positionsTable } from "@/database/tables";

export const tradesTable = pgTable("trades", {
    id: integer("id").primaryKey().notNull(),
    positionId: uuid("positionId").references(() => positionsTable.id),
    traderSafeAddress: varchar("traderSafeAddress", { length: 42 }).references(
        () => usersTable.safeAddress,
    ),
    assetId: uuid("assetId").references(() => assetsTable.id),
    collateral: numeric("collateral", { precision: 38, scale: 2 }),
    leverage: numeric("leverage", { precision: 38, scale: 2 }),
    openPositionSize: numeric("openPositionSize", { precision: 38, scale: 2 }),
    closePositionSize: numeric("closePositionSize", {
        precision: 38,
        scale: 2,
    }), // null if open
    openPrice: numeric("openPrice", { precision: 38, scale: 2 }),
    closePrice: numeric("closePrice", { precision: 38, scale: 2 }), // null if open
    openTxHash: varchar("openTxHash", { length: 66 }),
    closeTxHash: varchar("closeTxHash", { length: 66 }), // null if open
    openTimestampUnix: integer("openTimestampUnix"),
    openTimestamp: timestamp("openTimestamp"),
    closeTimestampUnix: integer("closeTimestampUnix"), // null if open
    closeTimestamp: timestamp("closeTimestamp"), // null if open
    side: varchar("side"),
    status: varchar("status"),
    didGain: boolean("didGain"), // null if open
    settledProfitOrLossValue: numeric("settledProfitOrLossValue", {
        precision: 38,
        scale: 2,
    }), // null if open
    settledProfitOrLossPercent: numeric("settledProfitOrLossPercent", {
        precision: 38,
        scale: 2,
    }), // null if open
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
