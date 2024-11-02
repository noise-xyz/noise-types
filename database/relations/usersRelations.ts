import { relations } from "drizzle-orm";
import {
    usersTable,
    positionsTable,
    activityEventsTable,
    tradesTable,
} from "@/database/tables";

export const usersRelations = relations(usersTable, ({ many }) => ({
    positions: many(positionsTable),
    trades: many(tradesTable),
    activityEvents: many(activityEventsTable),
}));
