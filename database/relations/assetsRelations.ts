import { relations } from "drizzle-orm";
import {
    assetsTable,
    pricesTable,
    activityEventsTable,
    tradesTable,
} from "@/database/tables";

export const assetsRelations = relations(assetsTable, ({ many }) => ({
    prices: many(pricesTable),
    activityEvents: many(activityEventsTable),
    trades: many(tradesTable),
}));