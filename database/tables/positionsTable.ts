import {
    numeric,
    pgTable,
    uuid,
    timestamp,
    integer,
} from "drizzle-orm/pg-core";
import { usersTable, assetsTable } from "./";

export const positionsTable = pgTable("positions", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("userId").references(() => usersTable.id),
    assetId: uuid("assetId").references(() => assetsTable.id),
    runningPositionSizeVector: numeric("runningPositionSizeVector", {
        precision: 38,
        scale: 20,
    }),
    runningPositionSizeScalar: numeric("runningPositionSizeScalar", {
        precision: 38,
        scale: 20,
    }),
    runningCollateral: numeric("runningCollateral", {
        precision: 38,
        scale: 20,
    }),
    totalFeesSettled: numeric("totalFeesSettled", { precision: 38, scale: 20 }),
    averageEntryPrice: numeric("averageEntryPrice", {
        precision: 38,
        scale: 20,
    }),
    liquidationPrice: numeric("liquidationPrice", { precision: 38, scale: 20 }),
    settledProfitOrLossValue: numeric("settledProfitOrLossValue", {
        precision: 38,
        scale: 20,
    }),
    settledProfitOrLossPercent: numeric("settledProfitOrLossPercent", {
        precision: 38,
        scale: 20,
    }),
    nClosedTrades: integer("nClosedTrades"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
