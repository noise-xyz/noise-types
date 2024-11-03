import {
    numeric,
    pgTable,
    uuid,
    varchar,
    timestamp,
    integer,
} from "drizzle-orm/pg-core";
import { usersTable, assetsTable } from './';

export const positionsTable = pgTable("positions", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("userId").references(() => usersTable.id),
    assetId: uuid("assetId").references(() => assetsTable.id),
    direction: varchar("direction"),
    runningPositionSizeVector: numeric("runningPositionSizeVector", {
        precision: 38,
        scale: 2,
    }),
    runningPositionSizeScalar: numeric("runningPositionSizeScalar", {
        precision: 38,
        scale: 2,
    }),
    runningQuantity: numeric("runningQuantity", {
        precision: 38,
        scale: 2,
    }),
    runningCollateral: numeric("runningCollateral", {
        precision: 38,
        scale: 2,
    }),
    totalFeesSettled: numeric("totalFeesSettled", { precision: 38, scale: 2 }),
    averageEntryPrice: numeric("averageEntryPrice", {
        precision: 38,
        scale: 2,
    }),
    liquidationPrice: numeric("liquidationPrice", { precision: 38, scale: 2 }),
    settledProfitOrLossValue: numeric("settledProfitOrLossValue", {
        precision: 38,
        scale: 2,
    }),
    settledProfitOrLossPercent: numeric("settledProfitOrLossPercent", {
        precision: 38,
        scale: 2,
    }),
    nClosedTrades: integer("nClosedTrades"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
