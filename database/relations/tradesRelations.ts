import { relations } from "drizzle-orm";
import {
    tradesTable,
    usersTable,
    assetsTable,
    positionsTable,
} from '../tables';

export const tradesRelations = relations(tradesTable, ({ one }) => ({
    position: one(positionsTable, {
        fields: [tradesTable.positionId],
        references: [positionsTable.id],
    }),
    trader: one(usersTable, {
        fields: [tradesTable.traderSafeAddress],
        references: [usersTable.safeAddress],
    }),
    asset: one(assetsTable, {
        fields: [tradesTable.assetId],
        references: [assetsTable.id],
    }),
}));
