import { relations } from "drizzle-orm";
import { pricesTable, assetsTable } from "@/database/tables";

export const pricesRelations = relations(pricesTable, ({ one }) => ({
    asset: one(assetsTable, {
        fields: [pricesTable.assetId],
        references: [assetsTable.id],
    }),
}));
