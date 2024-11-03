import { relations } from "drizzle-orm";
import {
    activityEventsTable,
    assetsTable,
    usersTable,
} from '../tables';

export const activityEventsRelations = relations(
    activityEventsTable,
    ({ one }) => ({
        asset: one(assetsTable, {
            fields: [activityEventsTable.assetId],
            references: [assetsTable.id],
        }),
        trader: one(usersTable, {
            fields: [activityEventsTable.traderSafeAddress],
            references: [usersTable.safeAddress],
        }),
    }),
);
